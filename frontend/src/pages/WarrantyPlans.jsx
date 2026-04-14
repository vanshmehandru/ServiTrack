import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Star, Crown, CheckCircle2, 
  ArrowLeft, CreditCard, ChevronRight, Box
} from 'lucide-react';
import toast from 'react-hot-toast';

const WarrantyPlans = () => {
  const navigate = useNavigate();
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const user = JSON.parse(localStorage.getItem('userData') || '{}');
  const customerId = user.Customer_ID;

  const plans = [
    { name: 'Standard', price: '0', icon: ShieldCheck, color: 'text-text-secondary', features: ['Basic support', '2 Year Warranty', 'Mail-in repair'] },
    { name: 'Pro', price: '49', icon: Star, color: 'text-brand', features: ['Priority support', '3 Year Warranty', 'Accidental coverage', 'Express shipping'] },
    { name: 'Enterprise', price: '99', icon: Crown, color: 'text-orange-500', features: ['24/7 Support', '5 Year Warranty', 'On-site repair', 'Business continuity'] },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!customerId) return;
      try {
        const response = await fetch(`http://localhost:5000/products?customerId=${customerId}`);
        const data = await response.json();
        if (data.success) {
          setProductList(data.products);
          if (data.products.length > 0) setSelectedProduct(data.products[0]);
        }
      } catch (err) {
        toast.error('Could not load hardware registry.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [customerId]);

  const handleUpgrade = async () => {
    if (!selectedProduct) return;
    const duration = selectedPlan === 'Enterprise' ? 5 : (selectedPlan === 'Pro' ? 3 : 2);
    const tId = toast.loading(`Upgrading ${selectedProduct.Product_Name} to ${selectedPlan}...`);
    setIsUpgrading(true);
    try {
      const response = await fetch('http://localhost:5000/upgrade-warranty', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: selectedProduct.Product_ID, 
          planType: selectedPlan, 
          durationYears: duration 
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message, { id: tId });
        navigate('/warranty');
      } else {
        toast.error(data.message, { id: tId });
      }
    } catch (err) {
      toast.error('Connection failed', { id: tId });
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <button 
            onClick={() => navigate('/warranty')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.3em] text-text-secondary opacity-40 hover:opacity-100 transition-all mb-4 bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Warranty
          </button>
          <h2 className="text-5xl font-black tracking-tighter text-text-primary italic serif-heading">Warranty Plans.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80 mt-2">Elevate the protection of your hardware fleet.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        {/* Left Column: Product Selection */}
        <div className="xl:col-span-1 space-y-8">
          <div className="bg-bg-secondary p-8 rounded-[2.5rem] border border-border-color shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-text-secondary opacity-40 mb-8 italic">1. Select Hardware</h4>
            
            {isLoading ? (
              <div className="py-10 text-center animate-pulse text-xs font-bold opacity-40 uppercase tracking-widest">Scanning Registry...</div>
            ) : productList.length === 0 ? (
              <div className="py-10 text-center text-xs font-bold opacity-40 italic">No products found.</div>
            ) : (
              <div className="space-y-4">
                {productList.map(p => (
                  <button 
                    key={p.Product_ID}
                    onClick={() => setSelectedProduct(p)}
                    className={`w-full p-6 rounded-2xl border-2 transition-all text-left flex items-center gap-4 ${
                      selectedProduct?.Product_ID === p.Product_ID 
                      ? 'border-brand bg-bg-primary shadow-md' 
                      : 'border-transparent bg-bg-primary/50 hover:bg-bg-primary'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedProduct?.Product_ID === p.Product_ID ? 'bg-brand text-bg-primary' : 'bg-bg-secondary text-text-secondary opacity-40'}`}>
                      <Box className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-bold text-text-primary truncate">{p.Product_Name}</div>
                      <div className="text-[9px] font-mono text-text-secondary opacity-60 uppercase">SN-{p.Model_Number}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-8 bg-brand/5 border border-brand/10 rounded-[2.5rem]">
            <p className="text-[11px] text-text-secondary leading-relaxed font-medium italic opacity-80 text-center">
              "Upgrade plans are applied instantly across our global service verification network."
            </p>
          </div>
        </div>

        {/* Right Column: Plan Selection */}
        <div className="xl:col-span-3 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map(plan => (
              <div 
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`p-10 rounded-[3rem] border-2 transition-all cursor-pointer relative group flex flex-col ${
                  selectedPlan === plan.name 
                  ? 'border-brand bg-bg-secondary shadow-2xl scale-[1.02]' 
                  : 'border-border-color bg-bg-primary hover:border-brand/30'
                }`}
              >
                <div className={`w-20 h-20 rounded-3xl bg-bg-secondary border border-border-color flex items-center justify-center mb-10 shadow-sm ${plan.color}`}>
                  <plan.icon className="w-10 h-10" />
                </div>
                
                <h5 className="text-3xl font-black text-text-primary mb-3 italic serif-heading">{plan.name}</h5>
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-4xl font-black text-text-primary tracking-tighter">${plan.price}</span>
                  <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest opacity-60">/ year</span>
                </div>
                
                <ul className="space-y-5 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-4 text-[13px] font-bold text-text-secondary opacity-70 italic">
                      <CheckCircle2 className="w-5 h-5 text-brand opacity-40" /> {f}
                    </li>
                  ))}
                </ul>

                {selectedPlan === plan.name && (
                  <div className="mt-10 pt-10 border-t border-border-color/50 flex items-center justify-between text-brand">
                    <span className="text-[11px] font-black uppercase tracking-widest">Selected Tier</span>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-bg-secondary border border-border-color p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-bg-primary border border-border-color flex items-center justify-center text-text-primary shadow-sm">
                   <CreditCard className="w-8 h-8 opacity-30" />
                </div>
                <div>
                   <h6 className="text-lg font-bold text-text-primary italic serif-heading tracking-tight">Checkout Securely.</h6>
                   <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[.3em] opacity-40 mt-1">Stripe-powered payment encryption</p>
                </div>
             </div>
             <button 
                disabled={isUpgrading || !selectedProduct}
                onClick={handleUpgrade}
                className="primary-button px-20 py-5 text-[12px] font-black uppercase tracking-[.4em] shadow-2xl shadow-brand/20 flex items-center gap-4 disabled:opacity-50 active:scale-95 transition-all"
             >
                {isUpgrading ? 'Processing Sync...' : (
                  <>
                    Confirm & Upgrade <ChevronRight className="w-4 h-4" />
                  </>
                )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPlans;
