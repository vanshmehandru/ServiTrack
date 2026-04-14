import { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, Search, Filter, 
  ChevronRight, ArrowRight, CheckCircle2, 
  ShieldCheck, Zap, Download 
} from 'lucide-react';

const History = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  useEffect(() => {
    const fetchHistory = async () => {
      if (!customerId) return;
      try {
        const response = await fetch(`http://localhost:5000/service-status?customerId=${customerId}`);
        const data = await response.json();
        if (data.success) {
          setRecords(data.requests);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [customerId]);

  return (
    <div className="space-y-12 font-sans">
      {/* Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">Service History.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">Complete history of your product service requests and status updates.</p>
        </div>
      </div>

      {/* History Controls */}
      <div className="flex flex-col md:flex-row gap-6 mt-12 bg-bg-secondary p-5 rounded-[2rem] border border-border-color shadow-sm transition-colors">
         <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
            <input placeholder="Search history by request ID or product..." className="w-full bg-bg-primary border border-border-color rounded-xl pl-11 pr-4 py-3 text-[13px] font-bold focus:ring-1 focus:ring-brand outline-none text-text-primary" />
         </div>
         <div className="flex gap-4">
            <button className="secondary-button px-8 py-3 text-[11px] font-bold uppercase tracking-widest">
               <Filter className="w-4 h-4 opacity-50" /> Filter
            </button>
            <button className="secondary-button px-8 py-3 text-[11px] font-bold uppercase tracking-widest">
               <Download className="w-4 h-4 opacity-50" /> Export
            </button>
         </div>
      </div>

      {/* History Registry */}
      <div className="bg-bg-primary rounded-[2rem] overflow-hidden border border-border-color shadow-sm transition-colors">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-border-color bg-bg-secondary/50">
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">ID</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Product</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Request Date</th>
                     <th className="px-10 py-6 text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Status</th>
                     <th className="px-10 py-6 text-right text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-color">
                  {isLoading ? (
                    <tr><td colSpan="5" className="px-10 py-20 text-center animate-pulse text-text-secondary">Loading your history...</td></tr>
                  ) : records.length === 0 ? (
                    <tr><td colSpan="5" className="px-10 py-20 text-center text-text-secondary">No service history found.</td></tr>
                  ) : records.map((r) => (
                     <tr key={r.Request_ID} className="group hover:bg-bg-secondary transition-all duration-300">
                        <td className="px-10 py-8">
                           <div className="font-mono text-[14px] font-black text-text-primary tracking-tighter italic uppercase">REQ-{r.Request_ID}</div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="text-[14px] font-bold text-text-primary tracking-tight italic">{r.Product_Name}</div>
                        </td>
                        <td className="px-10 py-8 text-[13px] font-bold text-text-secondary opacity-80">{new Date(r.Request_Date).toLocaleDateString()}</td>
                        <td className="px-10 py-8">
                            <span className={`badge ${r.Status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>
                                {r.Status}
                            </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <button className="text-[11px] font-bold uppercase text-brand hover:underline underline-offset-4 bg-transparent border-none cursor-pointer group-hover:translate-x-1 transition-transform">
                               View Details →
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Security Note */}
      <div className="bg-brand text-bg-primary rounded-[3rem] p-16 flex flex-col md:flex-row justify-between items-center shadow-2xl relative overflow-hidden group transition-colors">
         <div className="z-10 text-center md:text-left mb-10 md:mb-0 max-w-xl">
            <h4 className="text-4xl font-bold tracking-tight mb-4 italic uppercase serif-heading">Service Integrity.</h4>
            <p className="opacity-70 text-lg font-medium leading-relaxed italic">All service records are securely logged and verified to ensure accurate warranty tracking and support history.</p>
         </div>
         <div className="z-10 bg-bg-primary/10 border border-bg-primary/20 p-10 rounded-[2rem] flex flex-col items-center">
            <ShieldCheck className="w-10 h-10 text-bg-primary mb-4 scale-100 group-hover:scale-110 transition-transform" />
            <div className="text-[10px] font-bold uppercase tracking-[.3em] opacity-40 mb-2 italic">Secure Registry</div>
            <div className="text-2xl font-black italic serif-heading uppercase">VERIFIED</div>
         </div>
      </div>
    </div>
  );
};

export default History;
