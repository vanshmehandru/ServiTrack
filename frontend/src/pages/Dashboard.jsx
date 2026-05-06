import API_URL from '../config';
import { useTheme } from '../context/ThemeContext';
import { 
  LogOut, Box, Wrench, Moon, Sun, 
  Settings as SettingsIcon, ChevronRight, LayoutDashboard, 
  ShieldCheck, History, CreditCard,
  Search, User, MapPin, 
  Zap, ArrowRight, CheckCircle2, AlertCircle,
  Activity, Plus
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
  
  const { isDark, toggleTheme } = useTheme();

  // Form states
  const [addressForm, setAddressForm] = useState('');
  const [phoneForm, setPhoneForm] = useState('');
  const [productForm, setProductForm] = useState({ name: '', model: '', date: '' });
  const [serviceForm, setServiceForm] = useState({ productId: '', issue: '', type: '' });
  
  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState({ open: false, serviceId: null, rating: 5, comments: '' });

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
      const prodRes = await axios.get(`${API_URL}/products?customerId=${customerId}`);
      if (prodRes.data.success) setProducts(prodRes.data.products);

      const servRes = await axios.get(`${API_URL}/service-status?customerId=${customerId}`);
      if (servRes.data.success) setServices(servRes.data.requests);
    } catch (err) {
      toast.error("Failed to load systems data.");
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
    const tId = toast.loading('Syncing profile updates...');
    try {
      await axios.put(`${API_URL}/profile`, { id: user.Customer_ID, address: addressForm, phone: phoneForm });
      toast.success('Core profile updated!', { id: tId });
      const updatedUser = { ...user, Address: addressForm, Phone: phoneForm };
      setUser(updatedUser);
      setProfile(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setIsProfileOpen(false);
    } catch (err) {
      toast.error('Sync failed. Authority rejected.', { id: tId });
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    const tId = toast.loading('Enrolling asset into registry...');
    try {
      await axios.post(`${API_URL}/product`, {
        customerId: user.Customer_ID,
        productName: productForm.name,
        modelNumber: productForm.model,
        purchaseDate: productForm.date
      });
      toast.success('Asset validation successful!', { id: tId });
      setProductForm({ name: '', model: '', date: '' });
      setIsProductModalOpen(false);
      fetchData(user.Customer_ID);
    } catch (err) {
      toast.error('Enrollment failed. Database constraint.', { id: tId });
    }
  };

  const raiseService = async (e) => {
    e.preventDefault();
    const tId = toast.loading('Transmitting incident report...');
    try {
      await axios.post(`${API_URL}/service-request`, {
        customerId: user.Customer_ID,
        productId: serviceForm.productId,
        issueDescription: serviceForm.issue
      });
      toast.success('Protocol established. Technician dispatched.', { id: tId });
      setServiceForm({ productId: '', issue: '', type: '' });
      fetchData(user.Customer_ID);
      setActiveTab('dashboard'); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transmission error.', { id: tId });
    }
  };

  if (!user) return null;

  const navLinks = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
    { id: 'products', label: 'Inventory', icon: Box },
    { id: 'service', label: 'Incidents', icon: Wrench },
    { id: 'history', label: 'Tracking', icon: History },
    { id: 'payments', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 glass-panel border-r border-slate-200/50 flex flex-col hidden lg:flex relative z-50">
        <div className="p-8 flex items-center gap-3.5 mb-8">
           <div className="bg-brand p-2.5 rounded-xl shadow-lg shadow-brand/20">
             <ShieldCheck className="w-5 h-5 text-white" />
           </div>
           <div>
             <span className="text-xl font-bold text-primary tracking-tight">Warranty<span className="text-brand">Sys</span></span>
             <p className="text-[10px] text-secondary font-bold uppercase tracking-widest leading-none mt-1">Enterprise Hub</p>
           </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
               className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-xl transition-all duration-300 border-none group relative ${
                activeTab === link.id 
                  ? 'bg-brand-soft text-brand shadow-sm' 
                  : 'bg-transparent text-secondary hover:text-primary hover:bg-bg-primary'
              }`}
            >
              <link.icon className={`w-4 h-4 transition-colors ${activeTab === link.id ? 'text-brand' : 'text-secondary/60 group-hover:text-primary'}`} />
              <span className={`text-[13px] font-semibold tracking-tight ${activeTab === link.id ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>{link.label}</span>
              {activeTab === link.id && <div className="absolute left-0 w-1 h-5 rounded-full bg-brand"></div>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 space-y-2">
           <button onClick={() => setActiveTab('service')} className="primary-button w-full mb-3 text-[12px] font-bold">
             <Plus className="w-4 h-4" /> New Incident
           </button>
           <button onClick={handleLogout} className="w-full flex items-center gap-3.5 px-5 py-3 rounded-xl border-none bg-transparent text-secondary hover:text-red-500 hover:bg-red-50/50 font-bold text-[12px] transition-colors group cursor-pointer">
              <LogOut className="w-4 h-4 opacity-60 group-hover:text-red-500" /> Termination
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-mesh">
        
        {/* Top Header */}
        <header className="h-20 glass-panel border-b border-white/40 px-10 flex items-center justify-between z-40 shrink-0">
          <div className="flex-1 max-w-xl relative group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60 group-focus-within:text-brand transition-colors" />
             <input placeholder="Search protocol database..." className="w-full bg-bg-primary/50 backdrop-blur-md border border-border-color rounded-xl pl-12 pr-6 py-2.5 text-[14px] font-medium focus:ring-4 focus:ring-brand-soft focus:outline-none transition-all" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-r border-border-color pr-6 hidden md:flex">
               <button 
                 onClick={toggleTheme}
                 className="w-10 h-10 rounded-xl bg-bg-secondary border border-border-color flex items-center justify-center hover:shadow-md transition-all cursor-pointer group"
               >
                 {isDark ? <Sun className="w-5 h-5 text-brand" /> : <Moon className="w-5 h-5 text-secondary" />}
               </button>
            </div>
            
            <div className="flex items-center gap-3.5 py-1.5 pl-1.5 pr-4 rounded-xl hover:bg-bg-secondary backdrop-blur-sm cursor-pointer transition-all border border-transparent hover:border-border-color group" onClick={() => setIsProfileOpen(!isProfileOpen)}>
               <div className="w-9 h-9 rounded-lg bg-brand p-0.5 shadow-sm group-hover:shadow-md transition-all">
                  <div className="w-full h-full rounded-[7px] bg-bg-secondary overflow-hidden border border-white/10">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.First_Name}`} alt="User" className="w-full h-full object-cover" />
                  </div>
               </div>
               <div className="hidden sm:block">
                  <div className="text-[13px] font-bold text-primary leading-none mb-0.5">{user.First_Name}</div>
                  <div className="text-[10px] font-medium text-secondary/70 uppercase tracking-widest">Client Portal</div>
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
               <div className="w-10 h-10 border-3 border-[#2563EB]/10 border-t-[#2563EB] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
              
              {activeTab === 'dashboard' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  {/* Greeting */}
                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-1 h-32 bg-brand rounded-full opacity-20"></div>
                    <div className="space-y-4">
                      <h2 className="heading-xl text-primary animate-in">
                        System <span className="text-brand">Monitor.</span>
                      </h2>
                      <h3 className="text-2xl font-semibold text-secondary tracking-tight flex items-center gap-3">
                        Welcome back, <span className="text-primary bg-bg-secondary px-3 py-1 rounded-lg border border-border-color">{user.First_Name}</span>
                      </h3>
                      <p className="text-secondary font-medium mt-8 max-w-2xl leading-relaxed text-lg opacity-90">
                         Enterprise claim management active. Current fleet health is at <span className="text-primary font-bold">94.2%</span>. 
                         There are {services.filter(s=>s.TaskStatus !== 'Completed').length} active service records in the queue.
                      </p>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-card p-10 relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-1.5 h-full bg-brand/10"></div>
                       <div className="flex justify-between items-start mb-10">
                          <div className="text-[11px] font-bold uppercase tracking-widest text-secondary/60">Registered Inventory</div>
                          <div className="bg-brand-soft p-3 rounded-xl text-brand shadow-sm"><Box className="w-5 h-5"/></div>
                       </div>
                       <div className="flex items-end gap-5">
                          <span className="text-7xl font-bold text-primary tracking-tighter leading-none">{products.length}</span>
                          <div className="flex flex-col mb-1">
                            <span className="text-brand text-[11px] font-bold uppercase tracking-widest">Active Units</span>
                          </div>
                       </div>
                    </div>

                    <div className="glass-card p-10 relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500/10"></div>
                       <div className="flex justify-between items-start mb-10">
                          <div className="text-[11px] font-bold uppercase tracking-widest text-secondary/60">Pending Service</div>
                          <div className="bg-red-50 p-3 rounded-xl text-red-500 shadow-sm"><Activity className="w-5 h-5"/></div>
                       </div>
                       <div className="flex items-end gap-5">
                          <span className="text-7xl font-bold text-primary tracking-tighter leading-none">{services.filter(s=>s.TaskStatus !== 'Completed').length}</span>
                          <div className="flex flex-col mb-1">
                            <span className="text-red-500 text-[11px] font-bold uppercase tracking-widest">In Sync</span>
                          </div>
                       </div>
                    </div>

                    <div className="glass-card p-10 relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-1.5 h-full bg-brand/10"></div>
                       <div className="flex justify-between items-start mb-10">
                          <div className="text-[11px] font-bold uppercase tracking-widest text-secondary/60">Resolution Rate</div>
                          <div className="bg-brand-soft p-3 rounded-xl text-brand shadow-sm"><ShieldCheck className="w-5 h-5"/></div>
                       </div>
                       <div className="flex items-end gap-5">
                          <span className="text-7xl font-bold text-primary tracking-tighter leading-none">98<span className="text-4xl opacity-40">%</span></span>
                          <div className="flex flex-col mb-1">
                            <span className="text-brand text-[11px] font-bold uppercase tracking-widest">Premium SLA</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Activity & Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 glass-card p-10 border-white/40 shadow-xl shadow-slate-500/5">
                       <div className="flex justify-between items-center mb-10">
                          <div>
                            <h4 className="text-xl font-black text-[#0F172A] italic uppercase tracking-tighter">Real-Time Registry</h4>
                            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest opacity-60">Live satellite telemetry from field units</p>
                          </div>
                          <button onClick={()=>setActiveTab('history')} className="text-[#2563EB] text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer bg-transparent border-none">Sync History</button>
                       </div>
                       
                       <div className="space-y-10">
                          {services.slice(0, 4).map((s, idx) => (
                            <div key={idx} className="flex gap-6 group hover:translate-x-2 transition-transform duration-300">
                               <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md group-hover:bg-white transition-all">
                                  <Box className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
                               </div>
                               <div className="flex-1 flex flex-col justify-center">
                                  <div className="flex justify-between items-start">
                                    <h5 className="text-[15px] font-black text-[#0F172A] italic tracking-tight">{s.Product_Name} <span className="text-slate-300">/</span> {s.Issue_Description.split(' ').slice(0,2).join(' ').toUpperCase()}</h5>
                                    <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-widest font-mono">{idx === 0 ? '02M AGO' : idx === 1 ? '45M AGO' : '02H AGO'}</span>
                                  </div>
                                  <p className="text-[12px] font-bold text-[#64748B] mt-1.5 opacity-80">
                                    Protocol <span className="text-[#2563EB] font-mono">#RQ-{s.Request_ID}</span> transition to <span className={`font-black tracking-widest uppercase ${s.TaskStatus === 'Completed' ? 'text-emerald-500' : 'text-[#2563EB]'}`}>{s.TaskStatus || 'Dispatched'}</span>.
                                  </p>
                               </div>
                            </div>
                          ))}
                          {services.length === 0 && <p className="text-center text-slate-400 text-sm py-16 font-black uppercase tracking-[0.3em] italic opacity-40">No telemetry detected.</p>}
                       </div>
                    </div>

                    <div className="lg:col-span-2 glass-card p-10 border-white/40 shadow-xl shadow-slate-500/5 flex flex-col items-center">
                       <div className="w-full mb-10">
                         <h4 className="text-xl font-black text-[#0F172A] italic uppercase tracking-tighter">Health Matrix</h4>
                         <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest opacity-60">System availability vs uptime targets</p>
                       </div>
                       
                       <div className="relative w-56 h-56 mb-10">
                          <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                             <circle cx="50" cy="50" r="42" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
                             <circle cx="50" cy="50" r="42" fill="transparent" stroke="url(#blueGrad)" strokeWidth="10" strokeDasharray="263.8" strokeDashoffset={263.8 - (263.8 * (0.94))} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                             <defs>
                               <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                 <stop offset="0%" stopColor="#2563EB" />
                                 <stop offset="100%" stopColor="#6366F1" />
                               </linearGradient>
                             </defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-5xl font-black text-[#0F172A] italic tracking-tighter">94<span className="text-2xl text-slate-300">.2%</span></span>
                             <span className="text-[10px] uppercase font-black text-emerald-500 tracking-[0.2em] mt-1">OPTIMIZED</span>
                          </div>
                       </div>

                       <div className="w-full space-y-5">
                          {[
                            { label: 'Network Stability', val: '98%', color: 'bg-emerald-500' },
                            { label: 'Response Latency', val: '1.2h', color: 'bg-blue-500' },
                            { label: 'Dispatch Precision', val: '99.9%', color: 'bg-indigo-500' }
                          ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                               <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                                  <span className="text-[11px] font-black uppercase text-[#64748B] tracking-widest">{item.label}</span>
                               </div>
                               <span className="text-[11px] font-black text-[#0F172A] font-mono">{item.val}</span>
                            </div>
                          ))}
                       </div>
                       
                       <button className="w-full bg-[#F8FAFC] text-[#2563EB] font-black text-[10px] py-4 rounded-xl mt-12 hover:bg-white border border-slate-100 transition-all uppercase tracking-[0.2em] cursor-pointer shadow-sm">Audit Performance</button>
                    </div>
                  </div>

                  {/* CTA Banner */}
                  <div className="bg-brand-gradient rounded-3xl p-14 flex flex-col md:flex-row justify-between items-center text-white shadow-2xl overflow-hidden relative group">
                     <div className="absolute top-[-50%] right-[-10%] w-[40%] h-[200%] bg-white/5 rotate-[25deg] pointer-events-none group-hover:translate-x-10 transition-transform duration-1000"></div>
                     <div className="z-10 text-center md:text-left mb-8 md:mb-0 max-w-xl">
                        <h4 className="text-4xl font-black italic tracking-tighter mb-4 leading-tight">Scale your enterprise <br/>coverage with DNA.</h4>
                        <p className="opacity-80 text-lg font-medium leading-relaxed">Activate our API architecture to handle massive inventory distribution across continental zones.</p>
                     </div>
                     <button className="z-10 bg-white text-[#2563EB] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all border-none cursor-pointer">Activate API Node</button>
                  </div>
                </div>
              )}

               {activeTab === 'products' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                   <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-4 px-2">
                    <div className="relative">
                      <div className="absolute -left-10 top-0 w-1 h-14 bg-brand rounded-full opacity-20"></div>
                      <h2 className="text-4xl font-bold text-primary tracking-tight mb-2">Registered <span className="text-brand">Assets.</span></h2>
                      <p className="text-secondary font-semibold text-xs tracking-widest uppercase opacity-60">Verified units in system inventory</p>
                    </div>
                    <button onClick={()=>setIsProductModalOpen(true)} className="primary-button px-10 py-3.5 text-[13px] font-bold">
                      <Plus className="w-5 h-5" /> Enroll New Asset
                    </button>
                   </div>

                   {/* Inventory Metrics */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="glass-card p-10 border-white/40 shadow-xl shadow-slate-500/5">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64748B] mb-8 opacity-60">Verified Units</div>
                         <div className="flex items-center gap-6">
                            <span className="text-6xl font-black text-[#0F172A] italic leading-none">{products.length}</span>
                            <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100">+12% CY</div>
                         </div>
                      </div>
                      <div className="glass-card p-10 border-white/40 shadow-xl shadow-slate-500/5">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64748B] mb-8 opacity-60">SLA Coverage</div>
                         <div className="flex items-center gap-6">
                            <span className="text-6xl font-black text-[#2563EB] italic leading-none">{products.filter(p=>p.IsUnderWarranty).length}</span>
                            <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">{((products.filter(p=>p.IsUnderWarranty).length / (products.length || 1))*100).toFixed(0)}% Active</span>
                         </div>
                      </div>
                      <div className="glass-card p-10 border-white/40 shadow-xl shadow-slate-500/5">
                         <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64748B] mb-8 opacity-60">SLA Expiry</div>
                         <div className="flex items-center gap-6">
                            <span className="text-6xl font-black text-orange-500 italic leading-none">{products.filter(p=>p.IsUnderWarranty).length % 5}</span>
                            <div className="px-3.5 py-1.5 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-100">Critical</div>
                         </div>
                      </div>
                   </div>

                   {/* Table View */}
                   <div className="glass-card shadow-2xl border-border-color overflow-hidden bg-bg-secondary">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="border-b border-border-color bg-bg-primary/50">
                                    <th className="px-10 py-8 text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Asset Code</th>
                                    <th className="px-10 py-8 text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Product Nomenclature</th>
                                    <th className="px-10 py-8 text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">SLA Timeline</th>
                                    <th className="px-10 py-8 text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Network Status</th>
                                    <th className="px-10 py-8 text-right text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Operations</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border-color">
                                 {products.map((product) => (
                                    <tr key={product.Product_ID} className="group hover:bg-bg-primary transition-colors">
                                       <td className="px-10 py-8">
                                          <div className="font-mono text-[13px] font-bold text-brand">#{product.Product_ID}</div>
                                       </td>
                                       <td className="px-10 py-8">
                                          <div className="text-[14px] font-bold text-primary tracking-tight">{product.Product_Name}</div>
                                          <div className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-40 mt-1">{product.Model_Number}</div>
                                       </td>
                                       <td className="px-10 py-8">
                                          <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-lg bg-bg-primary border border-border-color flex items-center justify-center text-brand">
                                                <ShieldCheck className="w-4 h-4"/>
                                             </div>
                                             <div>
                                                <div className="text-[12px] font-bold text-primary">{new Date(product.End_Date).toLocaleDateString()}</div>
                                                <div className="text-[9px] font-bold text-secondary uppercase tracking-widest opacity-40">Expiration Node</div>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-10 py-8">
                                          <div className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border ${
                                            product.IsUnderWarranty 
                                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                              : 'bg-red-50 text-red-600 border-red-100'
                                          }`}>
                                             {product.IsUnderWarranty ? 'ACTIVE' : 'EXPIRED'}
                                          </div>
                                       </td>
                                       <td className="px-10 py-8 text-right">
                                          <button className="p-3 rounded-xl bg-bg-primary border border-border-color text-secondary hover:text-brand hover:border-brand/30 transition-all">
                                             <ArrowRight className="w-4 h-4" />
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                        
                        {/* Table Footer */}
                        <div className="px-10 py-8 bg-bg-primary/30 flex justify-between items-center border-t border-border-color">
                           <div className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Registry Integrity: 100% Verified</div>
                           <div className="flex gap-4">
                              <button className="h-10 w-10 rounded-xl border border-border-color bg-bg-secondary flex items-center justify-center text-secondary/30 hover:text-primary transition-all disabled:opacity-20" disabled><ChevronRight className="w-4 h-4 rotate-180"/></button>
                              <button className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center text-white text-[11px] font-bold">01</button>
                              <button className="h-10 w-10 rounded-xl border border-border-color bg-bg-secondary flex items-center justify-center text-secondary hover:bg-bg-primary transition-all text-xs font-bold">02</button>
                              <button className="h-10 w-10 rounded-xl border border-border-color bg-bg-secondary flex items-center justify-center text-secondary/30 hover:text-primary transition-all"><ChevronRight className="w-4 h-4"/></button>
                           </div>
                        </div>
                    </div>
                </div>
              )}

              {activeTab === 'service' && (
                 <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-5xl mx-auto py-10">
                    <div className="text-center">
                       <h2 className="text-4xl font-bold text-primary tracking-tight mb-4">Service <span className="text-brand">Hub.</span></h2>
                       <p className="text-secondary font-semibold text-lg max-w-2xl mx-auto opacity-70">Initialize a maintenance record to restore system equilibrium.</p>
                    </div>
                    
                    <div className="glass-card overflow-hidden shadow-2xl border-border-color flex flex-col md:flex-row min-h-[600px] bg-bg-secondary">
                       <div className="md:w-96 bg-brand p-12 text-white relative overflow-hidden flex flex-col">
                          <div className="relative z-10 flex-1">
                             <div className="inline-flex px-4 py-1.5 bg-white/10 backdrop-blur-lg rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 mb-10">Support Flow</div>
                             <h4 className="text-4xl font-bold mb-10 leading-tight tracking-tight">REPORT <br/>AN <br/>ISSUE.</h4>
                             
                             <div className="space-y-10">
                                <div className="flex gap-5 group">
                                   <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-lg font-bold border border-white/20 shrink-0">1</div>
                                   <div>
                                      <h6 className="font-bold text-[11px] uppercase tracking-widest mb-1 opacity-70">Select Asset</h6>
                                      <p className="text-sm font-medium leading-relaxed opacity-80">Choose your verified product from the registry.</p>
                                   </div>
                                </div>
                                <div className="flex gap-6 group opacity-70">
                                   <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-lg font-black italic border border-white/20 shrink-0 group-hover:scale-110 transition-transform">02</div>
                                   <div>
                                      <h6 className="font-black text-[11px] uppercase tracking-widest mb-1 opacity-60">Diagnostics</h6>
                                      <p className="text-sm font-bold leading-relaxed">Classify the anomaly via our grid-based failure matrix.</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex-1 p-12 bg-bg-secondary">
                          <form onSubmit={raiseService} className="space-y-8">
                             <div>
                                <label className="block text-[11px] font-bold text-secondary uppercase tracking-widest mb-4 opacity-70">Asset Category</label>
                                <select required value={serviceForm.productId} onChange={e=>setServiceForm({...serviceForm, productId: e.target.value})} className="premium-input w-full">
                                   <option value="">SELECT REGISTERED ASSET...</option>
                                   {products.map(p => (
                                     <option key={p.Product_ID} value={p.Product_ID}>{p.Product_Name} — {p.Model_Number}</option>
                                   ))}
                                </select>
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-secondary uppercase tracking-widest mb-4 opacity-70">Detailed Narrative</label>
                                <textarea 
                                   required 
                                   value={serviceForm.issue} 
                                   onChange={e=>setServiceForm({...serviceForm, issue:e.target.value})} 
                                   className="premium-input w-full p-6 text-sm min-h-[160px] leading-relaxed" 
                                   placeholder="DESCRIBE THE SYSTEM PARAMETERS AND ANOMALY DETAILS..."
                                ></textarea>
                             </div>
                             <button type="submit" className="w-full bg-brand hover:bg-blue-600 text-white py-5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all border-none cursor-pointer">
                                BROADCAST INCIDENT
                             </button>
                          </form>
                       </div>
                    </div>
                 </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                   <div className="px-2">
                     <h2 className="text-5xl font-black text-[#0F172A] tracking-tighter mb-2 italic uppercase">Task <span className="text-blue-600 not-italic">Synchronizer.</span></h2>
                     <p className="text-[#64748B] font-black text-xs tracking-[0.2em] opacity-50">HISTORICAL DATABASE OF SERVICE PROTOCOLS</p>
                   </div>
                   
                   <div className="glass-card border-white/40 shadow-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-sans">
                           <thead className="text-[11px] font-black uppercase tracking-[0.3em] text-[#94A3B8] border-b border-white/10 bg-slate-50/50 backdrop-blur-md">
                              <tr>
                                 <th className="px-12 py-8">Protocol ID</th>
                                 <th className="px-10 py-8">Asset</th>
                                 <th className="px-10 py-8">Assigned Field Unit</th>
                                 <th className="px-10 py-8">Current State</th>
                                 <th className="px-12 py-8 text-right">Completion</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100/50 bg-white/10">
                              {services.map(s => {
                                 const isCompleted = s.TaskStatus === 'Completed';
                                 return (
                                   <tr key={s.Request_ID} className="group hover:bg-blue-50/30 transition-all duration-500">
                                      <td className="px-12 py-10">
                                         <div className="flex flex-col">
                                            <span className="font-mono text-[14px] font-black text-[#2563EB] tracking-tighter">#RQ-{s.Request_ID}</span>
                                            <span className="text-[9px] text-slate-400 font-black uppercase mt-1 px-2 py-0.5 rounded bg-slate-100 w-max tracking-widest border border-slate-200/50">SLA: 1.5H</span>
                                         </div>
                                      </td>
                                      <td className="px-10 py-10">
                                         <span className="text-[15px] font-black text-[#0F172A] italic tracking-tight">{s.Product_Name.toUpperCase()}</span>
                                      </td>
                                      <td className="px-10 py-10">
                                         <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl border-2 border-white shadow-md overflow-hidden shrink-0 group-hover:scale-110 transition-transform">
                                               <img alt="Tech" src={`https://api.dicebear.com/7.x/notionists/svg?seed=${s.TechnicianName || 'null'}`} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[12px] font-black text-[#64748B] uppercase tracking-widest">{s.TechnicianName || 'EN-ROUTE DISPATCH'}</span>
                                         </div>
                                      </td>
                                      <td className="px-10 py-10 font-black">
                                         <span className={`px-5 py-2 rounded-xl text-[10px] uppercase tracking-[0.2em] border shadow-sm ${
                                            isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                         }`}>
                                            {s.TaskStatus || 'QUEUED'}
                                         </span>
                                      </td>
                                      <td className="px-12 py-10">
                                         <div className="flex items-center gap-5 justify-end">
                                            <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                               <div className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500 w-full' : 'bg-blue-500 w-1/3'} rounded-full`}></div>
                                            </div>
                                            <span className="text-[12px] font-black text-[#0F172A] italic font-mono">{isCompleted ? '100%' : '30%'}</span>
                                         </div>
                                      </td>
                                   </tr>
                                 );
                              })}
                              {services.length === 0 && (
                                <tr><td colSpan="5" className="py-40 text-center text-slate-400 font-black uppercase tracking-[0.4em] italic opacity-40">Zero service telemetry found in history.</td></tr>
                              )}
                           </tbody>
                        </table>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === 'payments' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                   <div className="px-2">
                     <h2 className="text-5xl font-black text-[#0F172A] tracking-tighter mb-2 italic uppercase">Financial <span className="text-blue-600 not-italic">Ledger.</span></h2>
                     <p className="text-[#64748B] font-black text-xs tracking-[0.2em] opacity-50">CORE BILLING AND INVOICE ARCHIVE</p>
                   </div>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                       <div className="lg:col-span-1 space-y-8">
                          <div className="glass-card p-10 border-white/40 shadow-xl shadow-blue-500/5 bg-brand-gradient text-white border-none">
                             <div className="flex justify-between items-start mb-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Total Expenditure</span>
                                <CreditCard className="w-6 h-6 opacity-60" />
                             </div>
                             <h4 className="text-4xl font-black italic tracking-tighter mb-2">$1,240.00</h4>
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Across 12 service events</p>
                          </div>
                          
                          <div className="glass-card p-10 border-white/40 shadow-xl shadow-slate-500/5">
                             <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#64748B] mb-8 opacity-60 italic">Default Node</h6>
                             <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center text-white"><CreditCard className="w-5 h-5"/></div>
                                <div>
                                   <div className="text-[12px] font-black text-[#0F172A] leading-none mb-1">•••• 4242</div>
                                   <div className="text-[9px] font-black text-[#64748B] uppercase tracking-widest">VISA PLATINUM</div>
                                </div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="lg:col-span-3 glass-card border-white/40 shadow-2xl overflow-hidden">
                          <div className="p-10 border-b border-white/10 bg-white/20 backdrop-blur-md flex justify-between items-center">
                             <h4 className="text-xl font-black text-[#0F172A] italic uppercase tracking-tighter">Verified Invoices</h4>
                             <button className="h-12 w-12 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-all"><Search className="w-5 h-5"/></button>
                          </div>
                          <div className="overflow-x-auto">
                             <table className="w-full text-left">
                                <thead className="text-[10px] font-black uppercase tracking-[0.3em] text-[#94A3B8] border-b border-white/10 bg-slate-50/50">
                                   <tr>
                                      <th className="px-12 py-8">Protocol Ref</th>
                                      <th className="px-10 py-8">Service Value</th>
                                      <th className="px-10 py-8">Date</th>
                                      <th className="px-10 py-8 text-right">Download</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50/50 bg-white/10">
                                   {services.filter(s=>s.Amount).map(s => (
                                     <tr key={s.Request_ID} className="group hover:bg-blue-50/30 transition-all duration-500">
                                        <td className="px-12 py-8">
                                           <span className="font-mono text-[13px] font-black text-[#2563EB]">#INV-RQ{s.Request_ID}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                           <span className="text-[16px] font-black text-[#0F172A] italic tracking-tighter">${s.Amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-10 py-8">
                                           <span className="text-[13px] font-black text-[#64748B] uppercase tracking-widest opacity-60 font-mono">24 APR 2024</span>
                                        </td>
                                        <td className="px-12 py-8 text-right">
                                           <button className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#64748B] hover:bg-[#0F172A] hover:text-white transition-all cursor-pointer"><Settings className="w-5 h-5"/></button>
                                        </td>
                                     </tr>
                                   ))}
                                   {services.filter(s=>s.Amount).length === 0 && (
                                      <tr><td colSpan="4" className="py-32 text-center text-slate-400 font-black uppercase tracking-[0.4em] italic opacity-40">Zero financial records in ledger.</td></tr>
                                   )}
                                </tbody>
                             </table>
                          </div>
                       </div>
                   </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[100] bg-[#0F172A]/80 backdrop-blur-xl animate-in fade-in transition-all duration-500">
           <div className="absolute inset-0 bg-mesh opacity-30 pointer-events-none"></div>
          <div className="bg-white w-full max-w-lg p-14 rounded-[40px] relative shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-white/20 animate-in zoom-in-95 duration-500">
            <button onClick={()=>setIsProductModalOpen(false)} className="absolute top-10 right-10 w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-red-50 hover:text-red-500 font-black cursor-pointer border-none text-[#64748B] transition-all duration-300">
               <Plus className="w-6 h-6 rotate-45" />
            </button>
            <div className="bg-brand-gradient p-5 rounded-[24px] w-max mb-10 shadow-2xl shadow-blue-500/20">
               <Box className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-black text-4xl text-[#0F172A] mb-3 tracking-tighter italic uppercase">Asset <span className="text-blue-600 not-italic">Enrollment.</span></h3>
            <p className="text-md text-[#64748B] font-bold mb-12 opacity-70 tracking-tight leading-relaxed">Enter the physical parameters of the unit to establish a synchronized protection protocol.</p>
            
            <form onSubmit={addProduct} className="space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <label className="text-[10px] font-black uppercase text-[#64748B] tracking-[0.3em] mb-4 block ml-1 opacity-60">Identity Name</label>
                     <input required placeholder="E.G. TITAN 900" value={productForm.name} onChange={e=>setProductForm({...productForm, name:e.target.value})} className="premium-input w-full p-5 text-sm font-black italic uppercase" />
                  </div>
                  <div>
                     <label className="text-[10px] font-black uppercase text-[#64748B] tracking-[0.3em] mb-4 block ml-1 opacity-60">Protocol Serial</label>
                     <input required placeholder="SN-XXXX-XXXX" value={productForm.model} onChange={e=>setProductForm({...productForm, model:e.target.value})} className="premium-input w-full p-5 text-sm font-black italic uppercase" />
                  </div>
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase text-[#64748B] tracking-[0.3em] mb-4 block ml-1 opacity-60">Deployment Date</label>
                  <input required type="date" value={productForm.date} onChange={e=>setProductForm({...productForm, date:e.target.value})} className="premium-input w-full p-5 text-sm font-black uppercase tracking-widest font-mono" />
               </div>
               <button type="submit" className="w-full bg-[#0F172A] hover:bg-blue-600 text-white py-6 rounded-2xl mt-6 text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 border-none cursor-pointer scale-100 hover:scale-[1.02]">
                  INITIALIZE SYNC <ArrowRight className="w-5 h-5" />
               </button>
            </form>
          </div>
        </div>
      )}

      {/* User Dropdown / Profile Panel */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[110] flex justify-end" onClick={()=>setIsProfileOpen(false)}>
           <div className="absolute inset-0 bg-[#0F172A]/20 backdrop-blur-sm"></div>
           <div className="w-[450px] bg-white h-full shadow-[-20px_0_60px_rgba(0,0,0,0.1)] border-l border-white/20 animate-in slide-in-from-right duration-700 p-16 flex flex-col relative z-20" onClick={e=>e.stopPropagation()}>
              <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-10 relative z-10">
                  <h4 className="font-bold text-primary text-2xl tracking-tight">User <span className="text-brand">Profile.</span></h4>
                  <button onClick={()=>setIsProfileOpen(false)} className="w-10 h-10 rounded-xl bg-bg-primary flex items-center justify-center text-secondary hover:text-red-500 cursor-pointer border-none transition-all">
                     <Plus className="w-6 h-6 rotate-45" />
                  </button>
              </div>
              
              <div className="flex flex-col items-center mb-10 relative z-10">
                  <div className="w-24 h-24 rounded-2xl bg-brand p-0.5 shadow-xl mb-6 overflow-hidden">
                     <div className="w-full h-full rounded-[14px] bg-bg-secondary overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.First_Name}`} alt="Profile" className="w-full h-full object-cover" />
                     </div>
                  </div>
                  <h3 className="font-bold text-2xl text-primary tracking-tight mb-1">{user.First_Name} {user.Last_Name}</h3>
                  <p className="text-sm font-medium text-secondary/60 mb-6">{user.Email}</p>
                  <div className="px-4 py-1.5 rounded-full bg-brand-soft text-brand text-[10px] font-bold uppercase tracking-widest border border-brand/10">{user.Role} Account</div>
              </div>
              
              <div className="flex-1 space-y-12 overflow-y-auto custom-scrollbar pr-4 relative z-10">
                 <form onSubmit={updateProfile} className="space-y-10">
                    <div className="space-y-8">
                       <div>
                          <label className="text-[10px] font-black uppercase text-[#94A3B8] tracking-[0.3em] mb-4 block ml-1 italic opacity-60">Authority Contact</label>
                          <input value={phoneForm} onChange={e=>setPhoneForm(e.target.value)} className="premium-input w-full p-5 text-sm font-black italic tracking-widest font-mono" />
                       </div>
                       <div>
                          <label className="text-[10px] font-black uppercase text-[#94A3B8] tracking-[0.3em] mb-4 block ml-1 italic opacity-60">Dispatch Coordinates</label>
                          <textarea value={addressForm} onChange={e=>setAddressForm(e.target.value)} className="premium-input w-full p-5 text-sm font-bold min-h-[140px] leading-relaxed" />
                       </div>
                    </div>
                    <button className="w-full py-5 bg-[#0F172A] text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-blue-600 transition-all border-none cursor-pointer shadow-xl scale-100 hover:scale-[1.02]">SYNC PERSONAL RECORDS</button>
                 </form>
                 
                 <div className="space-y-6 pt-6 border-t border-slate-100">
                    <h5 className="text-[10px] font-black uppercase text-[#94A3B8] tracking-[0.3em] italic opacity-60">SECURED METADATA</h5>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[11px] text-[#64748B] font-black uppercase tracking-widest opacity-80">Reference ID</span>
                          <span className="font-mono font-black text-[#0F172A] text-[12px]">X-CUST-{user.Customer_ID}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[11px] text-[#64748B] font-black uppercase tracking-widest opacity-80">Sync Duration</span>
                          <span className="font-black text-[#0F172A] text-[12px] uppercase">154 DAYS ACTIVE</span>
                       </div>
                    </div>
                 </div>
              </div>
              
              <button onClick={handleLogout} className="w-full mt-10 py-5 flex items-center justify-center gap-3 text-white bg-red-600 font-black uppercase tracking-[0.3em] text-[11px] hover:bg-red-500 rounded-2xl transition-all border-none cursor-pointer shadow-lg shadow-red-500/10 relative z-10">
                 <LogOut className="w-4 h-4" /> TERMINATE PROTOCOL
              </button>
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
