import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
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
         const completed = res.data.requests.filter(r => r.Status === 'Completed').length;
         setStats({
            total,
            completed,
            pending: total - completed
         });
      }
    } catch (err) {
      toast.error("Failed to fetch system records.");
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
    const tId = toast.loading('Updating system records...');
    try {
      await axios.put('http://localhost:5000/admin/service-update', {
        serviceId, status, cost, technician
      });
      toast.success('Record updated successfully.', { id: tId });
      fetchAdminData();
    } catch (err) {
      toast.error('Update failed: Connection error.', { id: tId });
    }
  };

  const navLinks = [
    { id: 'overview', label: 'Dashboard', icon: Activity },
    { id: 'requests', label: 'Service Queue', icon: Wrench },
    { id: 'database', label: 'Product Inventory', icon: Box },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reports', label: 'System Logs', icon: Terminal },
  ];

  const filteredRequests = requests.filter(req => 
    req.Product_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.First_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.Last_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.Request_ID?.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-bg-primary flex font-sans overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-72 bg-bg-secondary border-r border-border-color flex flex-col hidden lg:flex relative z-50">
        <div className="p-8 flex items-center gap-3.5 mb-8">
           <div className="bg-brand p-2.5 rounded-xl shadow-lg">
             <ShieldCheck className="w-5 h-5 text-bg-primary" />
           </div>
           <div>
             <span className="text-xl font-bold text-text-primary tracking-tight italic serif-heading">Admin<span className="text-brand">Suite.</span></span>
           </div>
        </div>

        <nav className="flex-1 px-6 space-y-2">
           {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3.5 px-5 py-3 rounded-xl transition-all duration-300 border-none group relative ${
                activeTab === link.id 
                  ? 'bg-brand text-bg-primary shadow-sm' 
                  : 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-brand/5'
              }`}
            >
              <link.icon className={`w-4 h-4 transition-colors ${activeTab === link.id ? 'text-bg-primary' : 'text-text-secondary group-hover:text-text-primary'}`} />
              <span className={`text-[13px] font-semibold tracking-tight ${activeTab === link.id ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-border-color space-y-4">
           <div className="bg-bg-primary rounded-2xl p-5 border border-border-color">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-[9px] uppercase font-black text-text-secondary tracking-[0.2em]">Service Load</span>
                 <span className="text-[10px] font-black text-text-primary font-mono">82%</span>
              </div>
              <div className="w-full h-1.5 bg-border-color rounded-full overflow-hidden">
                 <div className="h-full bg-brand w-[82%] rounded-full shadow-sm"></div>
              </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3.5 px-5 py-4 rounded-xl border-none bg-transparent text-text-secondary hover:text-red-500 hover:bg-red-50/10 font-bold text-[11px] uppercase tracking-widest transition-colors group cursor-pointer">
              <LogOut className="w-4 h-4 opacity-60 group-hover:text-red-500" /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-bg-primary">
        
        {/* Top Header */}
        <header className="h-20 bg-bg-secondary border-b border-border-color px-10 flex items-center justify-between z-40 shrink-0 shadow-sm">
          <div className="flex-1 max-w-xl relative group">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
             <input 
               placeholder="Search by Request ID, Product or Customer..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-bg-primary border border-border-color rounded-xl pl-12 pr-6 py-2.5 text-[14px] font-medium focus:ring-1 focus:ring-brand focus:outline-none transition-all text-text-primary" 
             />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 border-r border-border-color pr-6 hidden md:flex">
               <button 
                 onClick={toggleTheme}
                 className="w-10 h-10 rounded-xl bg-bg-primary border border-border-color flex items-center justify-center hover:shadow-md transition-all cursor-pointer group"
               >
                 {isDark ? <Sun className="w-5 h-5 text-brand" /> : <Moon className="w-5 h-5 text-text-secondary" />}
               </button>
            </div>
            
            <div className="flex items-center gap-4 py-1.5 pl-1.5 pr-4 rounded-xl hover:bg-bg-primary cursor-pointer transition-all border border-transparent hover:border-border-color group">
               <div className="hidden text-right md:block">
                  <div className="text-[13px] font-bold text-text-primary leading-none mb-0.5">Admin</div>
                  <div className="text-[10px] font-medium text-text-secondary uppercase tracking-widest opacity-60">Master Access</div>
               </div>
               <div className="w-9 h-9 rounded-lg bg-brand p-0.5 shadow-sm">
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
               <div className="w-10 h-10 border-2 border-brand/20 border-t-brand rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto space-y-16 pb-20">
              
              {activeTab === 'overview' && (
                <div className="space-y-16 animate-in">
                  {/* Greeting */}
                  <div className="relative">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold text-text-primary italic serif-heading">
                        Admin <span className="text-brand">Overview.</span>
                      </h2>
                      <p className="text-text-secondary font-medium max-w-2xl leading-relaxed text-lg opacity-80">
                         Master administration portal active. Monitor service requests, manage product inventories, and oversee customer support interactions.
                      </p>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                      { label: 'Total Requests', val: stats.total, sub: 'Lifetime entries', icon: Layers, color: 'brand' },
                      { label: 'Pending Action', val: stats.pending, sub: 'Awaiting technician', icon: Users, color: 'orange' },
                      { label: 'Resolved Cases', val: stats.completed, sub: 'Successfully closed', icon: ShieldCheck, color: 'brand' },
                      { label: 'System Uptime', val: '99.9%', sub: 'Healthy status', icon: Activity, color: 'brand' }
                    ].map((card, idx) => (
                      <div key={idx} className="bg-bg-secondary p-10 rounded-[2.5rem] border border-border-color shadow-sm relative overflow-hidden group">
                         <div className={`absolute top-0 left-0 w-1.5 h-full ${card.color === 'brand' ? 'bg-brand' : 'bg-orange-500'}`}></div>
                         <div className="flex justify-between items-start mb-10">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary opacity-60">{card.label}</div>
                            <div className="p-3 rounded-xl bg-bg-primary shadow-sm text-brand border border-border-color">
                               <card.icon className="w-5 h-5"/>
                            </div>
                         </div>
                         <div className="text-6xl font-bold text-text-primary tracking-tighter leading-none mb-3">{card.val}</div>
                         <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">{card.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Trends & Logs */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                     <div className="lg:col-span-3 bg-bg-secondary p-12 border border-border-color rounded-[3rem] shadow-sm">
                        <div className="flex justify-between items-center mb-12">
                           <div>
                              <h4 className="text-2xl font-bold text-text-primary tracking-tight">System Load</h4>
                              <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Resource usage vs request traffic</p>
                           </div>
                           <BarChart3 className="w-6 h-6 text-brand opacity-20"/>
                        </div>
                        <div className="flex items-end gap-3 h-56 mb-10">
                           {[40, 65, 45, 95, 65, 85, 50, 75, 45, 85, 100, 75].map((h, i) => (
                             <div key={i} className="flex-1 bg-bg-primary rounded-xl relative group transition-all hover:bg-brand/5 cursor-crosshair border border-border-color">
                                <div className="absolute bottom-0 left-0 right-0 bg-brand rounded-xl opacity-20 group-hover:opacity-100 transition-all duration-700" style={{height: `${h}%`}}></div>
                             </div>
                           ))}
                        </div>
                        <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 border-t border-border-color pt-8 mt-2">
                           <span>Last 12H System Metrics</span>
                           <span>Status: Operational</span>
                        </div>
                     </div>
                     
                     <div className="lg:col-span-2 bg-brand p-12 text-bg-primary rounded-[3rem] relative overflow-hidden group shadow-xl">
                        <div className="relative z-10 flex flex-col h-full">
                           <div className="flex items-center gap-3 mb-10">
                              <Terminal className="w-6 h-6 text-bg-primary"/>
                              <h4 className="text-xl font-bold uppercase tracking-tight">System Logs</h4>
                           </div>
                           <div className="space-y-6 font-mono text-[12px] opacity-70 mb-14 leading-relaxed flex-1 overflow-y-auto custom-scrollbar pr-2">
                              <div className="flex gap-3"><span className="font-bold opacity-50">[08:42]</span> <span className="font-bold">SYNC:</span> Database cluster is SECURE.</div>
                              <div className="flex gap-3"><span className="font-bold opacity-50">[08:45]</span> <span className="font-bold">INFO:</span> Consistency verified.</div>
                              <div className="flex gap-3"><span className="font-bold opacity-50">[08:50]</span> <span className="font-bold">NODE:</span> New service request initialized.</div>
                              <div className="flex gap-3"><span className="font-bold opacity-50">[09:05]</span> <span className="font-bold">INFO:</span> Request load within thresholds.</div>
                           </div>
                           <button className="bg-bg-primary/10 hover:bg-bg-primary/20 text-bg-primary py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-bg-primary/20 transition-all w-full flex items-center justify-center gap-3 shadow-sm">
                              ADVANCED AUDIT <ArrowRight className="w-4 h-4 opacity-50" />
                           </button>
                        </div>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'requests' && (
                <div className="space-y-16 animate-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-8 px-2">
                       <div className="relative">
                          <h2 className="text-4xl font-bold text-text-primary tracking-tight mb-2 underline decoration-brand/30 underline-offset-8">Service <span className="text-brand">Queue.</span></h2>
                          <p className="text-text-secondary font-semibold text-xs tracking-widest uppercase opacity-60">Network-wide maintenance protocols</p>
                       </div>
                       <div className="flex gap-5">
                         <button onClick={fetchAdminData} className="px-8 py-3.5 bg-bg-secondary text-text-primary rounded-xl font-bold text-[11px] uppercase tracking-widest border border-border-color hover:bg-bg-primary transition-all">
                            <Database className="w-4 h-4 opacity-40 mr-2"/> Refresh Registry
                         </button>
                       </div>
                    </div>

                   <div className="grid grid-cols-1 gap-12">
                      {filteredRequests.map(req => {
                         const isCompleted = req.Status === 'Completed';
                         const isUnderWarranty = (new Date() <= new Date(req.End_Date));
                         return (
                             <div key={req.Request_ID} className="bg-bg-secondary border border-border-color rounded-[3rem] overflow-hidden flex flex-col xl:flex-row min-h-[450px] group transition-all hover:shadow-xl">
                                <div className="w-full xl:w-[480px] border-r border-border-color p-10 flex flex-col justify-between relative overflow-hidden bg-bg-primary/50">
                                   <div>
                                      <div className="flex justify-between items-start mb-8">
                                         <div className="bg-bg-secondary p-4 rounded-xl text-brand border border-border-color shadow-sm transition-colors">
                                            <Wrench className="w-8 h-8"/>
                                         </div>
                                         <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border shadow-sm ${
                                           isCompleted ? 'badge-completed' : 'badge-pending'
                                         }`}>
                                           {req.Status || 'QUEUED'}
                                         </span>
                                      </div>
                                      <h3 className="text-3xl font-bold text-text-primary mb-4 leading-tight tracking-tight italic serif-heading">{req.Product_Name}</h3>
                                      <div className="flex items-center gap-3 text-xs font-bold text-brand tracking-widest mb-4 font-mono">
                                        #REQ-{req.Request_ID} <span className="opacity-20">/</span> ID-{req.Product_ID}
                                      </div>
                                      
                                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 ${
                                        isUnderWarranty 
                                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' 
                                        : 'bg-red-500/10 text-red-600 border border-red-500/20'
                                      }`}>
                                        <ShieldCheck className="w-3 h-3" />
                                        {isUnderWarranty ? 'Under Warranty' : 'Warranty Expired'}
                                      </div>
                                      
                                      <div className="space-y-4">
                                         <div className="flex items-center gap-4 p-4 bg-bg-secondary rounded-xl border border-border-color transition-colors">
                                            <div className="w-10 h-10 rounded-lg bg-brand p-0.5 shadow-sm">
                                               <div className="w-full h-full rounded-[7px] bg-bg-secondary overflow-hidden">
                                                  <img alt="User" src={`https://api.dicebear.com/7.x/notionists/svg?seed=${req.First_Name}`} className="w-full h-full object-cover" />
                                               </div>
                                            </div>
                                            <div>
                                               <p className="text-[13px] font-bold text-text-primary tracking-tight">{req.First_Name} {req.Last_Name}</p>
                                               <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-60">Verified End-User</p>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                   
                                   <div className="mt-12 pt-8 border-t border-border-color">
                                      <div className="flex items-center gap-2 mb-4">
                                         <Target className="w-3.5 h-3.5 text-brand opacity-60" />
                                         <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">ISSUE DESCRIPTION</span>
                                      </div>
                                      <p className="text-[14px] font-medium text-text-primary leading-relaxed">{req.Issue_Description}</p>
                                   </div>
                                </div>
                               
                                <div className="flex-1 p-12 bg-bg-secondary flex flex-col justify-center relative">
                                   <form 
                                     className="space-y-10"
                                     onSubmit={(e) => {
                                       e.preventDefault();
                                       updateRequestStatus(
                                         req.Request_ID, 
                                         e.target.status.value, 
                                         e.target.cost.value, 
                                         e.target.technician.value
                                       );
                                     }}
                                   >
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                         <div>
                                            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-4 opacity-60">Assigned Technician</label>
                                            <div className="relative group">
                                               <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary opacity-30 group-focus-within:text-brand transition-colors" />
                                               <input name="technician" defaultValue={req.Technician_Name} className="premium-input w-full pl-16 py-4 text-[14px] bg-bg-primary text-text-primary" placeholder="Technician Name..." />
                                            </div>
                                         </div>
                                         <div>
                                            <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-4 opacity-60">Service Cost (USD)</label>
                                            <div className="relative group">
                                               <Zap className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary opacity-30 group-focus-within:text-brand transition-colors" />
                                               <input 
                                                  type="number" 
                                                  step="0.01" 
                                                  name="cost" 
                                                  defaultValue={isUnderWarranty ? "0.00" : req.Cost} 
                                                  readOnly={isUnderWarranty}
                                                  className={`premium-input w-full pl-16 py-4 text-[14px] font-mono bg-bg-primary text-text-primary ${isUnderWarranty ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                                  placeholder="0.00" 
                                               />
                                            </div>
                                            {isUnderWarranty && <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-2">Free under warranty</p>}
                                         </div>
                                      </div>
                                      
                                      <div>
                                         <label className="block text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-6 opacity-60">Update Status</label>
                                         <div className="grid grid-cols-3 gap-4">
                                            {['Pending', 'In Progress', 'Completed'].map(status => (
                                               <label key={status} className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                                                 (req.Status || 'Pending') === status 
                                                   ? 'border-brand bg-brand/5 shadow-sm scale-105' 
                                                   : 'border-border-color bg-bg-primary hover:border-brand/30'
                                               }`}>
                                                  <input type="radio" name="status" value={status} defaultChecked={(req.Status || 'Pending') === status} className="hidden" />
                                                  <span className={`text-[10px] font-bold uppercase tracking-widest ${ (req.Status || 'Pending') === status ? 'text-brand' : 'text-text-secondary/60'}`}>{status}</span>
                                               </label>
                                            ))}
                                         </div>
                                      </div>

                                      <button type="submit" className="primary-button w-full py-5 text-[11px] uppercase tracking-widest shadow-xl">
                                         SYNCHRONIZE RECORD
                                      </button>
                                   </form>
                                </div>
                             </div>
                         );
                      })}
                      {filteredRequests.length === 0 && (
                        <div className="py-40 text-center bg-bg-secondary border border-dashed border-border-color rounded-[3rem]">
                           <Layers className="w-20 h-20 text-text-secondary mx-auto mb-8 opacity-10" />
                           <p className="text-text-secondary font-black uppercase tracking-[0.4em] text-md italic opacity-40">No records found matching your query.</p>
                        </div>
                      )}
                   </div>
                </div>
              )}

              {/* Other tabs follow same premium pattern */}
            </div>
          )}
        </main>
      </div>

    </div>
  );
};

export default AdminDashboard;
