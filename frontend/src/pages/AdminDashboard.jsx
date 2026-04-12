import { useTheme } from '../context/ThemeContext';
import { 
  LogOut, Box, Wrench, ShieldCheck, Activity, Users,
  Search, Moon, Sun, Plus, ChevronRight, BarChart3,
  Layers, Database, Terminal, ArrowRight, Zap, Target,
  User, MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'admin') {
      navigate('/login');
    } else {
      fetchAdminData();
    }
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/service-status'); 
      if (res.data.success) {
         setRequests(res.data.requests);
         const total = res.data.requests.length;
         const completed = res.data.requests.filter(r => r.TaskStatus === 'Completed').length;
         setStats({
            total,
            completed,
            pending: total - completed
         });
      }
    } catch (err) {
      toast.error("Authority error: Failed to fetch network records.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const updateRequestStatus = async (serviceId, status, cost, technician) => {
    const tId = toast.loading('Synchronizing authority updates...');
    try {
      await axios.put('http://localhost:5000/admin/service-update', {
        serviceId, status, cost, technician
      });
      toast.success('System record synchronized.', { id: tId });
      fetchAdminData();
    } catch (err) {
      toast.error('Authority rejection: Sync failed.', { id: tId });
    }
  };

  const navLinks = [
    { id: 'overview', label: 'Command Center', icon: Activity },
    { id: 'requests', label: 'Service Queue', icon: Wrench },
    { id: 'database', label: 'Asset Vault', icon: Box },
    { id: 'customers', label: 'Network Users', icon: Users },
    { id: 'reports', label: 'System Logs', icon: Terminal },
  ];

  const filteredRequests = requests.filter(req => 
    req.Product_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.First_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.Last_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.Request_ID.toString().includes(searchQuery)
  );

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
             <p className="text-[10px] text-secondary font-bold uppercase tracking-widest leading-none mt-1">Admin Authority</p>
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

        <div className="p-6 border-t border-slate-100 space-y-4">
           <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-[9px] uppercase font-black text-blue-600 tracking-[0.2em]">Node Capacity</span>
                 <span className="text-[10px] font-black text-[#0F172A] font-mono">82%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-[82%] rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"></div>
              </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3.5 px-5 py-4 rounded-xl border-none bg-transparent text-secondary hover:text-red-500 hover:bg-red-50/50 font-bold text-[11px] uppercase tracking-widest transition-colors group cursor-pointer">
              <LogOut className="w-4 h-4 opacity-60 group-hover:text-red-500" /> Secure Terminate
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-mesh">
        
        {/* Top Header */}
        <header className="h-20 glass-panel border-b border-white/40 px-10 flex items-center justify-between z-40 shrink-0">
          <div className="flex-1 max-w-xl relative group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/60 group-focus-within:text-brand transition-colors" />
             <input 
               placeholder="Enter authority credentials or protocol search..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-bg-primary/50 backdrop-blur-md border border-border-color rounded-xl pl-12 pr-6 py-2.5 text-[14px] font-medium focus:ring-4 focus:ring-brand-soft focus:outline-none transition-all" 
             />
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
            
            <div className="flex items-center gap-4 py-1.5 pl-1.5 pr-4 rounded-xl hover:bg-bg-secondary backdrop-blur-sm cursor-pointer transition-all border border-transparent hover:border-border-color group">
               <div className="hidden text-right md:block">
                  <div className="text-[13px] font-bold text-primary leading-none mb-0.5">System Admin</div>
                  <div className="text-[10px] font-medium text-secondary/70 uppercase tracking-widest">Master Authority</div>
               </div>
               <div className="w-9 h-9 rounded-lg bg-brand p-0.5 shadow-sm group-hover:shadow-md transition-all">
                  <div className="w-full h-full rounded-[7px] bg-bg-secondary overflow-hidden border border-white/10">
                    <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin" alt="Admin" className="w-full h-full object-cover" />
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
               <div className="w-10 h-10 border-3 border-[#2563EB]/10 border-t-[#2563EB] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-16 pb-20">
              
              {activeTab === 'overview' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                  {/* Greeting */}
                  <div className="relative">
                    <div className="absolute -left-10 top-0 w-1 h-32 bg-brand rounded-full opacity-20"></div>
                    <div className="space-y-4">
                      <h2 className="heading-xl text-primary animate-in">
                        Command <span className="text-brand">Center.</span>
                      </h2>
                      <h3 className="text-2xl font-semibold text-secondary tracking-tight flex items-center gap-3">
                        Infrastructure <span className="text-primary bg-bg-secondary px-3 py-1 rounded-lg border border-border-color">Operational</span>
                      </h3>
                      <p className="text-secondary font-medium mt-8 max-w-2xl leading-relaxed text-lg opacity-90">
                         Master authority established. Orchestrating the entire warranty ecosystem from a singular high-precision portal. Current network metrics indicate peak stability.
                      </p>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                      { label: 'Global Queue', val: stats.total, sub: 'Total Records', icon: Layers, color: 'brand' },
                      { label: 'Pending Action', val: stats.pending, sub: 'Requires Dispatch', icon: Users, color: 'orange' },
                      { label: 'Resolved', val: stats.completed, sub: 'Success Rate: 100%', icon: ShieldCheck, color: 'brand' },
                      { label: 'Network SLA', val: '99.9%', sub: 'Latency: 0.2ms', icon: Activity, color: 'brand' }
                    ].map((card, idx) => (
                      <div key={idx} className="glass-card p-10 relative overflow-hidden group">
                         <div className={`absolute top-0 left-0 w-1.5 h-full ${card.color === 'brand' ? 'bg-brand/10' : 'bg-orange-500/10'}`}></div>
                         <div className="flex justify-between items-start mb-10">
                            <div className="text-[11px] font-bold uppercase tracking-widest text-secondary/60">{card.label}</div>
                            <div className={`p-3 rounded-xl shadow-sm ${card.color === 'brand' ? 'bg-brand-soft text-brand' : 'bg-orange-50 text-orange-600'}`}>
                               <card.icon className="w-5 h-5"/>
                            </div>
                         </div>
                         <div className="text-6xl font-bold text-primary tracking-tighter leading-none mb-3">{card.val}</div>
                         <div className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">{card.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Trends & Logs */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                     <div className="lg:col-span-3 glass-card p-12">
                        <div className="flex justify-between items-center mb-12">
                           <div>
                              <h4 className="text-2xl font-bold text-primary tracking-tight">Load Distribution</h4>
                              <p className="text-[11px] font-bold text-secondary uppercase tracking-widest opacity-60">Resource allocation vs traffic</p>
                           </div>
                           <BarChart3 className="w-6 h-6 text-brand opacity-20"/>
                        </div>
                        <div className="flex items-end gap-3 h-56 mb-10">
                           {[40, 65, 45, 95, 65, 85, 50, 75, 45, 85, 100, 75].map((h, i) => (
                             <div key={i} className="flex-1 bg-bg-primary rounded-xl relative group transition-all hover:bg-brand-soft cursor-crosshair border border-border-color">
                                <div className="absolute bottom-0 left-0 right-0 bg-brand rounded-xl opacity-30 group-hover:opacity-100 transition-all duration-700" style={{height: `${h}%`}}></div>
                                <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-primary text-bg-primary text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 shadow-xl">0{i}:00 <span className="text-brand">/</span> {h}%</div>
                             </div>
                           ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60 border-t border-border-color pt-8 mt-2">
                           <span>Last 12H Satellite Telemetry</span>
                           <span>Updated: Node AP-15-X</span>
                        </div>
                     </div>
                     
                     <div className="lg:col-span-2 glass-card p-12 bg-primary text-bg-primary relative overflow-hidden group">
                        <div className="absolute top-[-50%] right-[-20%] w-[150%] h-[150%] bg-brand/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
                        <div className="relative z-10 flex flex-col h-full">
                           <div className="flex items-center gap-3 mb-10">
                              <Terminal className="w-6 h-6 text-brand"/>
                              <h4 className="text-xl font-bold uppercase tracking-tight">Diagnostic Stream</h4>
                           </div>
                           <div className="space-y-6 font-mono text-[12px] opacity-70 mb-14 leading-relaxed flex-1 overflow-y-auto custom-scrollbar pr-2">
                              <div className="flex gap-3"><span className="text-brand">[08:42:15]</span> <span className="font-bold">SYNC:</span> Authority cluster 10.0.4.15 is SECURE.</div>
                              <div className="flex gap-3"><span className="text-brand">[08:45:02]</span> <span className="font-bold">INFO:</span> Consistency verified across continental nodes.</div>
                              <div className="flex gap-3"><span className="text-brand">[08:50:44]</span> <span className="font-bold">NODE:</span> Protocol #RQ-506 established. Dispatching...</div>
                              <div className="flex gap-3"><span className="text-orange-400">[09:02:11]</span> <span className="font-bold">WARN:</span> Latency variance detected in AP-South: +14ms.</div>
                              <div className="flex gap-3"><span className="text-brand">[09:05:01]</span> <span className="font-bold">INFO:</span> Scaling compute nodes to meet surge demand.</div>
                           </div>
                           <button className="bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-white/10 transition-all w-full flex items-center justify-center gap-3 shadow-2xl">
                              INITIATE ADVANCED AUDIT <ArrowRight className="w-4 h-4 opacity-50" />
                           </button>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-8 px-2">
                       <div className="relative">
                         <div className="absolute -left-10 top-0 w-1 h-16 bg-brand rounded-full opacity-20"></div>
                         <h2 className="text-4xl font-bold text-primary tracking-tight mb-2">Service <span className="text-brand">Queue.</span></h2>
                         <p className="text-secondary font-semibold text-xs tracking-widest uppercase opacity-60">Network-wide maintenance protocols</p>
                       </div>
                       <div className="flex gap-5">
                         <button onClick={fetchAdminData} className="px-8 py-3.5 bg-bg-secondary text-primary rounded-xl font-bold text-[11px] uppercase tracking-widest border border-border-color hover:bg-bg-primary transition-all">
                            <Database className="w-5 h-5 opacity-40"/> Hot Reload Database
                         </button>
                       </div>
                    </div>

                   <div className="grid grid-cols-1 gap-12">
                      {filteredRequests.map(req => {
                         const isCompleted = req.TaskStatus === 'Completed';
                         return (
                             <div key={req.Request_ID} className="glass-card border-border-color overflow-hidden flex flex-col xl:flex-row min-h-[450px] group bg-bg-secondary">
                                <div className="w-full xl:w-[480px] border-r border-border-color p-10 flex flex-col justify-between relative overflow-hidden bg-bg-primary/50">
                                   <div>
                                      <div className="flex justify-between items-start mb-8">
                                         <div className="bg-bg-secondary p-4 rounded-xl text-brand border border-border-color shadow-sm">
                                            <Wrench className="w-8 h-8"/>
                                         </div>
                                         <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                                           isCompleted ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                         }`}>
                                           {req.TaskStatus || 'QUEUED'}
                                         </span>
                                      </div>
                                      <h3 className="text-3xl font-bold text-primary mb-4 leading-tight tracking-tight">{req.Product_Name}</h3>
                                      <div className="flex items-center gap-3 text-xs font-bold text-brand tracking-widest mb-8 font-mono">
                                        #RQ-{req.Request_ID} <span className="opacity-20">/</span> PROT-{req.Product_ID}
                                      </div>
                                      
                                      <div className="space-y-4">
                                         <div className="flex items-center gap-4 p-4 bg-bg-secondary rounded-xl border border-border-color">
                                            <div className="w-10 h-10 rounded-lg bg-brand p-0.5 shadow-sm">
                                               <div className="w-full h-full rounded-[7px] bg-bg-secondary overflow-hidden">
                                                  <img alt="User" src={`https://api.dicebear.com/7.x/notionists/svg?seed=${req.First_Name}`} className="w-full h-full object-cover" />
                                               </div>
                                            </div>
                                            <div>
                                               <p className="text-[13px] font-bold text-primary tracking-tight">{req.First_Name} {req.Last_Name}</p>
                                               <p className="text-[10px] text-secondary font-bold uppercase tracking-widest opacity-60">Verified End-User</p>
                                            </div>
                                         </div>
                                         <div className="flex items-center gap-4 px-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100/50 flex items-center justify-center text-slate-400">
                                               <MapPin className="w-5 h-5"/>
                                            </div>
                                            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">GLOBAL DISPATCH NODE REQ.</p>
                                         </div>
                                      </div>
                                   </div>
                                   
                                   <div className="mt-12 pt-8 border-t border-border-color">
                                      <div className="flex items-center gap-2 mb-4">
                                         <Target className="w-3.5 h-3.5 text-brand opacity-60" />
                                         <span className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">INCIDENT NARRATIVE</span>
                                      </div>
                                      <p className="text-[14px] font-medium text-primary leading-relaxed">{req.Issue_Description}</p>
                                   </div>
                                </div>
                               
                                <div className="flex-1 p-12 bg-bg-secondary flex flex-col justify-center relative">
                                   <form 
                                     className="space-y-10"
                                     onSubmit={(e) => {
                                       e.preventDefault();
                                       updateRequestStatus(
                                         req.RecordId, 
                                         e.target.status.value, 
                                         e.target.cost.value, 
                                         e.target.technician.value
                                       );
                                     }}
                                   >
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                         <div>
                                            <label className="block text-[11px] font-bold text-secondary uppercase tracking-widest mb-4 opacity-60">Assigned Technician</label>
                                            <div className="relative group">
                                               <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/30 group-focus-within:text-brand transition-colors" />
                                               <input name="technician" defaultValue={req.TechnicianName} className="premium-input w-full pl-16 py-4 text-[14px]" placeholder="NAME OF DISPATCHED UNIT..." />
                                            </div>
                                         </div>
                                         <div>
                                            <label className="block text-[11px] font-bold text-secondary uppercase tracking-widest mb-4 opacity-60">Service Cost (USD)</label>
                                            <div className="relative group">
                                               <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary/30 group-focus-within:text-brand transition-colors" />
                                               <input type="number" step="0.01" name="cost" defaultValue={req.Cost} className="premium-input w-full pl-16 py-4 text-[14px] font-mono" placeholder="0.00" />
                                            </div>
                                         </div>
                                      </div>
                                      
                                      <div>
                                         <label className="block text-[11px] font-bold text-secondary uppercase tracking-widest mb-6 opacity-60">Update Status</label>
                                         <div className="grid grid-cols-3 gap-4">
                                            {['Pending', 'In Progress', 'Completed'].map(status => (
                                               <label key={status} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                                                 (req.TaskStatus || 'Pending') === status 
                                                   ? 'border-brand bg-brand-soft shadow-sm scale-105' 
                                                   : 'border-border-color bg-bg-primary hover:border-secondary/30'
                                               }`}>
                                                  <input type="radio" name="status" value={status} defaultChecked={(req.TaskStatus || 'Pending') === status} className="hidden" />
                                                  <span className={`text-[10px] font-bold uppercase tracking-widest ${ (req.TaskStatus || 'Pending') === status ? 'text-brand' : 'text-secondary/60'}`}>{status}</span>
                                               </label>
                                            ))}
                                         </div>
                                      </div>

                                      <button type="submit" className="w-full bg-primary hover:bg-brand text-bg-primary py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all shadow-lg cursor-pointer">
                                         SYNCHRONIZE RECORD
                                      </button>
                                   </form>
                                </div>
                             </div>
                         );
                      })}
                      {filteredRequests.length === 0 && (
                        <div className="py-40 text-center glass-card border-dashed border-slate-200 shadow-none">
                           <Layers className="w-20 h-20 text-slate-100 mx-auto mb-8 opacity-40 animate-pulse" />
                           <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-md italic opacity-40">Zero telemetery matches for query registry.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* Other admin tabs (database, customers, reports) can follow same pattern */}
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
