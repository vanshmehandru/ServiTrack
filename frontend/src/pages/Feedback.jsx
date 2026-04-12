import { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, ShieldCheck, Zap, Info, ArrowRight, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';

const Feedback = () => {
  const [completedServices, setCompletedServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  const fetchCompleted = async () => {
    if (!customerId) return;
    try {
      const response = await fetch(`http://localhost:5000/service-status?customerId=${customerId}`);
      const data = await response.json();
      if (data.success) {
        // Filter for completed services that don't have feedback yet
        const completed = data.requests.filter(r => r.Status === 'Completed' && !r.Feedback_Rating);
        setCompletedServices(completed);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompleted();
  }, [customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) return toast.error('Please select an intervention node');
    if (rating === 0) return toast.error('Please select an authority rating node');
    
    setIsSubmitting(true);
    const tId = toast.loading('Synchronizing feedback with central hub...');
    try {
      const response = await fetch('http://localhost:5000/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          rating,
          comments: comment
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Experience telemetry logged successfully', { id: tId });
        setRating(0);
        setComment('');
        setSelectedServiceId('');
        fetchCompleted();
      } else {
        toast.error(data.message || 'Sync failed', { id: tId });
      }
    } catch (err) {
      toast.error('Connection failed', { id: tId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 font-sans">
      {/* Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-black italic serif-heading">Experience Telemetry.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">Log your qualitative assessment of the service protocol fulfillment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 border border-border-color rounded-[2.5rem] shadow-sm">
              <h4 className="text-xl font-bold tracking-tight text-black mb-12 flex items-center gap-3 italic serif-heading">
                 <Star className="w-5 h-5" /> Satisfaction Rating
              </h4>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Select Intervention Node</label>
                    <div className="relative group">
                       <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
                       <select 
                         required 
                         className="premium-input w-full pl-11 py-3.5 text-[14px] font-bold appearance-none bg-bg-secondary"
                         value={selectedServiceId}
                         onChange={e => setSelectedServiceId(e.target.value)}
                       >
                          <option value="">Choose Completed Service</option>
                          {completedServices.map(s => (
                            <option key={s.RecordId} value={s.RecordId}>{s.Product_Name} (Ref: SR-{s.Request_ID})</option>
                          ))}
                       </select>
                    </div>
                </div>

                <div className="flex justify-center gap-6 py-6 border-y border-border-color">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <button
                       key={star}
                       type="button"
                       className="bg-transparent border-none p-0 cursor-pointer transition-all hover:scale-125"
                       onClick={() => setRating(star)}
                     >
                       <Star 
                          className={`w-12 h-12 transition-all ${
                            star <= rating 
                              ? 'fill-black text-black' 
                              : 'text-text-secondary opacity-20'
                          }`} 
                       />
                     </button>
                   ))}
                </div>
                
                <div className="space-y-6">
                   <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1 opacity-60 italic">Operational Narrative (Comment)</label>
                   <div className="relative group">
                      <MessageSquare className="absolute left-4 top-6 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
                      <textarea 
                        placeholder="Describe the efficiency and precision of the intervention..." 
                        className="premium-input w-full pl-11 py-5 text-[14px] min-h-[160px] leading-relaxed resize-none font-medium italic bg-bg-secondary"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                      />
                   </div>
                </div>

                <div className="pt-10 border-t border-border-color">
                   <button 
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="primary-button w-full py-5 text-[13px] font-bold uppercase tracking-widest"
                   >
                      {isSubmitting ? 'Syncing...' : <>Submit Feedback Loop <Send className="w-4 h-4" /></>}
                   </button>
                </div>
              </form>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <div className="p-10 bg-black text-white rounded-[2.5rem] relative overflow-hidden group">
              <ShieldCheck className="w-8 h-8 text-white mb-6" />
              <h4 className="text-2xl font-bold tracking-tight mb-4 italic uppercase serif-heading">Quality <br/>Control.</h4>
              <p className="opacity-60 text-xs font-medium leading-relaxed italic mb-10">Your telemetry helps optimize the autonomous dispatch nodes for all global users.</p>
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-80 italic">Ref: QC-PROTOCOL-9</div>
           </div>

           <div className="p-10 bg-bg-secondary border border-border-color rounded-[2.5rem] italic">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-white border border-border-color flex items-center justify-center text-black opacity-30">
                    <Info className="w-5 h-5" />
                 </div>
                 <div className="text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-60">Verified Origin</div>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed font-medium">Feedback is permanently anchored to the protocol node for transparency.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
