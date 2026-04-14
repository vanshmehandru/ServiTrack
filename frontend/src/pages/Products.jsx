import { useState, useEffect } from 'react';
import { Box, Plus, Search, ShieldCheck, Filter, MoreVertical, LayoutGrid, List, Activity, Zap, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, expired
  const [searchQuery, setSearchQuery] = useState('');
  
  // Enrollment Form State
  const [newProduct, setNewProduct] = useState({
    productName: '',
    modelNumber: '',
    purchaseDate: ''
  });

  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  const fetchProducts = async () => {
    if (!customerId) return;
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/products?customerId=${customerId}`);
      const data = await response.json();
      if (data.success) {
        setProductList(data.products);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Could not load products inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [customerId]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!customerId) return;
    
    const tId = toast.loading('Adding product to registry...');
    try {
      const response = await fetch('http://localhost:5000/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          ...newProduct
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Product added successfully', { id: tId });
        setIsModalOpen(false);
        setNewProduct({ productName: '', modelNumber: '', purchaseDate: '' });
        fetchProducts(); // Refresh list
      } else {
        toast.error(data.message || 'Error adding product', { id: tId });
      }
    } catch (err) {
      toast.error('Connection failed', { id: tId });
    }
  };

  const filteredProducts = productList.filter(p => {
    const matchesSearch = p.Product_Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.Model_Number.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    const isUnderWarranty = p.IsUnderWarranty;
    const statusMatch = filterStatus === 'active' ? isUnderWarranty : !isUnderWarranty;
    return matchesSearch && statusMatch;
  });

  return (
    <div className="space-y-12 font-sans transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="relative">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">Product Inventory.</h2>
            <p className="text-lg text-text-secondary font-medium opacity-80">Manage your verified products and warranty coverage.</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-button px-8 py-4 shadow-lg shadow-brand/20">
          <Plus className="w-5 h-5" /> Add New Product
        </button>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Products', val: productList.length, icon: Box },
            { label: 'Coverage Active', val: productList.filter(p => p.IsUnderWarranty).length, icon: ShieldCheck }
          ].map((s, i) => (
            <div key={i} className="bg-bg-secondary p-8 rounded-3xl border border-border-color flex items-center gap-6 shadow-sm hover:shadow-md transition-all">
               <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center text-bg-primary shadow-sm">
                  <s.icon className="w-5 h-5" />
               </div>
                <div>
                   <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary opacity-60 mb-1">{s.label}</div>
                   <div className="text-3xl font-bold text-text-primary tracking-tighter">{s.val}</div>
                </div>
             </div>
          ))}
      </div>

      {/* Inventory Controls */}
      <div className="flex flex-col md:flex-row gap-6 mt-12 bg-bg-secondary p-4 rounded-[2rem] border border-border-color shadow-sm">
         <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
            <input 
              placeholder="Search products by serial or name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-primary border border-border-color rounded-xl pl-11 pr-4 py-3 text-[13px] font-medium focus:ring-1 focus:ring-brand outline-none transition-all text-text-primary" 
            />
         </div>
         <div className="flex gap-4">
            <div className="flex bg-bg-primary p-1 rounded-xl border border-border-color">
               {['all', 'active', 'expired'].map((status) => (
                 <button
                   key={status}
                   onClick={() => setFilterStatus(status)}
                   className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest border-none transition-all cursor-pointer ${
                     filterStatus === status 
                       ? 'bg-brand text-bg-primary shadow-sm' 
                       : 'bg-transparent text-text-secondary opacity-60 hover:opacity-100'
                   }`}
                 >
                   {status}
                 </button>
               ))}
            </div>
            <div className="bg-bg-primary p-1 rounded-xl border border-border-color flex gap-1">
               <button onClick={()=>setViewMode('table')} className={`p-2 rounded-lg transition-all border-none cursor-pointer ${viewMode === 'table' ? 'bg-brand text-bg-primary shadow-sm' : 'bg-transparent text-text-secondary opacity-40 hover:opacity-100'}`}>
                  <List className="w-4 h-4" />
               </button>
               <button onClick={()=>setViewMode('grid')} className={`p-2 rounded-lg transition-all border-none cursor-pointer ${viewMode === 'grid' ? 'bg-brand text-bg-primary shadow-sm' : 'bg-transparent text-text-secondary opacity-40 hover:opacity-100'}`}>
                  <LayoutGrid className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-bg-secondary border border-border-color rounded-[2.5rem] overflow-hidden shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-border-color bg-bg-primary/30">
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Product Name</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Serial Number</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Warranty Till</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Status</th>
                     <th className="px-10 py-6 text-right text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-color">
                  {isLoading ? (
                    <tr><td colSpan="5" className="px-10 py-24 text-center text-text-secondary animate-pulse font-medium">Synchronizing records...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan="5" className="px-10 py-24 text-center text-text-secondary font-medium italic opacity-60">No products found in the registry.</td></tr>
                  ) : filteredProducts.map((p) => (
                     <tr key={p.Product_ID} className="group hover:bg-bg-primary transition-all duration-300">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-bg-primary rounded-2xl flex items-center justify-center text-text-primary border border-border-color group-hover:scale-105 transition-transform shadow-sm">
                                 <Box className="w-5 h-5 opacity-60" />
                               </div>
                               <div>
                                  <div className="text-[15px] font-bold text-text-primary tracking-tight">{p.Product_Name}</div>
                                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40 mt-1">Verified Unit</div>
                               </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="font-mono text-[13px] font-bold text-text-primary opacity-80">{p.Model_Number}</div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3">
                              <div>
                                 <div className="text-[13px] font-bold text-text-primary">{new Date(p.End_Date).toLocaleDateString()}</div>
                                 <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-40">Coverage End</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className={`badge ${p.IsUnderWarranty ? 'badge-completed' : 'badge-pending'}`}>
                              {p.IsUnderWarranty ? 'Active' : 'Expired'}
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right relative">
                           <button 
                             onClick={() => setActiveMenu(activeMenu === p.Product_ID ? null : p.Product_ID)}
                             className="p-2.5 rounded-xl bg-bg-primary text-text-secondary hover:text-text-primary border border-border-color transition-all cursor-pointer shadow-sm"
                           >
                              <MoreVertical className="w-4 h-4" />
                           </button>
                           
                           {activeMenu === p.Product_ID && (
                             <>
                               <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)}></div>
                               <div className="absolute right-10 top-16 w-52 bg-bg-primary border border-border-color rounded-2xl shadow-2xl z-20 py-3 animate-in overflow-hidden">
                                  <button className="w-full text-left px-5 py-3 text-[13px] font-bold text-text-primary hover:bg-bg-secondary flex items-center gap-3 border-none bg-transparent cursor-pointer transition-colors">
                                     <ExternalLink className="w-4 h-4 opacity-40" /> View Records
                                  </button>
                                  <button className="w-full text-left px-5 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50/10 flex items-center gap-3 border-none bg-transparent cursor-pointer transition-colors">
                                     <Trash2 className="w-4 h-4 opacity-40" /> Decommission
                                  </button>
                               </div>
                             </>
                           )}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Enrollment Modal */}
      {isModalOpen && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-10 animate-in">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={()=>setIsModalOpen(false)}></div>
            <div className="w-full max-w-lg p-14 bg-bg-primary relative shadow-2xl z-10 border border-border-color rounded-[3rem]">
               <div className="bg-brand p-5 rounded-[2rem] w-max mb-10 shadow-xl shadow-brand/20">
                  <Box className="w-10 h-10 text-bg-primary" />
               </div>
               <h3 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading mb-3">Register Product.</h3>
               <p className="text-md text-text-secondary font-medium mb-12 opacity-80 leading-relaxed">Add a product to your registry to enable verified warranty coverage and service requests.</p>
               
               <form onSubmit={handleAddProduct} className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1 opacity-60">Product Name</label>
                     <input 
                      required 
                      placeholder="E.G. SMART MONITOR 4K" 
                      className="premium-input w-full p-4 text-[14px] font-bold italic uppercase" 
                      value={newProduct.productName}
                      onChange={e => setNewProduct({...newProduct, productName: e.target.value})}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1 opacity-60">Serial Number</label>
                        <input 
                          required 
                          placeholder="SN-XXXX" 
                          className="premium-input w-full p-4 text-[14px] font-bold font-mono tracking-widest" 
                          value={newProduct.modelNumber}
                          onChange={e => setNewProduct({...newProduct, modelNumber: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1 opacity-60">Date of Purchase</label>
                        <input 
                          required 
                          type="date" 
                          className="premium-input w-full p-4 text-[14px] font-bold" 
                          value={newProduct.purchaseDate}
                          onChange={e => setNewProduct({...newProduct, purchaseDate: e.target.value})}
                        />
                     </div>
                  </div>
                  
                  <div className="pt-8 flex gap-4">
                     <button type="button" onClick={()=>setIsModalOpen(false)} className="secondary-button flex-1 py-4 text-[11px] font-bold uppercase tracking-widest">Abort</button>
                     <button type="submit" className="primary-button flex-[2] py-4 text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-brand/20">Confirm Registration</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Products;
