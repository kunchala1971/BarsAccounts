import { useState, useEffect } from 'react';
import { getBars, addBar, editBar, deleteBar, getAllBrands, getBarBrands, saveBarBrands } from '../api';
import { useNotification } from '../components/NotificationProvider';
import { Plus, Edit2, Trash2, Loader2, X, CheckSquare, Search, CheckCircle, Circle } from 'lucide-react';

function BarsMaster() {
  const { showToast, confirm } = useNotification();
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Add/Edit Bar Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [barName, setBarName] = useState('');
  const [saving, setSaving] = useState(false);

  // Brand Mapping Modal state
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mappingBar, setMappingBar] = useState(null);
  const [allBrands, setAllBrands] = useState([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState(new Set());
  const [loadingMapping, setLoadingMapping] = useState(false);
  const [savingMapping, setSavingMapping] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBars();
  }, []);

  const fetchBars = async () => {
    setLoading(true);
    try {
      const data = await getBars();
      setBars(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch bars', error);
      showToast('Failed to load bars list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setBarName('');
    setIsModalOpen(true);
  };

  const openEditModal = (bar) => {
    setEditingId(bar.id);
    setBarName(bar.name);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!barName.trim()) {
      showToast('Bar name is required', 'warning');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await editBar(editingId, barName.trim());
        showToast('Bar name updated successfully!', 'success');
      } else {
        await addBar(barName.trim());
        showToast('New bar added successfully!', 'success');
      }
      setIsModalOpen(false);
      setBarName('');
      setEditingId(null);
      await fetchBars();
    } catch (error) {
      console.error('Failed to save bar', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save bar';
      showToast(`Error saving bar: ${msg}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, barName) => {
    const isConfirmed = await confirm({
      title: 'Delete Bar Location',
      message: `Are you sure you want to delete "${barName}"? All of its associated daily stock history will be permanently deleted.`,
      confirmText: 'Delete Bar',
      cancelText: 'Cancel',
      type: 'danger'
    });

    if (!isConfirmed) return;

    try {
      await deleteBar(id);
      showToast('Bar deleted successfully!', 'success');
      await fetchBars();
    } catch (error) {
      console.error('Failed to delete bar', error);
      const msg = error.response?.data?.message || error.message || 'Failed to delete bar';
      showToast(`Error deleting bar: ${msg}`, 'error');
    }
  };

  // Brand Mapping Modal Handlers
  const openMapModal = async (bar) => {
    setMappingBar(bar);
    setIsMapModalOpen(true);
    setLoadingMapping(true);
    setSearchTerm('');
    try {
      const [brandsData, barBrandsRes] = await Promise.all([
        getAllBrands(),
        getBarBrands(bar.id)
      ]);
      setAllBrands(Array.isArray(brandsData) ? brandsData : []);
      const mappedIds = barBrandsRes.brand_ids || [];
      setSelectedBrandIds(new Set(mappedIds));
    } catch (error) {
      console.error('Failed to load brand mappings', error);
      showToast('Error loading brand mapping data', 'error');
    } finally {
      setLoadingMapping(false);
    }
  };

  const toggleBrand = (brandId) => {
    setSelectedBrandIds(prev => {
      const next = new Set(prev);
      if (next.has(brandId)) {
        next.delete(brandId);
      } else {
        next.add(brandId);
      }
      return next;
    });
  };

  const toggleCategory = (categoryBrands, selectAll) => {
    setSelectedBrandIds(prev => {
      const next = new Set(prev);
      categoryBrands.forEach(b => {
        if (selectAll) {
          next.add(b.id);
        } else {
          next.delete(b.id);
        }
      });
      return next;
    });
  };

  const toggleSelectAll = (selectAll) => {
    if (selectAll) {
      setSelectedBrandIds(new Set(allBrands.map(b => b.id)));
    } else {
      setSelectedBrandIds(new Set());
    }
  };

  const handleSaveMapping = async () => {
    if (!mappingBar) return;
    setSavingMapping(true);
    try {
      await saveBarBrands(mappingBar.id, Array.from(selectedBrandIds));
      showToast(`Brand mappings for "${mappingBar.name}" saved successfully!`, 'success');
      setIsMapModalOpen(false);
    } catch (error) {
      console.error('Failed to save brand mappings', error);
      const msg = error.response?.data?.message || error.message || 'Failed to save brand mappings';
      showToast(`Error saving brand mappings: ${msg}`, 'error');
    } finally {
      setSavingMapping(false);
    }
  };

  // Group brands by category and filter by search term
  const filteredBrands = allBrands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = {};
  filteredBrands.forEach(b => {
    if (!categories[b.category]) {
      categories[b.category] = [];
    }
    categories[b.category].push(b);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 pb-12 transition-colors">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Bars Master</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Manage bar locations and map available brands for daily entry</p>
        </div>
        <button
          onClick={openAddModal}
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Bar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 shadow overflow-hidden sm:rounded-md border border-gray-200 dark:border-slate-800 transition-colors">
          <ul className="divide-y divide-gray-200 dark:divide-slate-800">
            {bars.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500 dark:text-slate-400">No bars found. Add one above.</li>
            ) : (
              bars.map((bar) => (
                <li key={bar.id}>
                  <div className="px-4 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
                    <div className="text-base font-semibold text-gray-900 dark:text-white">{bar.name}</div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button 
                        onClick={() => openMapModal(bar)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 dark:border-blue-900 text-xs font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                        title="Configure mapped brands for this bar"
                      >
                        <CheckSquare className="h-4 w-4" />
                        Map Brands
                      </button>
                      <button 
                        onClick={() => openEditModal(bar)}
                        className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Edit Bar Name"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(bar.id, bar.name)}
                        className="p-1.5 text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Delete Bar"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* Add / Edit Bar Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          />
          
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-lg border border-gray-100 dark:border-slate-800">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div className="bg-white dark:bg-slate-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white">
                    {editingId ? 'Edit Bar Location' : 'Add New Bar Location'}
                  </h3>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="text-gray-400 hover:text-gray-500 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300">Bar Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={barName}
                    onChange={(e) => setBarName(e.target.value)}
                    className="mt-1 p-2.5 block w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white rounded-lg shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter bar name"
                  />
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-800/80 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none sm:w-auto disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Bar'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-slate-700 shadow-sm px-4 py-2 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand Mapping Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMapModalOpen(false)}
          />
          
          <div className="relative z-10 bg-white dark:bg-slate-900 rounded-xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-100 dark:border-slate-800">
            {/* Modal Header */}
            <div className="bg-white dark:bg-slate-900 px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Map Brands for <span className="text-blue-600 dark:text-blue-400">{mappingBar?.name}</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                  Select which brands are available for daily stock entry in this bar.
                </p>
              </div>
              <button 
                onClick={() => setIsMapModalOpen(false)} 
                className="text-gray-400 dark:text-slate-400 hover:text-gray-500 dark:hover:text-slate-200 p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {loadingMapping ? (
              <div className="flex flex-col justify-center items-center h-64 p-6">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                <span className="mt-2 text-sm text-gray-500 dark:text-slate-400">Loading brands data...</span>
              </div>
            ) : (
              <>
                {/* Search & Bulk Action Bar */}
                <div className="bg-gray-50 dark:bg-slate-800/60 px-6 py-3 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Search brand or category..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-1.5 text-sm w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-slate-100 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-semibold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                      {selectedBrandIds.size} of {allBrands.length} selected
                    </span>

                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => toggleSelectAll(true)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-white dark:bg-slate-900 px-2.5 py-1 border border-gray-300 dark:border-slate-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        Select All
                      </button>
                      <button 
                        type="button"
                        onClick={() => toggleSelectAll(false)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200 bg-white dark:bg-slate-900 px-2.5 py-1 border border-gray-300 dark:border-slate-700 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800"
                      >
                        <Circle className="h-3.5 w-3.5" />
                        Clear All
                      </button>
                    </div>
                  </div>
                </div>

                {/* Brands List grouped by Category */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                  {Object.keys(categories).length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-slate-400 text-sm">
                      No brands found matching "{searchTerm}".
                    </div>
                  ) : (
                    Object.entries(categories).map(([category, categoryBrands]) => {
                      const selectedInCatCount = categoryBrands.filter(b => selectedBrandIds.has(b.id)).length;
                      const allCatSelected = selectedInCatCount === categoryBrands.length;

                      return (
                        <div key={category} className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden">
                          {/* Category Header */}
                          <div className="bg-gray-100 dark:bg-slate-800/80 px-4 py-2.5 flex justify-between items-center border-b border-gray-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              <input 
                                type="checkbox"
                                id={`cat-${category}`}
                                checked={allCatSelected}
                                onChange={(e) => toggleCategory(categoryBrands, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                              />
                              <label htmlFor={`cat-${category}`} className="font-semibold text-sm text-gray-800 dark:text-slate-200 cursor-pointer">
                                {category}
                              </label>
                              <span className="text-xs text-gray-500 dark:text-slate-400 font-normal">
                                ({selectedInCatCount} / {categoryBrands.length})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleCategory(categoryBrands, !allCatSelected)}
                              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {allCatSelected ? 'Deselect Category' : 'Select Category'}
                            </button>
                          </div>

                          {/* Brands Grid */}
                          <div className="p-4 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {categoryBrands.map(brand => {
                              const isChecked = selectedBrandIds.has(brand.id);
                              return (
                                <label 
                                  key={brand.id}
                                  className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                    isChecked 
                                      ? 'border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 font-medium' 
                                      : 'border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/40 text-gray-700 dark:text-slate-300'
                                  }`}
                                >
                                  <input 
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleBrand(brand.id)}
                                    className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="truncate font-medium">{brand.name}</div>
                                    <div className="text-[10px] text-gray-500 dark:text-slate-400">MRP: ₹{Number(brand.sale_mrp).toFixed(2)}</div>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Modal Footer */}
                <div className="bg-gray-50 dark:bg-slate-800/60 px-6 py-4 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMapModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={savingMapping}
                    onClick={handleSaveMapping}
                    className="inline-flex items-center gap-2 px-5 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                  >
                    {savingMapping ? <Loader2 className="animate-spin h-4 w-4" /> : <CheckSquare className="h-4 w-4" />}
                    Save Mapping ({selectedBrandIds.size} Brands)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BarsMaster;
