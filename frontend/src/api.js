import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/api.php';

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}?action=login`, { username, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getBars = async () => {
    const response = await axios.get(`${API_URL}?action=get_bars`, { headers: getHeaders() });
    return response.data;
};

export const addBar = async (name) => {
    const response = await axios.post(`${API_URL}?action=add_bar`, { name }, { headers: getHeaders() });
    return response.data;
};

export const editBar = async (id, name) => {
    const response = await axios.post(`${API_URL}?action=edit_bar`, { id, name }, { headers: getHeaders() });
    return response.data;
};

export const deleteBar = async (id) => {
    const response = await axios.post(`${API_URL}?action=delete_bar`, { id }, { headers: getHeaders() });
    return response.data;
};

export const getStock = async (barId, date) => {
    const response = await axios.get(`${API_URL}?action=get_stock&bar_id=${barId}&date=${date}`, { headers: getHeaders() });
    return response.data;
};

export const saveStock = async (barId, date, items) => {
    const response = await axios.post(`${API_URL}?action=save_stock`, {
        bar_id: barId,
        date,
        items
    }, { headers: getHeaders() });
    return response.data;
};

export const getAllBrands = async () => {
    const response = await axios.get(`${API_URL}?action=get_all_brands`, { headers: getHeaders() });
    return response.data;
};

export const getBarBrands = async (barId) => {
    const response = await axios.get(`${API_URL}?action=get_bar_brands&bar_id=${barId}`, { headers: getHeaders() });
    return response.data;
};

export const saveBarBrands = async (barId, brandIds) => {
    const response = await axios.post(`${API_URL}?action=save_bar_brands`, {
        bar_id: barId,
        brand_ids: brandIds
    }, { headers: getHeaders() });
    return response.data;
};

export const addBrand = async (brandData) => {
    const response = await axios.post(`${API_URL}?action=add_brand`, brandData, { headers: getHeaders() });
    return response.data;
};

export const editBrand = async (brandData) => {
    const response = await axios.post(`${API_URL}?action=edit_brand`, brandData, { headers: getHeaders() });
    return response.data;
};
