import { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, ArrowRight, Zap, Info, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Payment = () => {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  const fetchBills = async () => {
    if (!customerId) return;
    try {
      const response = await fetch(`http://localhost:5000/service-status?customerId=${customerId}`);
      const data = await response.json();
      if (data.success) {
        // Filter for services that have a cost and need payment check
        const billable = data.requests.filter(r => r.Cost > 0);
        setBills(billable);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, [customerId]);

  const handlePay = async (serviceId, amount) => {
    const tId = toast.loading('Synchronizing secure payment node...');
    try {
      const response = await fetch('http://localhost:5000/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          amount,
          paymentMode: 'Enterprise Digital'
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Funds verified. Transaction complete.', { id: tId });
        fetchBills();
      } else {
        toast.error(data.message || 'Verification failed', { id: tId });
      }
    } catch (err) {
      toast.error('Connection to billing node failed.', { id: tId });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-sans">
      {/* Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-black italic serif-heading">Financial Settlement.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">Finalize service costs through our encrypted billing architecture.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           {/* Active Invoices */}
           <div className="bg-white p-10 border border-border-color rounded-[2.5rem] shadow-sm">
              <h4 className="text-xl font-bold tracking-tight text-black mb-10 flex items-center gap-3 italic serif-heading">
                 <CreditCard className="w-5 h-5" /> Billing Registry
              </h4>

              <div className="space-y-6">
                 {isLoading ? (
                   <div className="py-10 text-center animate-pulse">Initializing billing stream...</div>
                 ) : bills.length === 0 ? (
                   <div className="py-10 text-center text-text-secondary italic">No outstanding liabilities detected.</div>
                 ) : bills.map((bill) => (
                    <div key={bill.RecordId} className="p-8 bg-bg-secondary/40 rounded-[2rem] border border-border-color flex flex-col md:flex-row justify-between items-center gap-6 group hover:bg-white transition-all">
                       <div className="flex gap-6 items-center">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-border-color ${bill.Payment_Status === 'Completed' ? 'bg-white text-black' : 'bg-white text-black opacity-30'}`}>
                             {bill.Payment_Status === 'Completed' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                          </div>
                          <div>
                             <div className="text-[15px] font-bold text-black italic serif-heading">{bill.Product_Name} Service</div>
                             <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40 mt-1 italic">Ref: SR-{bill.Request_ID} <span className="mx-2">•</span> {new Date(bill.Request_Date).toLocaleDateString()}</div>
                          </div>
                       </div>
                       <div className="text-center md:text-right flex flex-col items-center md:items-end gap-3">
                          <div className="text-2xl font-black text-black tracking-tighter italic serif-heading">${bill.Cost}</div>
                          {bill.Payment_Status !== 'Completed' ? (
                             <button onClick={() => handlePay(bill.RecordId, bill.Cost)} className="primary-button text-[10px] uppercase font-bold tracking-widest px-8 py-3">Pay Now</button>
                          ) : (
                             <span className="badge badge-completed text-[10px] tracking-[.2em] font-black italic">Settled</span>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Payment Methods */}
           <div className="bg-bg-secondary p-10 border border-border-color rounded-[2.5rem]">
              <h4 className="text-xl font-bold tracking-tight text-black mb-10 italic serif-heading">Secure Node Vectors</h4>
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-8 rounded-[2rem] border border-black bg-white flex flex-col items-center">
                    <ShieldCheck className="w-8 h-8 text-black mb-4" />
                    <div className="text-[13px] font-bold text-black uppercase tracking-widest italic">Enterprise Card</div>
                    <div className="text-[10px] font-bold text-text-secondary mt-1 tracking-widest opacity-40 italic">•••• 7721</div>
                 </div>
                 <div className="p-8 rounded-[2rem] border border-border-color bg-white/40 flex flex-col items-center opacity-60 hover:opacity-100 transition-all cursor-pointer">
                    <DollarSign className="w-8 h-8 text-black mb-4 opacity-40" />
                    <div className="text-[13px] font-bold text-black uppercase tracking-widest italic">Digital Funds</div>
                    <div className="text-[10px] font-bold text-text-secondary mt-1 tracking-widest opacity-40 italic">Global Wallet</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <div className="p-10 bg-black text-white rounded-[2.5rem] relative overflow-hidden group">
              <Zap className="w-8 h-8 text-white mb-6" />
              <h4 className="text-2xl font-bold tracking-tight mb-4 italic uppercase serif-heading">Verified <br/>Transactions.</h4>
              <p className="opacity-60 text-xs font-medium leading-relaxed italic mb-8">All financial telemetry is end-to-end encrypted through our proprietary architecture.</p>
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">Layer 3 Encrypted</div>
           </div>

           <div className="p-10 bg-bg-secondary border border-border-color rounded-[2.5rem] italic">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-white border border-border-color flex items-center justify-center text-black opacity-30">
                    <Info className="w-5 h-5" />
                 </div>
                 <div className="text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Fulfillment Note</div>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed font-medium">Service reports are finalized only after fund synchronization is verified by the central hub.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
