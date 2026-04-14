import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, Zap, Info, CheckCircle2, AlertCircle } from 'lucide-react';

const Warranty = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  useEffect(() => {
    const fetchWarranties = async () => {
      if (!customerId) return;
      try {
        const response = await fetch(`http://localhost:5000/products?customerId=${customerId}`);
        const data = await response.json();
        if (data.success) {
          setProductList(data.products);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarranties();
  }, [customerId]);

  return (
    <div className="space-y-12 font-sans">
      {/* Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">Warranty Portfolio.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">List of verified product warranties and coverage details.</p>
        </div>
      </div>

      {/* Coverage Status Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
         {isLoading ? (
           <div className="col-span-full py-20 text-center animate-pulse">Checking coverage status...</div>
         ) : productList.length === 0 ? (
           <div className="col-span-full py-20 text-center text-text-secondary italic">No product warranties found in your account.</div>
         ) : productList.map((p) => (
           <div key={p.Product_ID} className="bg-bg-secondary p-10 relative group overflow-hidden border border-border-color rounded-[2.5rem] transition-all hover:bg-bg-primary hover:shadow-sm">
              <div className={`absolute top-0 left-0 w-1.5 h-full ${p.IsUnderWarranty ? 'bg-brand' : 'bg-brand/20'}`}></div>
              <div className="flex justify-between items-start mb-8">
                 <div className="bg-brand p-3 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-bg-primary" />
                 </div>
                 <span className={`badge ${p.IsUnderWarranty ? 'badge-completed' : 'badge-pending'}`}>
                    {p.IsUnderWarranty ? 'Active' : 'Expired'}
                 </span>
              </div>
              
              <div className="space-y-2 mb-10">
                 <h4 className="text-[10px] font-bold uppercase tracking-[.3em] text-text-secondary opacity-60">Product Details</h4>
                 <div className="text-2xl font-bold text-text-primary tracking-tight leading-none italic serif-heading">{p.Product_Name}</div>
              </div>

              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-text-primary opacity-30" />
                    <div>
                        <div className="text-[11px] font-bold text-text-primary">{new Date(p.End_Date).toLocaleDateString()}</div>
                        <div className="text-[8px] font-bold uppercase tracking-widest text-text-secondary opacity-60">Warranty Expiration</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 pt-4 border-t border-border-color">
                    <Zap className="w-4 h-4 opacity-60 text-text-primary" />
                    <div>
                        <div className="text-[11px] font-bold text-text-primary uppercase tracking-widest italic">{p.Warranty_Type || 'Standard Retail'}</div>
                        <div className="text-[8px] font-bold uppercase tracking-widest text-text-secondary opacity-60">Coverage Grade</div>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Detailed Coverage Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
         <div className="lg:col-span-2 bg-bg-primary p-10 border border-border-color rounded-[2.5rem] shadow-sm">
            <h4 className="text-xl font-bold tracking-tight text-text-primary mb-10 flex items-center gap-3 italic serif-heading">
               <Info className="w-5 h-5" /> Coverage Details
            </h4>
            
            <div className="space-y-2 border border-border-color rounded-2xl overflow-hidden bg-bg-primary">
               {[
                 { rule: 'Accidental Damage Protection', covered: true, note: 'Includes 2 events per year' },
                 { rule: 'Priority Support Response', covered: true, note: 'Response within 4 hours' },
                 { rule: 'Hardware Replacement', covered: true, note: 'Express shipping included' },
                 { rule: 'Extended Software Support', covered: false, note: 'Requires Enterprise Plan' },
                 { rule: 'On-site Repair Service', covered: true, note: 'Available in major hubs' },
               ].map((item, i) => (
                 <div key={i} className={`flex items-center justify-between p-6 transition-all ${i % 2 === 0 ? 'bg-bg-secondary/40' : 'bg-transparent'}`}>
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-border-color ${item.covered ? 'bg-bg-primary text-text-primary' : 'bg-bg-primary text-text-primary opacity-30'}`}>
                          {item.covered ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                       </div>
                       <div>
                          <div className="text-[14px] font-bold text-text-primary">{item.rule}</div>
                          <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">{item.note}</div>
                       </div>
                    </div>
                    <div className={`badge ${item.covered ? 'badge-completed' : 'badge-pending opacity-40'}`}>
                       {item.covered ? 'Covered' : 'Excluded'}
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-1 space-y-8">
            <div className="bg-brand p-10 text-bg-primary rounded-[2.5rem] shadow-xl relative group overflow-hidden">
               <h4 className="text-2xl font-bold tracking-tight mb-4 italic uppercase serif-heading">Elevate your <br/>protection.</h4>
               <p className="text-bg-primary/70 text-sm font-medium leading-relaxed mb-10 italic">Upgrade to Enterprise Ultra for accidental coverage and instant on-site technician deployment across all global hubs.</p>
               <button 
                 onClick={() => navigate('/warranty-plans')}
                 className="w-full bg-bg-primary text-brand py-5 rounded-[2rem] font-bold text-[11px] uppercase tracking-widest hover:scale-[1.02] transition-all border-none cursor-pointer shadow-lg"
               >
                  Upgrade Plan
               </button>
            </div>

            <div className="bg-bg-secondary p-10 border border-border-color rounded-[2.5rem]">
               <h5 className="text-[12px] font-bold uppercase tracking-widest text-text-secondary opacity-60 mb-8 italic">Verification Hub</h5>
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-bg-primary border border-border-color flex items-center justify-center text-text-primary mb-4">
                     <ShieldCheck className="w-8 h-8 opacity-40" />
                  </div>
                  <div className="text-[13px] font-bold text-text-primary italic serif-heading">Authenticated Sync</div>
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40">SEC-9921</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Warranty;

