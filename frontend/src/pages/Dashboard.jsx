import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  LogOut, Box, Wrench, Moon, Sun, 
  Settings, ChevronRight, LayoutDashboard, 
  ShieldCheck, History, Star, Activity, Plus
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
  const [isLoading, setIsLoading] = useState(true);
  
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
      setIsLoading(true);
      const prodRes = await axios.get(`http://localhost:5000/products?customerId=${customerId}`);
      if (prodRes.data.success) setProducts(prodRes.data.products);

      const servRes = await axios.get(`http://localhost:5000/service-status?customerId=${customerId}`);
      if (servRes.data.success) setServices(servRes.data.requests);
    } catch (err) {
      toast.error("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const tId = toast.loading('Updating profile...');
    try {
      await axios.put('http://localhost:5000/profile', { id: user.Customer_ID, address: addressForm, phone: phoneForm });
      toast.success('Profile updated!', { id: tId });
      const updatedUser = { ...user, Address: addressForm, Phone: phoneForm };
      setUser(updatedUser);
      setProfile(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setIsProfileOpen(false);
    } catch (err) {
      toast.error('Failed to update profile', { id: tId });
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const tId = toast.loading('Registering asset...');
    try {
      await axios.post('http://localhost:5000/product', {
        customerId: user.Customer_ID,
        productName: productForm.name,
        modelNumber: productForm.model,
        purchaseDate: productForm.date
      });
      toast.success('Asset successfully registered!', { id: tId });
      setProductForm({ name: '', model: '', date: '' });
      setIsProductModalOpen(false);
      fetchData(user.Customer_ID);
    } catch (err) {
      toast.error('Failed to register asset', { id: tId });
    }
  };

  const raiseService = async (e) => {
    e.preventDefault();
    const tId = toast.loading('Submitting request...');
    try {
      await axios.post('http://localhost:5000/service-request', {
        customerId: user.Customer_ID,
        productId: serviceForm.productId,
        issueDescription: serviceForm.issue
      });
      toast.success('Service request submitted!', { id: tId });
      setServiceForm({ productId: '', issue: '' });
      fetchData(user.Customer_ID);
      setActiveTab('dashboard'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request', { id: tId });
    }
  };

  const processPayment = async (serviceId, amount) => {
    const tId = toast.loading('Processing payment...');
    try {
      await axios.post('http://localhost:5000/payment', { serviceId, amount });
      toast.success('Payment successful!', { id: tId });
      fetchData(user.Customer_ID);
    } catch (err) {
      toast.error('Payment failed', { id: tId });
    }
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    const tId = toast.loading('Submitting review...');
    try {
      await axios.post('http://localhost:5000/feedback', { 
        serviceId: feedbackModal.serviceId, 
        rating: feedbackModal.rating, 
        comments: feedbackModal.comments 
      });
      toast.success('Review submitted. Thank you!', { id: tId });
      setFeedbackModal({ open: false, serviceId: null, rating: 5, comments: '' });
      fetchData(user.Customer_ID);
    } catch (err) {
      toast.error('Failed to submit review', { id: tId });
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
    <div className="min-h-screen flex flex-col font-sans relative z-0">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      {/* Top Navbar */}
      <header className="h-20 nav-glass px-8 flex items-center justify-between sticky top-0 z-40 w-full transition-all">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-brand to-indigo-600 p-2 rounded-xl shadow-lg border border-white/20">
              <ShieldCheck className="text-white w-6 h-6" />
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
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer border-none font-bold text-sm ${
                  activeTab === link.id 
                    ? 'bg-brand/10 text-brand shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                    : 'bg-transparent text-secondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary'
                }`}
              >
                <link.icon className="w-4 h-4 shadow-sm" />
                <span>{link.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 relative md:static">
          <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-full bg-transparent border border-std flex items-center justify-center text-secondary hover:text-brand hover:border-brand/50 transition-all cursor-pointer">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-8 w-[1px] border-l border-std mx-1"></div>
          
          <div className="relative">
             <button 
               onClick={() => setIsProfileOpen(!isProfileOpen)}
               className="flex items-center gap-3 hover:scale-105 transition-transform bg-transparent border-none cursor-pointer p-0"
             >
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center text-white font-black text-sm border border-white/20">
                   {profile.First_Name?.[0]}
               </div>
             </button>

             {/* Profile Dropdown */}
             {isProfileOpen && (
               <div className="absolute top-14 right-0 w-80 glass-card z-50 animate-in fade-in slide-in-from-top-4 p-6 shadow-2xl">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white text-2xl font-black">
                     {profile.First_Name?.[0]}
                   </div>
                   <div>
                     <h3 className="text-lg font-black text-primary leading-tight">{profile.First_Name} {profile.Last_Name}</h3>
                     <p className="text-xs font-bold text-secondary">{profile.Email}</p>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-primary/50 border border-std p-3 rounded-xl block glass-card !shadow-none">
                     <p className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-1">Status</p>
                     <p className="text-xs font-bold text-brand flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span> Active</p>
                   </div>
                   <div className="bg-primary/50 border border-std p-3 rounded-xl block glass-card !shadow-none">
                     <p className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-1">Age</p>
                     <p className="text-xs font-bold text-primary">{profile.Age} Yrs</p>
                   </div>
                 </div>

                 <form onSubmit={updateProfile} className="space-y-4 mb-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block">Phone</label>
                      <input value={phoneForm} onChange={e=>setPhoneForm(e.target.value)} className="w-full glass-input text-sm" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block">Address</label>
                      <textarea value={addressForm} onChange={e=>setAddressForm(e.target.value)} className="w-full glass-input text-sm" rows="2" />
                    </div>
                    <button className="w-full py-3 std-btn uppercase tracking-widest text-[10px]">Update Profile</button>
                 </form>

                 <div className="border-t border-std pt-2">
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition-colors rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer bg-transparent border-none">
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
        <div className="max-w-6xl mx-auto mb-6 flex md:hidden items-center gap-4 text-sm font-bold uppercase tracking-widest text-secondary nav-glass p-4 rounded-xl overflow-x-auto shadow-sm">
          {navLinks.map((link) => (
             <button
               key={link.id}
               onClick={() => setActiveTab(link.id)}
               className={`whitespace-nowrap cursor-pointer border-none bg-transparent transition-colors ${activeTab === link.id ? 'text-brand' : 'text-secondary hover:text-primary'}`}
             >
               {link.label}
             </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
             <div className="w-12 h-12 border-4 border-brand/30 border-t-brand rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in">
                <section className="px-2">
                  <h2 className="text-4xl font-black tracking-tight mb-2 text-primary drop-shadow-sm">System Overview</h2>
                  <p className="font-medium text-secondary text-lg">Real-time status of your connected assets and warranty validations.</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 flex items-center justify-between group">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Total Assets</p>
                      <h3 className="text-4xl font-black text-primary">{products.length}</h3>
                    </div>
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <Box className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="glass-card p-6 flex items-center justify-between group">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Active Requests</p>
                      <h3 className="text-4xl font-black text-indigo-500">{services.filter(s=>s.TaskStatus !== 'Completed').length}</h3>
                    </div>
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                      <Activity className="w-6 h-6 text-indigo-500" />
                    </div>
                  </div>

                  <div className="glass-card p-6 flex items-center justify-between group">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Completed Services</p>
                      <h3 className="text-4xl font-black text-emerald-500">{services.filter(s=>s.TaskStatus === 'Completed').length}</h3>
                    </div>
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <History className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>
                </div>

                <section className="glass-card overflow-hidden">
                  <div className="p-6 border-b border-std flex justify-between items-center bg-black/5 dark:bg-white/5">
                     <h3 className="text-xl font-black text-primary tracking-tight">Recent Service Activity</h3>
                     <button onClick={()=>setActiveTab('history')} className="text-xs font-bold text-brand uppercase tracking-widest hover:underline transition-all bg-transparent border-none cursor-pointer">Full Ledger</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-transparent border-b border-std text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                          <tr>
                             <th className="px-8 py-5">Asset</th>
                             <th className="px-8 py-5">Issue</th>
                             <th className="px-8 py-5">Status</th>
                             <th className="px-8 py-5 text-right">Cost</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-std">
                          {services.slice(0,5).map(s => {
                             const isFree = s.Cost === "0.00";
                             return (
                               <tr key={s.Request_ID} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                 <td className="px-8 py-6">
                                    <p className="font-bold text-primary">{s.Product_Name}</p>
                                    <span className="font-mono text-[10px] text-secondary">ID: SR-{s.Request_ID}</span>
                                 </td>
                                 <td className="px-8 py-6">
                                    <p className="text-sm text-secondary truncate max-w-[200px] italic">"{s.Issue_Description}"</p>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                                      s.TaskStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' : 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400'
                                    }`}>
                                      {s.TaskStatus || 'Dispatching'}
                                    </span>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <span className={`font-black tracking-tight ${isFree ? 'text-emerald-500' : 'text-primary'} text-lg`}>
                                       {isFree ? 'FREE' : s.Cost !== null ? `$${s.Cost}` : 'Estimating'}
                                    </span>
                                 </td>
                               </tr>
                             )
                          })}
                       </tbody>
                    </table>
                    {services.length === 0 && (
                       <div className="p-16 text-center font-medium text-secondary uppercase tracking-widest bg-transparent">
                          No active or recent requests.
                       </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* Asset Ledger */}
            {activeTab === 'products' && (
              <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in">
                 <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-4xl font-black tracking-tight mb-2 text-primary">My Assets</h2>
                      <p className="font-medium text-secondary">Review your registered products and current warranty status.</p>
                    </div>
                    <button onClick={()=>setIsProductModalOpen(true)} className="std-btn flex items-center gap-2"><Plus className="w-4 h-4" /> Add Asset</button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map(p => (
                      <div key={p.Product_ID} className="glass-card p-8 flex flex-col justify-between relative hover:-translate-y-2 transition-transform duration-300 group">
                         <div className="absolute top-6 right-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm ${
                              p.IsUnderWarranty ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400'
                            }`}>
                              {p.IsUnderWarranty ? 'Active' : 'Expired'}
                            </span>
                         </div>
                         <div className="mb-8 mt-2">
                           <div className="w-14 h-14 bg-brand/10 border border-brand/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                              <Box className="w-6 h-6 text-brand" />
                           </div>
                           <h3 className="text-xl font-black text-primary">{p.Product_Name}</h3>
                           <p className="text-xs font-mono font-medium text-secondary mt-1">SN: {p.Model_Number}</p>
                         </div>
                         <div className="pt-4 border-t border-std flex justify-between items-center text-xs font-bold text-secondary">
                           <span>Purchased</span>
                           <span className="text-primary">{new Date(p.Purchase_Date).toLocaleDateString()}</span>
                         </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                       <div className="col-span-full p-20 text-center text-secondary uppercase tracking-widest font-bold glass-card">
                          No Assets Registered.
                       </div>
                    )}
                 </div>
              </div>
            )}

            {/* Maintenance Portal */}
            {activeTab === 'service' && (
              <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in">
                 <div className="text-center mb-10">
                   <h2 className="text-4xl font-black tracking-tight mb-3 text-primary">Request Maintenance</h2>
                   <p className="font-medium text-secondary text-lg">Diagnostics and dispatch. Tell us what went wrong.</p>
                 </div>

                 {!user.Address ? (
                    <div className="glass-card border-orange-500/30 bg-orange-500/5 p-12 text-center overflow-hidden">
                       <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-md">
                          <Settings className="w-10 h-10 animate-spin-slow" />
                       </div>
                       <h3 className="text-2xl font-black text-primary mb-3">Address Required</h3>
                       <p className="font-medium text-secondary max-w-md mx-auto mb-8">We need your shipping coordinates to dispatch a technician to your location.</p>
                       <button onClick={()=>{setIsProfileOpen(true); window.scrollTo(0, 0);}} className="px-10 py-4 glass-card text-orange-600 font-bold hover:bg-orange-500/10 transition-all rounded-xl uppercase tracking-widest text-xs cursor-pointer shadow-sm border-orange-500/30">Update Profile</button>
                    </div>
                 ) : (
                   <div className="glass-card p-10 md:p-14 shadow-xl">
                      <form onSubmit={raiseService} className="space-y-8">
                         <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 block ml-1">Select Asset</label>
                            <div className="relative">
                              <select required value={serviceForm.productId} onChange={e=>setServiceForm({...serviceForm, productId: e.target.value})} className="w-full glass-input font-bold appearance-none cursor-pointer">
                                 <option value="" className="text-black">-- Choose Hardware --</option>
                                 {products.map(p => (
                                   <option key={p.Product_ID} value={p.Product_ID} className="text-black">{p.Product_Name} ({p.Model_Number})</option>
                                 ))}
                              </select>
                              <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none rotate-90" />
                            </div>
                         </div>
                         
                         <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 block ml-1">Issue Description</label>
                            <textarea required value={serviceForm.issue} onChange={e=>setServiceForm({...serviceForm, issue:e.target.value})} className="w-full glass-input font-medium min-h-[150px]" placeholder="Please describe the malfunction..."></textarea>
                         </div>

                         <div className="bg-brand/10 border border-brand/20 p-5 rounded-2xl flex gap-4 text-sm font-medium text-brand items-start glass-card !shadow-none">
                            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>If your asset is under active warranty, diagnostic dispatch and standard repairs will be marked as <strong className="font-black tracking-widest">FREE</strong>.</p>
                         </div>

                         <button type="submit" className="w-full std-btn py-4 text-sm uppercase tracking-widest mt-4">Submit Request</button>
                      </form>
                   </div>
                 )}
              </div>
            )}

            {/* Settlement Index */}
            {activeTab === 'history' && (
              <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in">
                 <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2 text-primary">History & Billing</h2>
                    <p className="font-medium text-secondary">Review your service history, process payments, and rate your experience.</p>
                 </div>

                 <div className="glass-card overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-black/5 dark:bg-white/5 border-b border-std text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                         <tr>
                            <th className="px-8 py-6">Reference</th>
                            <th className="px-8 py-6">Technician</th>
                            <th className="px-8 py-6">Value Assessment</th>
                            <th className="px-8 py-6 text-center">Action</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-std">
                         {services.map(s => {
                            const isFree = s.Cost === "0.00";
                            const needsPayment = s.TaskStatus === 'Completed' && s.Cost > 0 && s.Payment_Status !== 'Completed';
                            const canReview = s.TaskStatus === 'Completed' && s.Feedback_Rating === null && (s.Payment_Status === 'Completed' || isFree);

                            return (
                              <tr key={s.Request_ID} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                 <td className="px-8 py-6">
                                    <p className="font-black text-primary text-lg">{s.Product_Name}</p>
                                    <span className="font-mono text-[10px] font-bold text-secondary">ID: SR-{s.Request_ID}</span>
                                    <div className="mt-2 text-xs font-bold text-secondary">STS: <span className="text-brand uppercase">{s.TaskStatus}</span></div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full glass-card border border-std flex flex-col items-center justify-center text-[10px] font-bold text-primary shadow-sm bg-white/50 dark:bg-black/20">
                                        {s.TechnicianName ? s.TechnicianName[0] : '?'}
                                      </div>
                                      <span className="font-bold text-primary text-sm">{s.TechnicianName || 'Unassigned'}</span>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <span className={`font-black text-xl tracking-tight ${isFree ? 'text-emerald-500' : 'text-primary'}`}>
                                      {isFree ? 'FREE' : s.Cost !== null ? `$${s.Cost}` : 'Pending'}
                                    </span>
                                    {!isFree && <p className="text-[9px] text-secondary uppercase tracking-widest mt-1 font-bold opacity-70">Standard Rates Apply</p>}
                                 </td>
                                 <td className="px-8 py-6 flex flex-col items-center justify-center gap-2">
                                    {needsPayment && (
                                      <button onClick={()=>processPayment(s.RecordId, s.Cost)} className="px-6 py-2.5 std-btn text-[10px] uppercase tracking-widest shadow-md hover:scale-105">Pay Now</button>
                                    )}
                                    
                                    {s.Payment_Status === 'Completed' && s.Cost > 0 && (
                                      <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full"><ShieldCheck className="w-3 h-3"/> Paid</span>
                                    )}

                                    {canReview && (
                                      <button onClick={()=>setFeedbackModal({ open: true, serviceId: s.RecordId, rating: 5, comments: '' })} className="px-6 py-2.5 glass-card border border-brand/50 text-brand rounded-lg font-bold text-[10px] uppercase tracking-widest cursor-pointer w-full max-w-[120px] hover:bg-brand/10 transition-colors">Rate Exp</button>
                                    )}

                                    {s.Feedback_Rating && (
                                       <div className="flex gap-1 mt-1 text-yellow-500">
                                         {[...Array(5)].map((_,i) => <Star key={i} className={`w-3 h-3 ${i<s.Feedback_Rating ? 'fill-current':'text-gray-300 dark:text-gray-700'}`} />)}
                                       </div>
                                    )}
                                 </td>
                              </tr>
                            )
                         })}
                      </tbody>
                   </table>
                   {services.length === 0 && <div className="p-20 text-center font-bold text-secondary uppercase tracking-widest">No history found.</div>}
                 </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[60] animate-in fade-in transition-all" style={{backgroundColor: 'var(--modal-bg)'}}>
          <div className="glass-card w-full max-w-md p-8 relative shadow-2xl border border-white/20">
            <button onClick={()=>setIsProductModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-bold cursor-pointer border-none text-primary transition-colors">&times;</button>
            <h3 className="font-black text-2xl text-primary mb-6 tracking-tight">Register Asset</h3>
            <form onSubmit={addProduct} className="space-y-5">
               <div>
                  <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Asset Name</label>
                  <input required placeholder="E.g., OLED TV" value={productForm.name} onChange={e=>setProductForm({...productForm, name:e.target.value})} className="w-full glass-input" />
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Model / Serial Number</label>
                  <input required placeholder="XXX-0000" value={productForm.model} onChange={e=>setProductForm({...productForm, model:e.target.value})} className="w-full glass-input" />
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Purchase Date</label>
                  <input required type="date" value={productForm.date} onChange={e=>setProductForm({...productForm, date:e.target.value})} className="w-full glass-input" />
               </div>
               <button type="submit" className="w-full std-btn py-4 mt-4 text-xs uppercase tracking-widest shadow-lg">Validate & Sync</button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModal.open && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[60] animate-in fade-in transition-all" style={{backgroundColor: 'var(--modal-bg)'}}>
          <div className="glass-card w-full max-w-sm p-8 relative shadow-2xl border border-white/20">
            <button onClick={()=>setFeedbackModal({...feedbackModal, open: false})} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-bold cursor-pointer border-none text-primary transition-colors">&times;</button>
            <h3 className="font-black text-2xl text-primary mb-6 tracking-tight">Rate Service</h3>
            
            <form onSubmit={submitFeedback} className="space-y-6">
               <div className="flex justify-center gap-2 px-4 shadow-inner p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-std">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={()=>setFeedbackModal({...feedbackModal, rating: star})} className="cursor-pointer bg-transparent border-none outline-none hover:scale-110 transition-transform">
                      <Star className={`w-10 h-10 transition-colors drop-shadow-sm ${star <= feedbackModal.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-700'}`} />
                    </button>
                  ))}
               </div>
               <div>
                  <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Comments (Optional)</label>
                  <textarea value={feedbackModal.comments} onChange={e=>setFeedbackModal({...feedbackModal, comments:e.target.value})} className="w-full glass-input" rows="3" placeholder="Tell us about the technician..."></textarea>
               </div>
               <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-xl py-4 transition-all text-xs uppercase tracking-widest border-none cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-0.5">Submit Review</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
