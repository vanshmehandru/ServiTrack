import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LogOut, Edit, Moon, Sun, 
  ShieldAlert, Cpu, Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  const [editingRequest, setEditingRequest] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', cost: '' });

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
    const role = localStorage.getItem('userRole');
    if (userData && role === 'admin') {
      setUser(JSON.parse(userData));
      fetchRequests();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/requests');
      if (res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const handleEdit = (req) => {
    setEditingRequest(req);
    setEditForm({
      status: req.TaskStatus || req.Status || 'Pending',
      cost: req.Cost !== null ? req.Cost : ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/admin/update-request', {
        serviceId: editingRequest.RecordId,
        requestId: editingRequest.Request_ID,
        status: editForm.status,
        cost: editForm.cost === '' ? null : editForm.cost
      });
      alert('Updated successfully');
      setEditingRequest(null);
      fetchRequests();
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-primary text-primary">
      
      {/* Top Navbar */}
      <header className="h-20 bg-secondary border-b border-std px-8 flex items-center justify-between sticky top-0 z-40 w-full shadow-sm">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary border border-std p-2 rounded-xl">
              <ShieldAlert className="text-brand w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight text-primary">System<span className="font-light">Root</span></h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer border-none font-bold text-sm bg-brand-blue/10 text-brand">
              <Activity className="w-4 h-4" />
              <span>Control Center</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer border-none font-bold text-sm bg-transparent text-secondary hover:bg-hover hover:text-primary">
              <Cpu className="w-4 h-4" />
              <span>Hardware Ledger</span>
            </button>
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
               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm flex items-center justify-center text-white font-black text-sm">
                   {user.Name?.[0]}
               </div>
             </button>

             {/* Profile Dropdown */}
             {isProfileOpen && (
               <div className="absolute top-14 right-0 w-64 std-card z-50 animate-in fade-in slide-in-from-top-4 p-6 shadow-xl">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black">
                     {user.Name?.[0]}
                   </div>
                   <div>
                     <h3 className="text-sm font-black text-primary leading-tight">{user.Name}</h3>
                     <p className="text-[10px] font-bold text-brand uppercase tracking-widest mt-0.5">SysAdmin</p>
                   </div>
                 </div>

                 <div className="border-t border-std pt-2">
                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 text-red-500 hover:bg-hover transition-colors rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer bg-transparent border-none">
                      <LogOut className="w-4 h-4" /> Terminate Auth
                    </button>
                 </div>
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-10 w-full relative z-10 custom-scrollbar">
        
         <div className="max-w-7xl mx-auto">
           <section className="mb-10 px-2">
              <h2 className="text-4xl font-black tracking-tight mb-2 text-primary">Dispatch & Lifecycle Control</h2>
              <p className="text-secondary font-bold text-lg">Assess, calculate costs, and finalize technician dispatches across the region.</p>
           </section>

           {/* Stats Summary Panel */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Pending Dispatch', value: requests.filter(r=>!r.TaskStatus || r.TaskStatus==='Pending').length, color: 'text-orange-500' },
                { label: 'Active Repairs', value: requests.filter(r=>r.TaskStatus==='In Progress' || r.TaskStatus==='Assigned').length, color: 'text-brand' },
                { label: 'Completed Ops', value: requests.filter(r=>r.TaskStatus==='Completed').length, color: 'text-green-500' },
                { label: 'Global Load', value: requests.length, color: 'text-primary' }
              ].map((stat, i) => (
                <div key={i} className="std-card p-6 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">{stat.label}</p>
                   <h4 className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.value}</h4>
                </div>
              ))}
           </div>

           {/* Main Request Table */}
           <div className="std-card overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-primary border-b border-std">
                    <tr className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                       <th className="px-8 py-5">Incident Link</th>
                       <th className="px-8 py-5">Originating Client</th>
                       <th className="px-8 py-5">Symptom Log</th>
                       <th className="px-8 py-5">Operational Status</th>
                       <th className="px-8 py-5 text-right">Labor Estimate</th>
                       <th className="px-8 py-5 text-center">Manage</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-std bg-secondary">
                    {requests.map(req => {
                      const isFree = req.Cost === "0.00";
                      return (
                        <tr key={req.Request_ID} className="hover:bg-hover transition-colors">
                           <td className="px-8 py-6">
                              <span className="font-mono text-xs font-bold text-primary bg-primary px-3 py-1 rounded-lg border border-std">#INC-{req.Request_ID}</span>
                           </td>
                           <td className="px-8 py-6">
                              <p className="font-bold text-primary">{req.First_Name} {req.Last_Name}</p>
                              <p className="text-[10px] text-secondary font-bold tracking-tight mt-0.5">{req.Email}</p>
                           </td>
                           <td className="px-8 py-6 max-w-sm">
                              <p className="text-sm text-secondary truncate italic">"{req.Issue_Description}"</p>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                                req.TaskStatus === 'Completed' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800' : 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800'
                              }`}>
                                {req.TaskStatus || 'Unassigned'}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <span className={`font-black text-lg ${isFree ? 'text-green-500' : 'text-primary'} tracking-tight`}>
                                {isFree ? 'FREE' : req.Cost !== null ? `$${req.Cost}` : '--'}
                              </span>
                           </td>
                           <td className="px-8 py-6 text-center">
                              <button onClick={() => handleEdit(req)} className="w-10 h-10 rounded-xl bg-primary border-std border flex items-center justify-center hover:text-brand transition-all cursor-pointer outline-none mx-auto text-secondary hover:bg-hover">
                                 <Edit className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                      )
                    })}
                 </tbody>
              </table>
              {requests.length === 0 && (
                <div className="p-20 text-center text-secondary bg-primary border-t border-std uppercase tracking-widest font-bold">
                   All channels clear. No active records.
                </div>
              )}
           </div>
         </div>
      </main>

      {/* Edit Modal Overlay */}
      {editingRequest && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[60] animate-in fade-in transition-all" style={{backgroundColor: 'var(--modal-bg)'}}>
          <div className="std-card w-full max-w-lg overflow-hidden relative shadow-2xl">
            <div className="p-8 border-b border-std flex justify-between items-center bg-hover">
               <div>
                  <h3 className="text-2xl font-black tracking-tight text-primary">Resolve Engagement</h3>
                  <p className="text-[10px] font-bold text-brand uppercase tracking-widest mt-1">Ticket Reference: INC-{editingRequest.Request_ID}</p>
               </div>
               <button onClick={()=>setEditingRequest(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-primary hover:bg-hover font-bold text-xl cursor-pointer border-none outline-none pb-1 text-secondary">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block ml-1">Lifecycle Phase</label>
                    <select required value={editForm.status} onChange={e=>setEditForm({...editForm, status: e.target.value})} className="w-full std-input text-sm font-bold appearance-none cursor-pointer p-4">
                       <option value="Pending">Queue: Dispatch</option>
                       <option value="Assigned">Status: Assigned</option>
                       <option value="In Progress">Active: Repairing</option>
                       <option value="Completed">Resolved: Complete</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 block ml-1">Assessed Value ($)</label>
                    <input type="number" step="0.01" value={editForm.cost} onChange={e=>setEditForm({...editForm, cost: e.target.value})} className="w-full std-input text-sm font-bold font-mono p-4" placeholder="E.g., 50.00" disabled={editingRequest.Cost === "0.00"} />
                  </div>
               </div>
               
               {editingRequest.Cost === "0.00" && (
                  <div className="bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-900/50 p-4 rounded-xl text-center">
                    <p className="text-xs font-bold text-green-700 dark:text-green-400 tracking-widest uppercase flex items-center justify-center gap-2">
                       <ShieldAlert className="w-4 h-4" /> This service is covered by active warranty. Cost must remain $0.
                    </p>
                  </div>
               )}

               <div className="flex gap-4 pt-4 border-t border-std">
                  <button type="button" onClick={()=>setEditingRequest(null)} className="flex-1 py-4 bg-primary text-secondary border border-std hover:bg-hover rounded-xl font-bold uppercase tracking-widest text-[10px] cursor-pointer transition-colors">Abort Phase</button>
                  <button type="submit" className="flex-1 py-4 std-btn hover:text-white uppercase tracking-widest text-[10px] cursor-pointer">Commit Phase Data</button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
