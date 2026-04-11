import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  LogOut, Box, Wrench, Moon, Sun, ShieldCheck, Activity, Users
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // Theme state
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const navigate = useNavigate();

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
      // We will fetch all requests by passing no customerId or a specific admin route if existed.
      // Re-using the service-status endpoint without customerId to get all in our simplistic backend (or admin specific)
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
      toast.error("Failed to load admin data.");
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
    const tId = toast.loading('Synchronizing updates...');
    try {
      await axios.put('http://localhost:5000/admin/service-update', {
        serviceId, status, cost, technician
      });
      toast.success('Service request updated.', { id: tId });
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to update request', { id: tId });
    }
  };

  const navLinks = [
    { id: 'overview', label: 'Command Center', icon: Activity },
    { id: 'requests', label: 'Service Queue', icon: Wrench },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans relative z-0">
      
      {/* Background Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Top Navbar */}
      <header className="h-20 nav-glass px-8 flex items-center justify-between sticky top-0 z-40 w-full transition-all">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-800 to-black p-2 rounded-xl shadow-lg border border-white/10 dark:border-white/20">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight text-primary">Admin<span className="font-light text-brand">Portal</span></h1>
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

        <div className="flex items-center gap-4">
          <button onClick={() => setIsDark(!isDark)} className="w-10 h-10 rounded-full bg-transparent border border-std flex items-center justify-center text-secondary hover:text-brand hover:border-brand/50 transition-all cursor-pointer">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="h-8 w-[1px] border-l border-std mx-1"></div>
          
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 px-5 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer bg-transparent border border-transparent hover:border-red-500/20">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
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
            {activeTab === 'overview' && (
              <div className="space-y-10 max-w-6xl mx-auto animate-in fade-in">
                <section className="px-2">
                  <h2 className="text-4xl font-black tracking-tight mb-2 text-primary drop-shadow-sm">Command Center</h2>
                  <p className="font-medium text-secondary text-lg">Global infrastructure status and request volume.</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6 flex items-center justify-between group">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Total Queue</p>
                      <h3 className="text-4xl font-black text-primary">{stats.total}</h3>
                    </div>
                    <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                      <Box className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="glass-card p-6 flex items-center justify-between group">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Needs Dispatch</p>
                      <h3 className="text-4xl font-black text-orange-500">{stats.pending}</h3>
                    </div>
                    <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                      <Users className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>

                  <div className="glass-card p-6 flex items-center justify-between group">
                    <div>
                      <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Resolved</p>
                      <h3 className="text-4xl font-black text-emerald-500">{stats.completed}</h3>
                    </div>
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                      <Activity className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in">
                 <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2 text-primary">Service Queue</h2>
                    <p className="font-medium text-secondary">Manage and dispatch incoming service requests across the network.</p>
                 </div>

                 <div className="grid grid-cols-1 gap-6">
                    {requests.map(req => (
                      <div key={req.Request_ID} className="glass-card p-8 flex flex-col md:flex-row gap-8 justify-between relative hover:shadow-lg transition-shadow duration-300">
                         
                         <div className="absolute top-6 right-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border shadow-sm ${
                              req.TaskStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' : 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400'
                            }`}>
                              {req.TaskStatus || 'Pending'}
                            </span>
                         </div>

                         <div className="flex-1">
                           <h3 className="text-2xl font-black text-primary mb-1">{req.Product_Name}</h3>
                           <p className="text-xs font-mono font-bold text-secondary mb-4 drop-shadow-sm">CUSTOMER: {req.First_Name} {req.Last_Name} | ASSET ID: {req.Product_ID}</p>
                           
                           <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-std mb-6">
                              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Issue Reported</p>
                              <p className="text-sm font-medium text-primary italic leading-relaxed">"{req.Issue_Description}"</p>
                           </div>

                           <form 
                             className="grid grid-cols-1 md:grid-cols-3 gap-4"
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
                              <div>
                                <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Dispatch Tech</label>
                                <input name="technician" defaultValue={req.TechnicianName} className="w-full glass-input text-xs" placeholder="e.g., John Smith" />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Assessment Cost ($)</label>
                                <input type="number" step="0.01" name="cost" defaultValue={req.Cost} className="w-full glass-input text-xs" placeholder="0.00" />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold uppercase text-secondary tracking-widest mb-2 block ml-1">Lifecycle Status</label>
                                <select name="status" defaultValue={req.TaskStatus} className="w-full glass-input text-xs appearance-none font-bold">
                                  <option value="Pending" className="text-black">Pending</option>
                                  <option value="In Progress" className="text-black">In Progress</option>
                                  <option value="Completed" className="text-black">Completed</option>
                                </select>
                              </div>

                              <button type="submit" className="md:col-span-3 std-btn py-3 mt-2 text-[10px] uppercase tracking-widest">Push Configuration</button>
                           </form>
                         </div>
                      </div>
                    ))}
                    {requests.length === 0 && (
                       <div className="col-span-full p-20 text-center text-secondary uppercase tracking-widest font-bold glass-card">
                          Queue Empty.
                       </div>
                    )}
                 </div>
              </div>
            )}
          </>
        )}
      </main>

    </div>
  );
};

export default AdminDashboard;
