import { useState, useEffect } from 'react';
import { CreditCard, ShieldCheck, Zap, Info, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../config';

const Payment = () => {
   const [bills, setBills] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   const user = JSON.parse(localStorage.getItem('userData') || '{}');
   const customerId = user.Customer_ID;

   const fetchBills = async () => {
      if (!customerId) return;
      try {
         const response = await fetch(`${API_URL}/service-status?customerId=${customerId}`);
         const data = await response.json();
         if (data.success) {
            // Filter for services that have a cost (not 0) and are not fully settled yet (in a real app we'd check Payment table)
            // Here we just show billable items
            const billable = data.requests.filter(r => r.Cost !== null && parseFloat(r.Cost) > 0);
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
      const tId = toast.loading('Processing payment...');
      try {
         const response = await fetch(`${API_URL}/payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               serviceId,
               amount,
               paymentMode: 'Online'
            })
         });
         const data = await response.json();

         if (data.success) {
            toast.success('Payment successful. Thank you!', { id: tId });
            fetchBills();
         } else {
            toast.error(data.message || 'Payment failed', { id: tId });
         }
      } catch (err) {
         toast.error('Connection failed.', { id: tId });
      }
   };

   return (
      <div className="max-w-5xl mx-auto space-y-12 font-sans transition-colors duration-300">
         {/* Header */}
         <div className="relative">
            <div className="space-y-1">
               <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">Payments.</h2>
               <p className="text-lg text-text-secondary font-medium opacity-80">Manage and settle service costs for your products.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
               {/* Active Invoices */}
               <div className="bg-bg-secondary p-10 border border-border-color rounded-[2.5rem] shadow-sm">
                  <h4 className="text-xl font-bold tracking-tight text-text-primary mb-10 flex items-center gap-3 italic serif-heading">
                     <CreditCard className="w-5 h-5" /> Outstanding Bills
                  </h4>

                  <div className="space-y-6">
                     {isLoading ? (
                        <div className="py-10 text-center animate-pulse text-text-secondary">Loading bills...</div>
                     ) : bills.length === 0 ? (
                        <div className="py-20 text-center text-text-secondary italic bg-bg-primary/50 rounded-3xl border border-dashed border-border-color">
                           <Zap className="w-12 h-12 mx-auto mb-4 opacity-10" />
                           No outstanding payments detected.
                        </div>
                     ) : bills.map((bill) => (
                        <div key={bill.RecordId} className="p-8 bg-bg-primary rounded-[2rem] border border-border-color flex flex-col md:flex-row justify-between items-center gap-6 group transition-all hover:shadow-md">
                           <div className="flex gap-6 items-center">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border border-border-color ${bill.Payment_Status === 'Paid' ? 'bg-brand text-bg-primary' : 'bg-bg-secondary text-text-secondary'}`}>
                                 {bill.Payment_Status === 'Paid' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                              </div>
                              <div>
                                 <div className="text-[15px] font-bold text-text-primary">{bill.Product_Name} Service</div>
                                 <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40 mt-1">Ref: SR-{bill.Request_ID} <span className="mx-2">•</span> {new Date(bill.Request_Date).toLocaleDateString()}</div>
                              </div>
                           </div>
                           <div className="text-center md:text-right flex flex-col items-center md:items-end gap-3">
                              <div className="text-2xl font-black text-text-primary tracking-tighter">${bill.Cost}</div>
                              {bill.Payment_Status !== 'Paid' ? (
                                 <button onClick={() => handlePay(bill.RecordId, bill.Cost)} className="primary-button text-[10px] uppercase font-bold tracking-widest px-8 py-3">Pay Now</button>
                              ) : (
                                 <span className="badge badge-completed text-[10px] tracking-[.2em] font-black">Settled</span>
                              )}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Payment Methods */}
               <div className="bg-bg-secondary p-10 border border-border-color rounded-[2.5rem]">
                  <h4 className="text-xl font-bold tracking-tight text-text-primary mb-10 italic serif-heading">Saved Methods</h4>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="p-8 rounded-[2rem] border border-brand bg-bg-primary flex flex-col items-center">
                        <ShieldCheck className="w-8 h-8 text-brand mb-4" />
                        <div className="text-[13px] font-bold text-text-primary uppercase tracking-widest">Ending in 7721</div>
                        <div className="text-[10px] font-bold text-text-secondary mt-1 tracking-widest opacity-40">Primary Credit Card</div>
                     </div>
                     <div className="p-8 rounded-[2rem] border border-border-color bg-bg-primary/40 flex flex-col items-center opacity-60 hover:opacity-100 transition-all cursor-pointer">
                        <DollarSign className="w-8 h-8 text-text-secondary mb-4 opacity-40" />
                        <div className="text-[13px] font-bold text-text-secondary uppercase tracking-widest">Digital Wallet</div>
                        <div className="text-[10px] font-bold text-text-secondary mt-1 tracking-widest opacity-40">Global Funds</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
               <div className="p-10 bg-brand text-bg-primary rounded-[2.5rem] relative overflow-hidden group">
                  <Zap className="w-8 h-8 text-bg-primary mb-6" />
                  <h4 className="text-2xl font-bold tracking-tight mb-4 italic uppercase serif-heading">Verified <br />Transactions.</h4>
                  <p className="opacity-60 text-xs font-medium leading-relaxed italic mb-8">All financial transactions are end-to-end encrypted for your security.</p>
               </div>

               <div className="p-10 bg-bg-secondary border border-border-color rounded-[2.5rem]">
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-bg-primary border border-border-color flex items-center justify-center text-text-primary">
                        <Info className="w-5 h-5 opacity-30" />
                     </div>
                     <div className="text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Payment Notice</div>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-relaxed font-medium">Service reports are finalized only after payment is verified by the central hub.</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Payment;
