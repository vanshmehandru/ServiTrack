import { useState, useEffect } from 'react';
import { Box, Plus, Search, ShieldCheck, Filter, MoreVertical, LayoutGrid, List, Activity, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
      const response = await fetch(`http://localhost:5000/products?customerId=${customerId}`);
      const data = await response.json();
      if (data.success) {
        setProductList(data.products);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Could not load asset inventory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [customerId]);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!customerId) return;
    
    const tId = toast.loading('Enrolling asset into global registry...');
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
        toast.success('Asset verified and synchronized', { id: tId });
        setIsModalOpen(false);
        setNewProduct({ productName: '', modelNumber: '', purchaseDate: '' });
        fetchProducts(); // Refresh list
      } else {
        toast.error(data.message || 'Enrollment failed', { id: tId });
      }
    } catch (err) {
      toast.error('Connection failed', { id: tId });
    }
  };

  const getStatus = (p) => {
    if (p.IsUnderWarranty) return 'Active';
    return 'Expired';
  };

  return (
    <div className="space-y-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div className="relative">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">Asset Inventory.</h2>
            <p className="text-lg text-text-secondary font-medium opacity-80">Verified units in your global synchronization network.</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-button px-8 py-4">
          <Plus className="w-5 h-5" /> Enroll New Asset
        </button>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Total Assets', val: productList.length, icon: Box },
           { label: 'Coverage Active', val: productList.filter(p => p.IsUnderWarranty).length, icon: ShieldCheck },
           { label: 'Network Points', val: '2.4k', icon: Zap }
         ].map((s, i) => (
           <div key={i} className="bg-bg-secondary p-8 rounded-3xl border border-border-color flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white">
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
      <div className="flex flex-col md:flex-row gap-6 mt-12 bg-white p-5 rounded-[2rem] border border-border-color shadow-sm">
         <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
            <input placeholder="Search asset registry by serial or identity..." className="w-full bg-bg-secondary border-none rounded-xl pl-11 pr-4 py-3 text-[13px] font-medium focus:ring-1 focus:ring-black outline-none transition-all" />
         </div>
         <div className="flex gap-4">
            <button className="secondary-button px-6 py-3">
               <Filter className="w-4 h-4 opacity-50" /> Filter
            </button>
            <div className="bg-bg-secondary p-1 rounded-xl border border-border-color flex gap-1">
               <button onClick={()=>setViewMode('table')} className={`p-2 rounded-lg transition-all border-none cursor-pointer ${viewMode === 'table' ? 'bg-white shadow-sm text-black' : 'bg-transparent text-text-secondary opacity-40 hover:opacity-100'}`}>
                  <List className="w-4 h-4" />
               </button>
               <button onClick={()=>setViewMode('grid')} className={`p-2 rounded-lg transition-all border-none cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm text-black' : 'bg-transparent text-text-secondary opacity-40 hover:opacity-100'}`}>
                  <LayoutGrid className="w-4 h-4" />
               </button>
            </div>
         </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-[2rem] overflow-hidden border border-border-color shadow-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-border-color bg-bg-secondary/50">
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Identity</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Serial Node</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">SLA Timeline</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Status</th>
                     <th className="px-10 py-6 text-right text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-color">
                  {isLoading ? (
                    <tr><td colSpan="5" className="px-10 py-20 text-center text-text-secondary animate-pulse font-medium">Synchronizing with registry...</td></tr>
                  ) : productList.length === 0 ? (
                    <tr><td colSpan="5" className="px-10 py-20 text-center text-text-secondary font-medium">No assets deployed to this node.</td></tr>
                  ) : productList.map((p) => (
                     <tr key={p.Product_ID} className="group hover:bg-bg-secondary transition-all duration-300">
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-bg-secondary rounded-2xl flex items-center justify-center text-black border border-border-color group-hover:scale-105 transition-transform">
                                 <Box className="w-5 h-5 opacity-60" />
                              </div>
                              <div>
                                 <div className="text-[15px] font-bold text-black tracking-tight">{p.Product_Name}</div>
                                 <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40 mt-1">Certified Unit</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="font-mono text-[13px] font-bold text-black opacity-80">{p.Model_Number}</div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3">
                              <div className="text-right">
                                 <div className="text-[13px] font-bold text-black">{new Date(p.End_Date).toLocaleDateString()}</div>
                                 <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest opacity-40">Expiration Date</div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className={`badge ${p.IsUnderWarranty ? 'badge-completed' : 'badge-pending'}`}>
                              {getStatus(p)}
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="p-2.5 rounded-xl bg-bg-secondary text-text-secondary hover:text-black border-none transition-all cursor-pointer">
                              <MoreVertical className="w-4 h-4" />
                           </button>
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
            <div className="absolute inset-0 bg-modal-overlay backdrop-blur-md" onClick={()=>setIsModalOpen(false)}></div>
            <div className="w-full max-w-lg p-14 bg-white relative shadow-2xl z-10 border border-border-color rounded-[2.5rem]">
               <div className="bg-black p-5 rounded-[2rem] w-max mb-10 shadow-xl shadow-black/10">
                  <Box className="w-10 h-10 text-white" />
               </div>
               <h3 className="text-4xl font-bold tracking-tight text-black italic serif-heading mb-3">Asset Enrollment.</h3>
               <p className="text-md text-text-secondary font-medium mb-12 opacity-80 leading-relaxed">Assign a physical asset to your global synchronization node to enable premium coverage.</p>
               
               <form onSubmit={handleEnroll} className="space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1 opacity-60">Identity Name</label>
                     <input 
                      required 
                      placeholder="E.G. TITAN 900" 
                      className="premium-input w-full p-4 text-[14px] font-bold italic uppercase" 
                      value={newProduct.productName}
                      onChange={e => setNewProduct({...newProduct, productName: e.target.value})}
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1 opacity-60">Serial Protocol</label>
                        <input 
                          required 
                          placeholder="SN-XXXX" 
                          className="premium-input w-full p-4 text-[14px] font-bold font-mono tracking-widest" 
                          value={newProduct.modelNumber}
                          onChange={e => setNewProduct({...newProduct, modelNumber: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1 opacity-60">Node Deployment</label>
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
                     <button type="submit" className="primary-button flex-[2] py-4 text-[11px] font-bold uppercase tracking-widest">Initialize Sync</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default Products;
