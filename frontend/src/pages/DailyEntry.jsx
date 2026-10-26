import { useState, useEffect } from 'react';
import { getStock, saveStock, getBars } from '../api';
import { useNotification } from '../components/NotificationProvider';
import { Save, Calendar, Loader2 } from 'lucide-react';

function DailyEntry() {
  const { showToast } = useNotification();
  const [bars, setBars] = useState([]);
  const [selectedBar, setSelectedBar] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchBars();
  }, []);

  useEffect(() => {
    if (selectedBar && date) {
      fetchStock();
    }
  }, [selectedBar, date]);

  const fetchBars = async () => {
    try {
      const data = await getBars();
      const barsList = Array.isArray(data) ? data : [];
      setBars(barsList);
      if (barsList.length > 0) {
        setSelectedBar(barsList[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch bars', err);
      showToast('Failed to load bar locations', 'error');
    }
  };

  const fetchStock = async () => {
    setLoading(true);
    try {
      const response = await getStock(selectedBar, date);
      const rawData = response.data || [];
      const formattedItems = rawData.map(item => ({
        ...item,
        op_st: Number(item.op_st) || 0,
        pr_st: Number(item.pr_st) || 0,
        total_st: Number(item.total_st) || 0,
        cl_st: Number(item.cl_st) || 0,
        sl_st: Number(item.sl_st) || 0,
        sale_mrp: Number(item.sale_mrp) || 0,
        sale_amount: Number(item.sale_amount) || 0,
        ind_value: Number(item.ind_value) || 0,
        cl_st_amount: Number(item.cl_st_amount) || 0,
      }));
      setItems(formattedItems);
      setIsNew(!!response.is_new);
    } catch (err) {
      console.error('Failed to fetch stock', err);
      showToast('Error fetching stock data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    const item = { ...newItems[index] };
    
    // Parse value as integer or float, fallback to 0
    let val = parseFloat(value);
    if (isNaN(val)) val = 0;

    item[field] = val;

    // Recalculate based on rules
    item.total_st = item.op_st + item.pr_st;
    item.sl_st = Math.max(0, item.total_st - item.cl_st); // Cannot sell negative
    item.sale_amount = item.sl_st * item.sale_mrp;
    item.cl_st_amount = item.cl_st * item.ind_value;

    newItems[index] = item;
    setItems(newItems);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveStock(selectedBar, date, items);
      showToast('Daily stock data saved successfully!', 'success');
      setIsNew(false);
    } catch (err) {
      console.error('Failed to save stock', err);
      showToast('Failed to save stock data', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Group items by category
  const categories = {};
  items.forEach((item, index) => {
    if (!categories[item.category]) {
      categories[item.category] = [];
    }
    categories[item.category].push({ ...item, originalIndex: index });
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 pb-24 transition-colors">
      {/* Responsive Header */}
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-16 z-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Daily Stock Entry</h1>
            <span className="text-xs bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800 sm:hidden">
              {items.length} Brands
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <select 
              value={selectedBar} 
              onChange={e => setSelectedBar(e.target.value)}
              className="flex-1 sm:flex-none min-w-[140px] rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
            >
              {bars.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            
            <div className="relative flex-1 sm:flex-none min-w-[140px]">
              <Calendar className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full pl-8 rounded-md border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 border"
              />
            </div>
            
            <button 
              onClick={handleSave}
              disabled={loading || saving}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
              Save Stock
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action Button for Mobile Saving */}
      <button 
        onClick={handleSave}
        disabled={loading || saving}
        className="sm:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-medium text-sm rounded-full shadow-2xl hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-transform"
        title="Save Stock Entry"
      >
        {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
        <span>Save Stock</span>
      </button>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 mt-4 sm:mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <span className="ml-2 text-gray-500 dark:text-slate-400">Loading stock data...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400">
            No items found for this bar.
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {isNew && (
              <div className="bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-400 dark:border-blue-500 p-3 sm:p-4 rounded-r-md border-r border-t border-b border-blue-200 dark:border-blue-900">
                <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> You are entering data for a new day. Opening stock has been populated from yesterday's closing stock.
                </p>
              </div>
            )}
            
            {Object.entries(categories).map(([category, catItems]) => (
              <div key={category} className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="bg-gray-100 dark:bg-slate-800/90 px-4 py-2.5 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{category}</h3>
                  <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">{catItems.length} Brands</span>
                </div>

                {/* Horizontally Scrollable Table with Sticky Brand Column */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-xs sm:text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="sticky left-0 bg-gray-50 dark:bg-slate-800 z-10 px-3 sm:px-6 py-3 text-left font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                          Brand
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">OP ST</th>
                        <th className="px-2 sm:px-6 py-3 text-right font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider bg-blue-50/80 dark:bg-blue-950/40">PR ST</th>
                        <th className="px-3 sm:px-6 py-3 text-right font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider">Total ST</th>
                        <th className="px-2 sm:px-6 py-3 text-right font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider bg-green-50/80 dark:bg-emerald-950/40">CL ST</th>
                        <th className="px-3 sm:px-6 py-3 text-right font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">SL ST</th>
                        <th className="px-3 sm:px-6 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">SALE MRP</th>
                        <th className="px-3 sm:px-6 py-3 text-right font-semibold text-green-600 dark:text-emerald-400 uppercase tracking-wider">SALE AMT</th>
                        <th className="px-3 sm:px-6 py-3 text-right font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">IND Value</th>
                        <th className="px-3 sm:px-6 py-3 text-right font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">CL-ST AMT</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                      {catItems.map((item) => (
                        <tr key={item.brand_id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          {/* Sticky Brand Name Column */}
                          <td className="sticky left-0 bg-white dark:bg-slate-900 z-10 px-3 sm:px-6 py-2.5 whitespace-nowrap font-semibold text-gray-900 dark:text-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                            {item.name}
                          </td>
                          <td className="px-3 sm:px-6 py-2.5 whitespace-nowrap text-gray-500 dark:text-slate-400 text-right">
                            {item.op_st}
                          </td>
                          <td className="px-1.5 sm:px-2 py-2.5 whitespace-nowrap text-right bg-blue-50/40 dark:bg-blue-950/20">
                            <input 
                              type="number" 
                              min="0"
                              value={item.pr_st === 0 ? '' : item.pr_st} 
                              placeholder="0"
                              onChange={(e) => handleInputChange(item.originalIndex, 'pr_st', e.target.value)}
                              className="w-14 sm:w-20 text-right rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1.5 text-xs sm:text-sm border"
                            />
                          </td>
                          <td className="px-3 sm:px-6 py-2.5 whitespace-nowrap font-semibold text-gray-900 dark:text-slate-100 text-right">
                            {item.total_st}
                          </td>
                          <td className="px-1.5 sm:px-2 py-2.5 whitespace-nowrap text-right bg-green-50/40 dark:bg-emerald-950/20">
                            <input 
                              type="number" 
                              min="0"
                              max={item.total_st}
                              value={item.cl_st === 0 ? '' : item.cl_st} 
                              placeholder="0"
                              onChange={(e) => handleInputChange(item.originalIndex, 'cl_st', e.target.value)}
                              className="w-14 sm:w-20 text-right rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-gray-900 dark:text-white shadow-sm focus:border-green-500 focus:ring-green-500 p-1.5 text-xs sm:text-sm border"
                            />
                          </td>
                          <td className="px-3 sm:px-6 py-2.5 whitespace-nowrap font-bold text-red-600 dark:text-red-400 text-right">
                            {item.sl_st}
                          </td>
                          <td className="px-3 sm:px-6 py-2.5 whitespace-nowrap text-gray-500 dark:text-slate-400 text-right">
                            ₹{(Number(item.sale_mrp) || 0).toFixed(2)}
                          </td>
                          <td className="px-3 sm:px-6 py-2.5 whitespace-nowrap font-bold text-green-600 dark:text-emerald-400 text-right">
                            ₹{(Number(item.sale_amount) || 0).toFixed(2)}
                          </td>
                          <td className="px-3 sm:px-6 py-2.5 whitespace-nowrap text-gray-500 dark:text-slate-400 text-right">
                            ₹{(Number(item.ind_value) || 0).toFixed(2)}
                          </td>
                          <td className="px-3 sm:px-6 py-2.5 whitespace-nowrap text-gray-700 dark:text-slate-300 font-semibold text-right">
                            ₹{(Number(item.cl_st_amount) || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default DailyEntry;
