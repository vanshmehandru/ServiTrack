import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, Box, Wrench, Moon, Sun, 
  Settings, ChevronRight, LayoutDashboard, 
  ShieldCheck, History, Star, Activity
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Data states
  const [profile, setProfile] = useState({});
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  // Form states
  const [addressForm, setAddressForm] = useState('');
  const [phoneForm, setPhoneForm] = useState('');
  const [productForm, setProductForm] = useState({ name: '', model: '', date: '' });
  const [serviceForm, setServiceForm] = useState({ productId: '', issue: '' });
  
  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, serviceId: null, rating: 5, comments: '' });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setProfile(parsed);
      setAddressForm(parsed.Address || '');
      setPhoneForm(parsed.Phone || '');
      fetchData(parsed.Customer_ID);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async (customerId) => {
    try {
      const prodRes = await axios.get(`http://localhost:5000/products?customerId=${customerId}`);
      if (prodRes.data.success) setProducts(prodRes.data.products);

      const servRes = await axios.get(`http://localhost:5000/service-status?customerId=${customerId}`);
      if (servRes.data.success) setServices(servRes.data.requests);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/profile', { id: user.Customer_ID, address: addressForm, phone: phoneForm });
      alert('Profile updated');
      const updatedUser = { ...user, Address: addressForm, Phone: phoneForm };
      setUser(updatedUser);
      setProfile(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setIsProfileOpen(false);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/product', {
        customerId: user.Customer_ID,
        productName: productForm.name,
        modelNumber: productForm.model,
        purchaseDate: productForm.date
      });
      alert('Product added');
      setProductForm({ name: '', model: '', date: '' });
      setIsProductModalOpen(false);
      fetchData(user.Customer_ID);
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const raiseService = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/service-request', {
        customerId: user.Customer_ID,
        productId: serviceForm.productId,
        issueDescription: serviceForm.issue
      });
      alert('Request Raised');
      setServiceForm({ productId: '', issue: '' });
      fetchData(user.Customer_ID);
      setActiveTab('dashboard'); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to raise request');
    }
  };

  const processPayment = async (serviceId, amount) => {
    try {
      await axios.post('http://localhost:5000/payment', { serviceId, amount });
      alert('Payment Successful');
      fetchData(user.Customer_ID);
    } catch (err) {
      alert('Payment Failed');
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/feedback', { 
        serviceId: feedbackModal.serviceId, 
        rating: feedbackModal.rating, 
        comments: feedbackModal.comments 
      });
      alert('Feedback Submitted');
      setFeedbackModal({ open: false, serviceId: null, rating: 5, comments: '' });
      fetchData(user.Customer_ID);
    } catch (err) {
      alert('Failed to submit feedback');
    }
  };

  if (!user) return null;

  const navLinks = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'My Assets', icon: Box },
    { id: 'service', label: 'Request Service', icon: Wrench },
    { id: 'history', label: 'History & Billing', icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-primary text-primary">
      
      {/* Top Navbar */}
      <header className="h-20 bg-secondary border-b border-std px-8 flex items-center justify-between sticky top-0 z-40 w-full shadow-sm">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary border border-std p-2 rounded-xl">
              <ShieldCheck className="text-brand w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight text-primary">Warranty<span className="font-light">Sys</span></h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer border-none font-bold text-sm ${
                  activeTab === link.id 
                    ? 'bg-brand-blue/10 text-brand' 
                    : 'bg-transparent text-secondary hover:bg-hover hover:text-primary'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 relative md:static">
          <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-full bg-hover flex items-center justify-center text-secondary hover:text-brand transition-all cursor-pointer border-none outline-none">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-8 w-[1px] border-l border-std mx-1"></div>
          
          <div className="relative">
             <button 
               onClick={() => setIsProfileOpen(!isProfileOpen)}
               className="flex items-center gap-3 hover:scale-105 transition-transform bg-transparent border-none cursor-pointer p-0"
             >
               <div className="w-10 h-10 rounded-full bg-brand-blue shadow-sm flex items-center justify-center text-white font-black text-sm">
                   {profile.First_Name?.[0]}
               </div>
             </button>

             {/* Profile Dropdown */}
             {isProfileOpen && (
               <div className="absolute top-14 right-0 w-80 std-card z-50 animate-in fade-in slide-in-from-top-4 p-6 shadow-xl">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 rounded-xl bg-brand-blue flex items-center justify-center text-white text-2xl font-black">
                     {profile.First_Name?.[0]}
                   </div>
                   <div>
                     <h3 className="text-lg font-black text-primary leading-tight">{profile.First_Name} {profile.Last_Name}</h3>
                     <p className="text-xs font-bold text-secondary">{profile.Email}</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-primary border border-std p-3 rounded-xl block">
                     <p className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-1">Status</p>
                     <p className="text-xs font-bold text-brand">Active</p>
                   </div>
                   <div className="bg-primary border border-std p-3 rounded-xl block">
                     <p className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-1">Age</p>
                     <p className="text-xs font-bold text-primary">{profile.Age} Yrs</p>
                   </div>
                 </div>

                 <form onSubmit={updateProfile} className="space-y-4 mb-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block">Phone</label>
                      <input value={phoneForm} onChange={e=>setPhoneForm(e.target.value)} className="w-full std-input text-sm transition-all" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block">Address</label>
                      <textarea value={addressForm} onChange={e=>setAddressForm(e.target.value)} className="w-full std-input text-sm transition-all" rows="2" />
                    </div>
                    <button className="w-full py-3 std-btn uppercase tracking-widest text-[10px]">Update Profile</button>
                 </form>

                 <div className="border-t border-std pt-2">
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 text-red-500 hover:bg-hover transition-colors rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer bg-transparent border-none">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-10 w-full relative z-10 custom-scrollbar">
        
        {/* Navigation Breadcrumb (Mobile) */}
        <div className="max-w-6xl mx-auto mb-6 flex md:hidden items-center gap-4 text-sm font-bold uppercase tracking-widest text-secondary bg-secondary border border-std p-4 rounded-xl overflow-x-auto">
          {navLinks.map((link) => (
             <button
               key={link.id}
               onClick={() => setActiveTab(link.id)}
               className={`whitespace-nowrap cursor-pointer border-none bg-transparent ${activeTab === link.id ? 'text-brand' : 'text-secondary hover:text-primary'}`}
             >
               {link.label}
             </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-10 max-w-6xl mx-auto">
            <section className="px-2">
              <h2 className="text-4xl font-black tracking-tight mb-2 text-primary">Overview</h2>
              <p className="font-bold text-secondary text-lg">Welcome back. Here's your system status.</p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="std-card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                     <Box className="w-6 h-6" />
                   </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-primary mb-1">{products.length}</h3>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Total Assets</p>
                </div>
              </div>
              
              <div className="std-card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
                     <Activity className="w-6 h-6" />
                   </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-brand mb-1">{services.filter(s=>s.TaskStatus !== 'Completed').length}</h3>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Active Requests</p>
                </div>
              </div>

              <div className="std-card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                     <History className="w-6 h-6" />
                   </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-green-500 mb-1">{services.filter(s=>s.TaskStatus === 'Completed').length}</h3>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Completed Services</p>
                </div>
              </div>
            </div>

            <section className="std-card overflow-hidden">
              <div className="p-6 border-b border-std flex justify-between items-center bg-hover">
                 <h3 className="text-xl font-black text-primary tracking-tight">Recent Service Activity</h3>
                 <button onClick={()=>setActiveTab('history')} className="text-xs font-bold text-brand uppercase tracking-widest hover:underline transition-all bg-transparent border-none cursor-pointer">Full Ledger</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-primary border-b border-std text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                      <tr>
                         <th className="px-8 py-5">Asset</th>
                         <th className="px-8 py-5">Issue</th>
                         <th className="px-8 py-5">Status</th>
                         <th className="px-8 py-5 text-right">Cost</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-std bg-secondary">
                      {services.slice(0,5).map(s => {
                         const isFree = s.Cost === "0.00";
                         return (
                           <tr key={s.Request_ID} className="hover:bg-hover transition-colors">
                             <td className="px-8 py-6">
                                <p className="font-bold text-primary">{s.Product_Name}</p>
                                <span className="font-mono text-[10px] text-secondary">ID: SR-{s.Request_ID}</span>
                             </td>
                             <td className="px-8 py-6">
                                <p className="text-sm text-secondary truncate max-w-[200px] italic">"{s.Issue_Description}"</p>
                             </td>
                             <td className="px-8 py-6">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                  s.TaskStatus === 'Completed' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800' : 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800'
                                }`}>
                                  {s.TaskStatus || 'Dispatching'}
                                </span>
                             </td>
                             <td className="px-8 py-6 text-right">
                                <span className={`font-black tracking-tight ${isFree ? 'text-green-500' : 'text-primary'} text-lg`}>
                                   {isFree ? 'FREE' : s.Cost !== null ? `$${s.Cost}` : 'Estimating'}
                                </span>
                             </td>
                           </tr>
                         )
                      })}
                   </tbody>
                </table>
                {services.length === 0 && (
                   <div className="p-16 text-center font-bold text-secondary uppercase tracking-widest bg-secondary">
                      No active or recent requests.
                   </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* Asset Ledger */}
        {activeTab === 'products' && (
          <div className="space-y-8 max-w-6xl mx-auto">
             <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight mb-2 text-primary">My Assets</h2>
                  <p className="font-bold text-secondary">Review your registered products and current warranty status.</p>
                </div>
                <button onClick={()=>setIsProductModalOpen(true)} className="std-btn">+ Add Asset</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p.Product_ID} className="std-card p-8 flex flex-col justify-between relative hover:-translate-y-1 transition-transform duration-300">
                     <div className="absolute top-6 right-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                          p.IsUnderWarranty ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800' : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800'
                        }`}>
                          {p.IsUnderWarranty ? 'Active' : 'Expired'}
                        </span>
                     </div>
                     <div className="mb-8 mt-2">
                       <div className="w-12 h-12 bg-primary border-std border rounded-xl flex items-center justify-center mb-4">
                          <Box className="w-5 h-5 text-brand" />
                       </div>
                       <h3 className="text-xl font-black text-primary">{p.Product_Name}</h3>
                       <p className="text-xs font-mono font-bold text-secondary mt-1">SN: {p.Model_Number}</p>
                     </div>
                     <div className="pt-4 border-t border-std flex justify-between items-center text-xs font-bold text-secondary">
                       <span>Purchased</span>
                       <span className="text-primary">{new Date(p.Purchase_Date).toLocaleDateString()}</span>
                     </div>
                  </div>
                ))}
                {products.length === 0 && (
                   <div className="col-span-full p-20 text-center text-secondary uppercase tracking-widest font-bold std-card">
                      No Assets Registered.
                   </div>
                )}
             </div>
          </div>
        )}

        {/* Maintenance Portal */}
        {activeTab === 'service' && (
          <div className="max-w-3xl mx-auto space-y-10">
             <div className="text-center mb-10">
               <h2 className="text-4xl font-black tracking-tight mb-3 text-primary">Request Maintenance</h2>
               <p className="font-bold text-secondary text-lg">Diagnostics and dispatch. Tell us what went wrong.</p>
             </div>

             {!user.Address ? (
                <div className="std-card border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-12 text-center overflow-hidden">
                   <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                      <Settings className="w-10 h-10" />
                   </div>
                   <h3 className="text-2xl font-black text-primary mb-3">Address Required</h3>
                   <p className="font-bold text-secondary max-w-md mx-auto mb-8">We need your shipping coordinates to dispatch a technician to your location.</p>
                   <button onClick={()=>{setIsProfileOpen(true); window.scrollTo(0, 0);}} className="px-10 py-4 bg-white dark:bg-slate-800 border border-red-200 text-red-600 font-bold hover:bg-hover transition-all rounded-xl uppercase tracking-widest text-xs cursor-pointer shadow-sm">Update Profile</button>
                </div>
             ) : (
               <div className="std-card p-10 md:p-14">
                  <form onSubmit={raiseService} className="space-y-8">
                     <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 block ml-1">Select Asset</label>
                        <select required value={serviceForm.productId} onChange={e=>setServiceForm({...serviceForm, productId: e.target.value})} className="w-full std-input font-bold appearance-none cursor-pointer p-4">
                           <option value="">-- Choose Hardware --</option>
                           {products.map(p => (
                             <option key={p.Product_ID} value={p.Product_ID}>{p.Product_Name} ({p.Model_Number})</option>
                           ))}
                        </select>
                     </div>
                     
                     <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 block ml-1">Issue Description</label>
                        <textarea required value={serviceForm.issue} onChange={e=>setServiceForm({...serviceForm, issue:e.target.value})} className="w-full std-input font-bold min-h-[150px] p-4" placeholder="Please describe the malfunction..."></textarea>
                     </div>

                     <div className="bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50 p-5 rounded-2xl flex gap-4 text-sm font-bold text-blue-700 dark:text-blue-400 items-start">
                        <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>If your asset is under active warranty, diagnostic dispatch and standard repairs will be marked as <strong className="font-black tracking-widest">FREE</strong>.</p>
                     </div>

                     <button className="w-full std-btn py-4 text-sm uppercase tracking-widest mt-4 shadow-md">Submit Request</button>
                  </form>
               </div>
             )}
          </div>
        )}

        {/* Settlement Index */}
        {activeTab === 'history' && (
          <div className="space-y-10 max-w-6xl mx-auto">
             <div>
                <h2 className="text-4xl font-black tracking-tight mb-2 text-primary">History & Billing</h2>
                <p className="font-bold text-secondary">Review your service history, process payments, and rate your experience.</p>
             </div>

             <div className="std-card overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-primary border-b border-std text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                     <tr>
                        <th className="px-8 py-6">Reference</th>
                        <th className="px-8 py-6">Technician</th>
                        <th className="px-8 py-6">Value Assessment</th>
                        <th className="px-8 py-6 text-center">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-std bg-secondary">
                     {services.map(s => {
                        const isFree = s.Cost === "0.00";
                        const needsPayment = s.TaskStatus === 'Completed' && s.Cost > 0 && s.Payment_Status !== 'Completed';
                        const canReview = s.TaskStatus === 'Completed' && s.Feedback_Rating === null && (s.Payment_Status === 'Completed' || isFree);

                        return (
                          <tr key={s.Request_ID} className="hover:bg-hover transition-colors">
                             <td className="px-8 py-6">
                                <p className="font-black text-primary text-lg">{s.Product_Name}</p>
                                <span className="font-mono text-[10px] font-bold text-secondary">ID: SR-{s.Request_ID}</span>
                                <div className="mt-2 text-xs font-bold text-secondary">STS: <span className="text-brand uppercase">{s.TaskStatus}</span></div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-primary border-std border flex flex-col items-center justify-center text-[10px] font-bold text-primary">
                                    {s.TechnicianName ? s.TechnicianName[0] : '?'}
                                  </div>
                                  <span className="font-bold text-primary text-sm">{s.TechnicianName || 'Unassigned'}</span>
                                </div>
                             </td>
                             <td className="px-8 py-6">
                                <span className={`font-black text-xl tracking-tight ${isFree ? 'text-green-500' : 'text-primary'}`}>
                                  {isFree ? 'FREE' : s.Cost !== null ? `$${s.Cost}` : 'Pending'}
                                </span>
                                {!isFree && <p className="text-[9px] text-secondary uppercase tracking-widest mt-1 font-bold">Standard Rates Apply</p>}
                             </td>
                             <td className="px-8 py-6 flex flex-col items-center justify-center gap-2">
                                {needsPayment && (
                                  <button onClick={()=>processPayment(s.RecordId, s.Cost)} className="px-6 py-2.5 std-btn text-[10px] uppercase tracking-widest shadow-md hover:scale-105">Pay Now</button>
                                )}
                                
                                {s.Payment_Status === 'Completed' && s.Cost > 0 && (
                                  <span className="text-green-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Paid</span>
                                )}

                                {canReview && (
                                  <button onClick={()=>setFeedbackModal({ open: true, serviceId: s.RecordId, rating: 5, comments: '' })} className="px-6 py-2.5 bg-primary border border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg font-bold text-[10px] uppercase tracking-widest cursor-pointer w-full max-w-[120px] hover:bg-purple-50 dark:hover:bg-purple-900/30">Rate Exp</button>
                                )}

                                {s.Feedback_Rating && (
                                   <div className="flex gap-1 mt-1 text-yellow-500">
                                     {[...Array(5)].map((_,i) => <Star key={i} className={`w-3 h-3 ${i<s.Feedback_Rating ? 'fill-current':'text-slate-300 dark:text-slate-700'}`} />)}
                                   </div>
                                )}
                             </td>
                          </tr>
                        )
                     })}
                  </tbody>
               </table>
               {services.length === 0 && <div className="p-20 text-center font-bold text-secondary uppercase tracking-widest bg-secondary">No history found.</div>}
             </div>
          </div>
        )}
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[60] animate-in fade-in transition-all" style={{backgroundColor: 'var(--modal-bg)'}}>
          <div className="std-card w-full max-w-md p-8 relative shadow-2xl">
            <button onClick={()=>setIsProductModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-primary hover:bg-hover font-bold cursor-pointer border-none text-secondary">&times;</button>
            <h3 className="font-black text-2xl text-primary mb-6 tracking-tight">Register Asset</h3>
            <form onSubmit={addProduct} className="space-y-5">
               <div>
                  <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Asset Name</label>
                  <input required placeholder="E.g., OLED TV" value={productForm.name} onChange={e=>setProductForm({...productForm, name:e.target.value})} className="w-full std-input" />
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Model / Serial Number</label>
                  <input required placeholder="XXX-0000" value={productForm.model} onChange={e=>setProductForm({...productForm, model:e.target.value})} className="w-full std-input" />
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Purchase Date</label>
                  <input required type="date" value={productForm.date} onChange={e=>setProductForm({...productForm, date:e.target.value})} className="w-full std-input" />
               </div>
               <button type="submit" className="w-full std-btn py-4 mt-2 text-xs uppercase tracking-widest">Validate & Sync</button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[60] animate-in fade-in transition-all" style={{backgroundColor: 'var(--modal-bg)'}}>
          <div className="std-card w-full max-w-sm p-8 relative shadow-2xl">
            <button onClick={()=>setFeedbackModal({...feedbackModal, open: false})} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-primary hover:bg-hover font-bold cursor-pointer border-none text-secondary">&times;</button>
            <h3 className="font-black text-2xl text-primary mb-6 tracking-tight">Rate Service</h3>
            
            <form onSubmit={submitFeedback} className="space-y-6">
               <div className="flex justify-between px-4">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={()=>setFeedbackModal({...feedbackModal, rating: star})} className="cursor-pointer bg-transparent border-none outline-none">
                      <Star className={`w-10 h-10 transition-colors ${star <= feedbackModal.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-700'}`} />
                    </button>
                  ))}
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Comments (Optional)</label>
                  <textarea value={feedbackModal.comments} onChange={e=>setFeedbackModal({...feedbackModal, comments:e.target.value})} className="w-full std-input" rows="3" placeholder="Tell us about the technician..."></textarea>
               </div>
               <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-4 transition-all text-xs uppercase tracking-widest border-none cursor-pointer">Submit Review</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
