import { useState, useEffect } from 'react';
import { 
  Box, Activity, ShieldCheck, ArrowUpRight, 
  ArrowDownRight, Zap, Target, Search, Clock
} from 'lucide-react';

const Overview = () => {
  const [productList, setProductList] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return;
      try {
        const [prodRes, servRes] = await Promise.all([
          fetch(`http://localhost:5000/products?customerId=${customerId}`),
          fetch(`http://localhost:5000/service-status?customerId=${customerId}`)
        ]);
        
        const [prodData, servData] = await Promise.all([
          prodRes.json(),
          servRes.json()
        ]);

        if (prodData.success) setProductList(prodData.products);
        if (servData.success) setServiceRequests(servData.requests);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [customerId]);

  const stats = [
    { label: 'Total Products', val: productList.length, icon: Box },
    { label: 'Active Requests', val: serviceRequests.filter(r => r.Status !== 'Completed').length, icon: Activity },
    { label: 'Completed Services', val: serviceRequests.filter(r => r.Status === 'Completed').length, icon: ShieldCheck },
  ];

  const recentActivity = serviceRequests.slice(0, 4).map(r => ({
    id: r.Request_ID,
    type: 'Service',
    asset: r.Product_Name,
    protocol: `SR-${r.Request_ID}`,
    status: r.Status,
    time: new Date(r.Request_Date).toLocaleDateString()
  }));

  return (
    <div className="space-y-12 font-sans">
      {/* Welcome Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">System Monitor.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">Infrastructure status: <span className="text-emerald-500 font-bold">Operational</span>. Node health at 99.9%.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-bg-secondary p-10 group relative overflow-hidden border border-border-color rounded-[2.5rem] transition-all hover:bg-bg-primary hover:shadow-sm">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <stat.icon className="w-24 h-24 text-text-primary" />
             </div>
             <div className="flex justify-between items-start mb-10">
                <div className="bg-black p-3 rounded-2xl">
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-border-color">
                  <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                  +Synced
                </div>
             </div>
             <div className="text-6xl font-bold tracking-tighter text-text-primary leading-none mb-3 italic">{stat.val}</div>
             <div className="text-[11px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Activity & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Activity Feed */}
        <div className="lg:col-span-3 bg-bg-primary p-10 border border-border-color rounded-[2.5rem] shadow-sm">
           <div className="flex justify-between items-center mb-10 text-center md:text-left">
              <div>
                <h4 className="text-xl font-bold tracking-tight text-text-primary italic serif-heading">Real-Time Registry</h4>
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Live satellite telemetry from field units</p>
              </div>
              <button className="secondary-button text-[10px] font-bold uppercase tracking-widest px-6 py-3">Archive Access</button>
           </div>
           
           <div className="space-y-10">
              {recentActivity.length === 0 ? (
                <div className="text-center py-10 text-text-secondary font-medium italic opacity-60">Registry stream is currently silent.</div>
              ) : recentActivity.map((act) => (
                <div key={act.id} className="flex gap-6 group hover:translate-x-2 transition-all duration-300">
                   <div className="w-14 h-14 rounded-2xl bg-bg-secondary border border-border-color flex items-center justify-center shrink-0 transition-all">
                      <Box className="w-6 h-6 text-text-primary opacity-20 group-hover:opacity-100" />
                   </div>
                   <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <h5 className="text-[15px] font-bold text-text-primary tracking-tight italic">{act.asset}</h5>
                        <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest opacity-40 font-mono">{act.time}</span>
                      </div>
                      <p className="text-[12px] font-medium text-text-secondary mt-1.5 opacity-80 leading-none">
                        Protocol <span className="text-text-primary font-mono font-bold">#{act.protocol}</span> status: <span className={`font-bold tracking-widest uppercase ${act.status === 'Completed' ? 'text-text-primary' : 'text-text-secondary'}`}>{act.status}</span>.
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Health Matrix */}
        <div className="lg:col-span-2 bg-bg-secondary p-10 border border-border-color rounded-[2.5rem] flex flex-col items-center">
           <div className="w-full mb-10">
             <h4 className="text-xl font-bold tracking-tight text-text-primary italic serif-heading">Health Matrix</h4>
             <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">System availability vs uptime targets</p>
           </div>
           
           <div className="relative w-56 h-56 mb-12">
              <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="42" fill="transparent" stroke="#000" strokeOpacity="0.05" strokeWidth="8" />
                 <circle 
                    cx="50" cy="50" r="42" fill="transparent" 
                    stroke="#000" strokeWidth="6" 
                    strokeDasharray="263.8" 
                    strokeDashoffset={263.8 - (263.8 * 0.94)} 
                    strokeLinecap="round" 
                 />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-in">
                 <span className="text-5xl font-bold text-text-primary tracking-tighter leading-none italic italic serif-heading">94<span className="text-2xl text-text-secondary">.2%</span></span>
                 <span className="text-[10px] uppercase font-bold text-text-primary tracking-[0.2em] mt-3">ENFORCED</span>
              </div>
           </div>

           <div className="w-full space-y-4">
              {[
                { label: 'Network Stability', val: '99.9%', color: 'bg-black' },
                { label: 'Latency Node', val: '0.2ms', color: 'bg-black/40' },
                { label: 'Precision Score', val: '100%', color: 'bg-black' }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-4 bg-white rounded-2xl border border-border-color">
                   <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                      <span className="text-[11px] font-bold uppercase text-text-secondary tracking-widest">{item.label}</span>
                   </div>
                   <span className="text-[11px] font-bold text-text-primary font-mono">{item.val}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-black rounded-[3rem] p-16 flex flex-col md:flex-row justify-between items-center text-white shadow-2xl relative overflow-hidden group">
         <div className="z-10 text-center md:text-left mb-10 md:mb-0 max-w-xl">
            <h4 className="text-4xl font-bold tracking-tight mb-4 italic uppercase serif-heading">Scale your enterprise <br/>coverage with DNA.</h4>
            <p className="opacity-70 text-lg font-medium leading-relaxed italic">Activate our API architecture to handle massive inventory distribution across continental zones.</p>
         </div>
         <button className="z-10 bg-white text-black px-10 py-5 rounded-[2rem] font-bold text-xs uppercase tracking-[.2em] hover:scale-105 transition-all border-none cursor-pointer">
            Initialize API Node
         </button>
      </div>
    </div>
  );
};

export default Overview;
