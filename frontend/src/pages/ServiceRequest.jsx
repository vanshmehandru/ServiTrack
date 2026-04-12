import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Box, AlertCircle, Calendar, 
  MapPin, Wrench, ArrowRight, ShieldCheck, 
  Zap, Info 
} from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceRequest = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    issue: '',
    urgency: 'Standard',
    location: 'Home / Remote'
  });

  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!customerId) return;
      try {
        const response = await fetch(`http://localhost:5000/products?customerId=${customerId}`);
        const data = await response.json();
        if (data.success) {
          setProductList(data.products);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchProducts();
  }, [customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) return;

    const tId = toast.loading('Initializing service protocol node...');
    try {
      const response = await fetch('http://localhost:5000/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          productId: formData.productId,
          issueDescription: formData.issue
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Protocol SR-INIT-01 synchronized', { id: tId });
        navigate('/tracking');
      } else {
        toast.error(data.message || 'Protocol failure', { id: tId });
      }
    } catch (err) {
      toast.error('Connection to central hub failed.', { id: tId });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 font-sans">
      {/* Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">Service Initiator.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">Declare a technical failure to trigger maintenance protocols.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 border border-border-color rounded-[2.5rem] shadow-sm">
              <h4 className="text-xl font-bold tracking-tight text-text-primary mb-10 flex items-center gap-3 italic">
                 <Wrench className="w-5 h-5" /> Protocol Parameters
              </h4>
              
              <form onSubmit={handleSubmit} className="space-y-10">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Select Affected Asset</label>
                    <div className="relative group">
                       <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
                       <select 
                         required 
                         className="premium-input w-full pl-11 py-3.5 text-[14px] font-bold appearance-none bg-bg-secondary"
                         value={formData.productId}
                         onChange={e=>setFormData({...formData, productId: e.target.value})}
                       >
                          <option value="">Choose Unit from Registry</option>
                          {productList.map(p => (
                            <option key={p.Product_ID} value={p.Product_ID}>{p.Product_Name} ({p.Model_Number})</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Urgency Protocol</label>
                       <select 
                         className="premium-input w-full py-3.5 text-[14px] font-bold bg-bg-secondary"
                         value={formData.urgency}
                         onChange={e=>setFormData({...formData, urgency: e.target.value})}
                       >
                          <option>Standard</option>
                          <option>Express (SLA 2h)</option>
                          <option>Critical (Node Down)</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Fulfillment Mode</label>
                       <select 
                         className="premium-input w-full py-3.5 text-[14px] font-bold bg-bg-secondary"
                         value={formData.location}
                         onChange={e=>setFormData({...formData, location: e.target.value})}
                       >
                          <option>Home / Remote</option>
                          <option>Central Hub Drop</option>
                          <option>Courier Pickup</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Terminal Fault Description</label>
                    <div className="relative group">
                       <AlertCircle className="absolute left-4 top-6 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
                       <textarea 
                         required
                         placeholder="Synthesize the failure mechanism (e.g. Screen Pixel Burn, Kernel Panic, Power Instability)" 
                         className="premium-input w-full pl-11 py-5 text-[14px] min-h-[160px] leading-relaxed resize-none font-medium bg-bg-secondary"
                         value={formData.issue}
                         onChange={e=>setFormData({...formData, issue: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="pt-10 border-t border-border-color">
                    <button type="submit" className="primary-button w-full py-5 text-[13px] font-bold uppercase tracking-widest">
                       Deploy Service Protocol <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </form>
           </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-bg-secondary p-10 border border-border-color rounded-[2.5rem]">
              <h5 className="text-[12px] font-bold uppercase tracking-widest text-text-secondary opacity-60 mb-8 italic">Verified Node</h5>
              <div className="flex items-center gap-6 mb-10 pb-10 border-b border-border-color">
                 <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck className="w-8 h-8" />
                 </div>
                 <div>
                    <div className="text-[15px] font-bold text-black italic serif-heading">Security Layer 1</div>
                    <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-40">Coverage Enforced</div>
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="flex gap-4">
                    <Zap className="w-5 h-5 opacity-60 mt-1 shrink-0" />
                    <div>
                        <div className="text-[13px] font-bold text-black">High-Speed Triage</div>
                        <p className="text-[11px] text-text-secondary leading-relaxed mt-1 font-medium italic">Our network analyzes your fault report against thousands of incidents in milliseconds.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-10 bg-black text-white rounded-[2.5rem] relative overflow-hidden group">
              <Info className="w-8 h-8 text-white mb-6" />
              <h4 className="text-xl font-bold tracking-tight mb-4 uppercase italic serif-heading">Technical Governance.</h4>
              <p className="opacity-70 text-xs font-medium leading-relaxed italic mb-8">False reports may impact your system integrity score and SLA availability.</p>
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-80">Ref: PROTOCOL-7-A</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequest;
