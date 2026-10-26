import { useState, useEffect } from 'react';
import { getAllBrands, addBrand, editBrand } from '../api';
import { useNotification } from '../components/NotificationProvider';
import { Plus, Edit2, Loader2, X, Search, Tag, DollarSign } from 'lucide-react';

function BrandsMaster() {
  const { showToast } = useNotification();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    sale_mrp: '',
    ind_value: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getAllBrands();
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch brands', error);
      showToast('Failed to load brands list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBrand(null);
    const defaultCat = categoriesList.length > 0 ? categoriesList[0] : 'WHISKY';
    setFormData({
      category: defaultCat,
      name: '',
      sale_mrp: '',
      ind_value: ''
    });
    setIsCustomCategory(categoriesList.length === 0);
    setIsModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);
    const cat = brand.category || '';
    const inList = categoriesList.includes(cat);
    setFormData({
      category: cat,
      name: brand.name || '',
      sale_mrp: brand.sale_mrp !== undefined ? brand.sale_mrp : '',
      ind_value: brand.ind_value !== undefined ? brand.ind_value : ''
    });
    setIsCustomCategory(!inList && cat !== '');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Brand name is required', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        category: formData.category.trim() || 'UNCATEGORIZED',
        name: formData.name.trim(),
        sale_mrp: parseFloat(formData.sale_mrp) || 0,
        ind_value: parseFloat(formData.ind_value) || 0
      };

      if (editingBrand) {
        await editBrand({ id: editingBrand.id, ...payload });
        showToast(`Brand "${payload.name}" updated successfully!`, 'success');
      } else {
        await addBrand(payload);
        showToast(`New brand "${payload.name}" added successfully!`, 'success');
      }
      setIsModalOpen(false);
      await fetchBrands();
    } catch (error) {
      console.error('Failed to save brand', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save brand';
      showToast(`Error saving brand: ${msg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Extract unique categories
  const categoriesList = Array.from(new Set(brands.map(b => b.category).filter(Boolean))).sort();

  // Filtered brands
  const filteredBrands = brands.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'ALL' || b.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 pb-12 transition-colors">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Tag className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            Brands Master
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
            Add and edit liquor brands, sale MRP, and IND values
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add New Brand
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search by brand name or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Category:</span>
            <select
              value={selectedCategoryFilter}
              onChange={e => setSelectedCategoryFilter(e.target.value)}
              className="py-1.5 px-3 text-xs sm:text-sm bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories ({brands.length})</option>
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <span className="text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            {filteredBrands.length} Brands
          </span>
        </div>
      </div>

      {/* Brands Table Container */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2 text-sm text-gray-500 dark:text-slate-400">Loading brands data...</span>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400 text-sm">
          No brands found matching your search criteria.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 transition-colors">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800 text-xs sm:text-sm">
              <thead className="bg-gray-50 dark:bg-slate-800/80">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5 text-left font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 sm:px-6 py-3.5 text-left font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
                    Brand Name
                  </th>
                  <th className="px-4 sm:px-6 py-3.5 text-right font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
                    Sale MRP (₹)
                  </th>
                  <th className="px-4 sm:px-6 py-3.5 text-right font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider">
                    IND Value (₹)
                  </th>
                  <th className="px-4 sm:px-6 py-3.5 text-center font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider w-24">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                {filteredBrands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {brand.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                      {brand.name}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap font-medium text-gray-700 dark:text-slate-300 text-right">
                      ₹{(Number(brand.sale_mrp) || 0).toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap font-medium text-gray-700 dark:text-slate-300 text-right">
                      ₹{(Number(brand.ind_value) || 0).toFixed(2)}
                    </td>
                    <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-center">
                      <button
                        type="button"
                        onClick={() => openEditModal(brand)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 border border-blue-200 dark:border-blue-900 text-xs font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                        title="Edit Brand"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-lg border border-gray-100 dark:border-slate-800">
            <form onSubmit={handleSave}>
              <div className="bg-white dark:bg-slate-900 px-6 pt-6 pb-4">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-500" />
                    {editingBrand ? 'Edit Brand' : 'Add New Brand'}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Category Field */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider">
                        Category
                      </label>
                      {!isCustomCategory && categoriesList.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomCategory(true);
                            setFormData(prev => ({ ...prev, category: '' }));
                          }}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          + New Category
                        </button>
                      )}
                    </div>

                    {!isCustomCategory && categoriesList.length > 0 ? (
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => {
                          if (e.target.value === 'NEW_CATEGORY_OPTION') {
                            setIsCustomCategory(true);
                            setFormData(prev => ({ ...prev, category: '' }));
                          } else {
                            setFormData(prev => ({ ...prev, category: e.target.value }));
                          }
                        }}
                        className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="" disabled>-- Select Existing Category --</option>
                        {categoriesList.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="NEW_CATEGORY_OPTION" className="font-semibold text-blue-600 dark:text-blue-400">
                          + Add New Category...
                        </option>
                      </select>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            autoFocus={isCustomCategory}
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 uppercase"
                            placeholder="e.g. TEQUILA, LIQUEURS, CRAFT BEER..."
                          />
                          {categoriesList.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsCustomCategory(false);
                                setFormData(prev => ({ ...prev, category: categoriesList[0] || 'WHISKY' }));
                              }}
                              className="px-3 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg border border-gray-300 dark:border-slate-700 whitespace-nowrap"
                            >
                              Select Existing
                            </button>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-slate-400">
                          Type a new category name for this brand.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Brand Name Field */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter brand name"
                    />
                  </div>

                  {/* Price Row: Sale MRP & IND Value */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Sale MRP (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm font-semibold">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formData.sale_mrp}
                          onChange={(e) => setFormData({ ...formData, sale_mrp: e.target.value })}
                          className="w-full pl-7 pr-3 py-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        IND Value (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm font-semibold">₹</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formData.ind_value}
                          onChange={(e) => setFormData({ ...formData, ind_value: e.target.value })}
                          className="w-full pl-7 pr-3 py-2.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="bg-gray-50 dark:bg-slate-800/80 px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-5 py-2 border border-transparent rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                  {editingBrand ? 'Update Brand' : 'Save Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandsMaster;
