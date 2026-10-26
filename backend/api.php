<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once __DIR__ . '/config.php';

try {
    $db = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_STRINGIFY_FETCHES => false,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection error: ' . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $input['username'] ?? '';
    $password = $input['password'] ?? '';
    
    $stmt = $db->prepare("SELECT * FROM users WHERE username = ? AND password_hash = ?");
    $stmt->execute([$username, $password]); // Simple plaintext check for MVP as planned
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        $token = md5($username . time());
        $db->prepare("UPDATE users SET token = ? WHERE id = ?")->execute([$token, $user['id']]);
        echo json_encode(['status' => 'success', 'token' => $token]);
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    }
    exit;
}

// Check Authentication for all other routes
$auth_header = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $auth_header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
} elseif (function_exists('getallheaders')) {
    $headers = getallheaders();
    foreach ($headers as $key => $value) {
        if (strtolower($key) === 'authorization') {
            $auth_header = $value;
            break;
        }
    }
}
if (!$auth_header && isset($input['token'])) {
    $auth_header = 'Bearer ' . $input['token'];
}

$token = str_replace('Bearer ', '', $auth_header);

if (!$token) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit;
}

$stmt = $db->prepare("SELECT * FROM users WHERE token = ?");
$stmt->execute([$token]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Invalid token']);
    exit;
}

// BARS MASTER ENDPOINTS
if ($action === 'add_bar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($input['name'] ?? '');
    if ($name !== '') {
        $stmt = $db->prepare("INSERT INTO bars (name) VALUES (?)");
        $stmt->execute([$name]);
        $new_bar_id = (int)$db->lastInsertId();
        // Auto-map all existing brands to the new bar by default
        $db->exec("INSERT IGNORE INTO bar_brands (bar_id, brand_id) SELECT $new_bar_id, id FROM brands");
        echo json_encode(['status' => 'success', 'id' => $new_bar_id]);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Name is required']);
    }
    exit;
}

if ($action === 'edit_bar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    $name = trim($input['name'] ?? '');
    if ($id > 0 && $name !== '') {
        $stmt = $db->prepare("UPDATE bars SET name = ? WHERE id = ?");
        $stmt->execute([$name, $id]);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID and Name are required']);
    }
    exit;
}

if ($action === 'delete_bar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($input['id']) ? (int)$input['id'] : 0;
    if ($id > 0) {
        $db->prepare("DELETE FROM bar_brands WHERE bar_id = ?")->execute([$id]);
        $db->prepare("DELETE FROM daily_stock WHERE bar_id = ?")->execute([$id]);
        $db->prepare("DELETE FROM bars WHERE id = ?")->execute([$id]);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID is required']);
    }
    exit;
}

// BAR BRANDS MAPPING ENDPOINTS
if ($action === 'get_all_brands') {
    $stmt = $db->query("SELECT id, category, name, sale_mrp, ind_value FROM brands ORDER BY category, name");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($action === 'add_brand' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $category = trim($input['category'] ?? 'UNCATEGORIZED');
    $name = trim($input['name'] ?? '');
    $sale_mrp = (float)($input['sale_mrp'] ?? 0);
    $ind_value = (float)($input['ind_value'] ?? 0);

    if ($name !== '') {
        $stmt = $db->prepare("INSERT INTO brands (category, name, sale_mrp, ind_value) VALUES (?, ?, ?, ?)");
        $stmt->execute([$category, $name, $sale_mrp, $ind_value]);
        $new_brand_id = (int)$db->lastInsertId();

        // Auto-map new brand to all existing bars by default
        $db->exec("INSERT IGNORE INTO bar_brands (bar_id, brand_id) SELECT id, $new_brand_id FROM bars");

        echo json_encode(['status' => 'success', 'id' => $new_brand_id]);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Brand name is required']);
    }
    exit;
}

if ($action === 'edit_brand' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = (int)($input['id'] ?? 0);
    $category = trim($input['category'] ?? 'UNCATEGORIZED');
    $name = trim($input['name'] ?? '');
    $sale_mrp = (float)($input['sale_mrp'] ?? 0);
    $ind_value = (float)($input['ind_value'] ?? 0);

    if ($id > 0 && $name !== '') {
        $stmt = $db->prepare("UPDATE brands SET category = ?, name = ?, sale_mrp = ?, ind_value = ? WHERE id = ?");
        $stmt->execute([$category, $name, $sale_mrp, $ind_value, $id]);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Valid ID and Brand Name are required']);
    }
    exit;
}

if ($action === 'get_bar_brands') {
    $bar_id = (int)($_GET['bar_id'] ?? 0);
    $stmt = $db->prepare("SELECT brand_id FROM bar_brands WHERE bar_id = ?");
    $stmt->execute([$bar_id]);
    $brand_ids = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode(['status' => 'success', 'brand_ids' => array_map('intval', $brand_ids)]);
    exit;
}

if ($action === 'save_bar_brands' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $bar_id = (int)($input['bar_id'] ?? 0);
    $brand_ids = $input['brand_ids'] ?? [];

    if ($bar_id <= 0) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Bar ID is required']);
        exit;
    }

    $db->beginTransaction();
    try {
        $db->prepare("DELETE FROM bar_brands WHERE bar_id = ?")->execute([$bar_id]);
        if (!empty($brand_ids)) {
            $stmt = $db->prepare("INSERT INTO bar_brands (bar_id, brand_id) VALUES (?, ?)");
            foreach ($brand_ids as $brand_id) {
                $stmt->execute([$bar_id, (int)$brand_id]);
            }
        }
        $db->commit();
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

// EXISTING STOCK ENDPOINTS
if ($action === 'get_bars') {
    $stmt = $db->query("SELECT * FROM bars");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
}

if ($action === 'get_stock') {
    $bar_id = (int)($_GET['bar_id'] ?? 1);
    $date = $_GET['date'] ?? date('Y-m-d');

    // Fetch mapped brand IDs for this bar
    $stmt_mapped = $db->prepare("SELECT brand_id FROM bar_brands WHERE bar_id = ?");
    $stmt_mapped->execute([$bar_id]);
    $mapped_brand_ids = array_map('intval', $stmt_mapped->fetchAll(PDO::FETCH_COLUMN));
    $has_mappings = (count($mapped_brand_ids) > 0);

    $stmt = $db->prepare("SELECT d.*, b.name, b.category, b.sale_mrp, b.ind_value 
                          FROM daily_stock d 
                          JOIN brands b ON d.brand_id = b.id 
                          WHERE d.bar_id = ? AND d.date = ?");
    $stmt->execute([$bar_id, $date]);
    $current_stock = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($current_stock) > 0) {
        if ($has_mappings) {
            $mapped_set = array_flip($mapped_brand_ids);
            $current_stock = array_values(array_filter($current_stock, function($row) use ($mapped_set) {
                return isset($mapped_set[(int)$row['brand_id']]);
            }));
        }
        echo json_encode(['status' => 'success', 'data' => $current_stock, 'is_new' => false]);
    } else {
        $stmt = $db->prepare("SELECT date FROM daily_stock WHERE bar_id = ? AND date < ? ORDER BY date DESC LIMIT 1");
        $stmt->execute([$bar_id, $date]);
        $prev_date_row = $stmt->fetch(PDO::FETCH_ASSOC);

        $new_stock = [];
        if ($prev_date_row) {
            $prev_date = $prev_date_row['date'];
            $stmt = $db->prepare("SELECT d.cl_st, b.id as brand_id, b.name, b.category, b.sale_mrp, b.ind_value 
                                  FROM daily_stock d 
                                  JOIN brands b ON d.brand_id = b.id 
                                  WHERE d.bar_id = ? AND d.date = ?");
            $stmt->execute([$bar_id, $prev_date]);
            $prev_stock = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $mapped_set = $has_mappings ? array_flip($mapped_brand_ids) : null;

            foreach ($prev_stock as $row) {
                $brand_id = (int)$row['brand_id'];
                if ($has_mappings && !isset($mapped_set[$brand_id])) {
                    continue;
                }
                $new_stock[] = [
                    'brand_id' => $brand_id,
                    'name' => $row['name'],
                    'category' => $row['category'],
                    'sale_mrp' => $row['sale_mrp'],
                    'ind_value' => $row['ind_value'],
                    'op_st' => $row['cl_st'],
                    'pr_st' => 0,
                    'total_st' => $row['cl_st'],
                    'cl_st' => 0,
                    'sl_st' => 0,
                    'sale_amount' => 0,
                    'cl_st_amount' => 0,
                ];
            }
        } else {
            if ($has_mappings) {
                $in_clause = implode(',', array_fill(0, count($mapped_brand_ids), '?'));
                $stmt = $db->prepare("SELECT id as brand_id, name, category, sale_mrp, ind_value FROM brands WHERE id IN ($in_clause) ORDER BY category, name");
                $stmt->execute($mapped_brand_ids);
            } else {
                $stmt = $db->query("SELECT id as brand_id, name, category, sale_mrp, ind_value FROM brands ORDER BY category, name");
            }
            $all_brands = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($all_brands as $row) {
                $new_stock[] = [
                    'brand_id' => (int)$row['brand_id'],
                    'name' => $row['name'],
                    'category' => $row['category'],
                    'sale_mrp' => $row['sale_mrp'],
                    'ind_value' => $row['ind_value'],
                    'op_st' => 0,
                    'pr_st' => 0,
                    'total_st' => 0,
                    'cl_st' => 0,
                    'sl_st' => 0,
                    'sale_amount' => 0,
                    'cl_st_amount' => 0,
                ];
            }
        }
        echo json_encode(['status' => 'success', 'data' => $new_stock, 'is_new' => true]);
    }
    exit;
}

if ($action === 'save_stock' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $bar_id = $input['bar_id'] ?? 1;
    $date = $input['date'] ?? date('Y-m-d');
    $items = $input['items'] ?? [];

    $db->beginTransaction();
    try {
        $stmt = $db->prepare("DELETE FROM daily_stock WHERE bar_id = ? AND date = ?");
        $stmt->execute([$bar_id, $date]);

        $stmt = $db->prepare("INSERT INTO daily_stock 
            (bar_id, date, brand_id, op_st, pr_st, total_st, cl_st, sl_st, sale_amount, cl_st_amount) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $prev_cl_st_map = [];
        foreach ($items as $item) {
            $stmt->execute([
                $bar_id,
                $date,
                $item['brand_id'],
                $item['op_st'],
                $item['pr_st'],
                $item['total_st'],
                $item['cl_st'],
                $item['sl_st'],
                $item['sale_amount'],
                $item['cl_st_amount']
            ]);
            $prev_cl_st_map[$item['brand_id']] = $item['cl_st'];
        }

        $stmt_future = $db->prepare("SELECT DISTINCT date FROM daily_stock WHERE bar_id = ? AND date > ? ORDER BY date ASC");
        $stmt_future->execute([$bar_id, $date]);
        $future_dates = $stmt_future->fetchAll(PDO::FETCH_ASSOC);

        $stmt_items = $db->prepare("SELECT d.*, b.sale_mrp, b.ind_value 
            FROM daily_stock d 
            JOIN brands b ON d.brand_id = b.id 
            WHERE d.bar_id = ? AND d.date = ?");
            
        $stmt_update = $db->prepare("UPDATE daily_stock 
            SET op_st = ?, total_st = ?, cl_st = ?, sl_st = ?, sale_amount = ?, cl_st_amount = ? 
            WHERE id = ?");

        foreach ($future_dates as $f_date_row) {
            $f_date = $f_date_row['date'];
            $stmt_items->execute([$bar_id, $f_date]);
            $f_items = $stmt_items->fetchAll(PDO::FETCH_ASSOC);

            foreach ($f_items as $f_item) {
                $brand_id = $f_item['brand_id'];
                if (isset($prev_cl_st_map[$brand_id])) {
                    $new_op_st = $prev_cl_st_map[$brand_id];
                    $pr_st = $f_item['pr_st'];
                    $cl_st = $f_item['cl_st'];
                    $sale_mrp = $f_item['sale_mrp'];
                    $ind_value = $f_item['ind_value'];

                    $total_st = $new_op_st + $pr_st;
                    if ($total_st < $cl_st) {
                        $cl_st = $total_st;
                    }
                    $sl_st = $total_st - $cl_st;
                    $sale_amount = $sl_st * $sale_mrp;
                    $cl_st_amount = $cl_st * $ind_value;

                    $stmt_update->execute([
                        $new_op_st, $total_st, $cl_st, $sl_st, $sale_amount, $cl_st_amount, $f_item['id']
                    ]);
                    $prev_cl_st_map[$brand_id] = $cl_st;
                }
            }
        }

        $db->commit();
        echo json_encode(['status' => 'success', 'message' => 'Stock saved and cascaded successfully']);
    } catch (Exception $e) {
        $db->rollBack();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
