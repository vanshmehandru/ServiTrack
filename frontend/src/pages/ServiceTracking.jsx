import { useState, useEffect } from 'react';
import { 
  Wrench, CheckCircle2, 
  Activity, Clock, User, ShieldCheck, 
  Search, Filter, ChevronRight 
} from 'lucide-react';

const ServiceTracking = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  useEffect(() => {
    const fetchTracking = async () => {
      if (!customerId) return;
      try {
        const response = await fetch(`http://localhost:5000/service-status?customerId=${customerId}`);
        const data = await response.json();
        if (data.success) {
          setRequests(data.requests);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTracking();
  }, [customerId]);

  const getProgress = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 15;
      case 'in progress': return 65;
      case 'completed': return 100;
      default: return 5;
    }
  };

  return (
    <div className="space-y-12 font-sans">
      {/* Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">Service Tracking.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">Monitor the progress of your active and past service requests.</p>
        </div>
      </div>

      {/* Tracking Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Active Requests', val: requests.filter(r => r.Status !== 'Completed').length, icon: Activity },
           { label: 'On-Time Fulfillment', val: '99.8%', icon: ShieldCheck },
           { label: 'Average Response', val: '38m', icon: Clock },
         ].map((m, i) => (
           <div key={i} className="bg-bg-secondary p-10 rounded-[2.5rem] border border-border-color flex items-center justify-between group transition-colors">
              <div className="relative z-10">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary opacity-60 mb-2">{m.label}</div>
                 <div className="text-4xl font-bold text-text-primary tracking-tighter">{m.val}</div>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-bg-primary border border-border-color flex items-center justify-center text-text-primary opacity-40 group-hover:scale-110 group-hover:opacity-100 transition-all">
                 <m.icon className="w-7 h-7" />
              </div>
           </div>
         ))}
      </div>

      {/* Protocol Dashboard */}
      <div className="bg-bg-primary rounded-[2.5rem] border border-border-color shadow-sm overflow-hidden transition-colors">
         <div className="p-8 border-b border-border-color flex flex-col md:flex-row justify-between items-center gap-6 bg-bg-secondary/30">
            <div className="relative flex-1 max-w-md group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
               <input placeholder="Filter by Request ID or Product..." className="w-full bg-bg-primary border border-border-color rounded-xl pl-11 pr-4 py-3 text-[13px] font-bold focus:ring-1 focus:ring-brand outline-none text-text-primary" />
            </div>
            <button className="secondary-button px-8 py-3 text-[11px] font-bold uppercase tracking-widest">
               <Filter className="w-4 h-4 opacity-50" /> Filter
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-border-color bg-bg-secondary/50">
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Request ID</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Product</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Progress</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Technician</th>
                     <th className="px-10 py-6 text-right text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-color">
                  {isLoading ? (
                     <tr><td colSpan="5" className="px-10 py-20 text-center animate-pulse text-text-secondary">Loading tracking data...</td></tr>
                  ) : requests.length === 0 ? (
                     <tr><td colSpan="5" className="px-10 py-20 text-center text-text-secondary font-medium">No active service requests found.</td></tr>
                  ) : requests.map((r) => (
                     <tr key={r.Request_ID} className="group hover:bg-bg-secondary transition-all duration-300">
                        <td className="px-10 py-8">
                           <div className="font-mono text-[14px] font-black text-text-primary tracking-tighter italic uppercase">REQ-{r.Request_ID}</div>
                           <div className="text-[9px] font-bold text-text-secondary uppercase tracking-widest opacity-40 mt-1">{new Date(r.Request_Date).toLocaleDateString()}</div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="text-[14px] font-bold text-text-primary tracking-tight">{r.Product_Name}</div>
                           <div className="text-[10px] font-bold text-text-secondary opacity-40 italic">{r.Model_Number}</div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="space-y-3">
                              <div className="flex justify-between items-center w-48">
                                 <span className={`text-[10px] font-bold uppercase tracking-widest ${r.Status === 'Completed' ? 'text-text-primary' : 'text-text-secondary'}`}>{r.Status}</span>
                                 <span className="text-[10px] font-bold text-text-primary opacity-40 font-mono">{getProgress(r.Status)}%</span>
                              </div>
                              <div className="w-48 h-1 bg-bg-secondary rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full transition-all duration-1000 ${r.Status === 'Completed' ? 'bg-brand' : 'bg-brand/40'}`} 
                                    style={{ width: `${getProgress(r.Status)}%` }}
                                 ></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-bg-secondary border border-border-color flex items-center justify-center text-text-primary border-none group-hover:scale-110">
                                 <User className="w-4 h-4 opacity-50" />
                              </div>
                              <div className="text-[13px] font-bold text-text-primary">{r.Technician_Name || 'Awaiting Assignment'}</div>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="p-2.5 rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary border-none transition-all cursor-pointer group-hover:translate-x-1">
                              <ChevronRight className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Support Note */}
      <div className="bg-bg-secondary border border-border-color border-dashed rounded-[2.5rem] p-12 flex flex-col items-center text-center transition-colors">
         <Wrench className="w-10 h-10 text-text-primary mb-6 opacity-20" />
         <h4 className="text-xl font-bold tracking-tight text-text-primary mb-3 italic serif-heading">Support Dispatch</h4>
         <p className="max-w-2xl text-sm text-text-secondary leading-relaxed font-medium italic opacity-70">
            Our service requests are automatically routed to the nearest available specialist to ensure the fastest possible resolution.
         </p>
      </div>
    </div>
  );
};

export default ServiceTracking;
