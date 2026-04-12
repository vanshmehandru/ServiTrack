import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, Eye, ArrowRight, ArrowLeft, Zap, Globe } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Authenticating...');
    
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('userRole', res.data.user.Role || 'Customer');
        localStorage.setItem('userData', JSON.stringify(res.data.user));
        toast.success('Authentication successful', { id: toastId });
        
        setTimeout(() => {
          if (res.data.user.Role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        toast.error(res.data.message || 'Invalid credentials', { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server connection failed', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group transition-all hover:-translate-x-1">
        <ArrowLeft className="w-4 h-4 text-secondary group-hover:text-brand" />
        <span className="text-sm font-bold text-secondary group-hover:text-primary uppercase tracking-widest">Back to Hub</span>
      </Link>

      <div className="w-full max-w-[440px] glass-card p-12 relative z-10 animate-in border-border-color bg-bg-secondary">
        
        <div className="flex flex-col items-center mb-10">
           <div className="bg-brand p-3.5 rounded-2xl mb-6 shadow-xl shadow-brand/20">
             <ShieldCheck className="w-9 h-9 text-white" />
           </div>
           <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">Warranty<span className="text-brand">Sys</span></h2>
           <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Verified Access Gate</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest ml-1 opacity-60">Identity (Email)</label>
            <div className="relative flex items-center group">
               <Mail className="absolute left-4 w-4 h-4 text-secondary/30 group-focus-within:text-brand transition-colors" />
               <input 
                 type="email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)} 
                 required 
                 className="premium-input w-full pl-11 py-4 text-[14px]"
                 placeholder="name@enterprise.com" 
               />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
               <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Security Key</label>
               <span className="text-[10px] font-bold text-brand uppercase tracking-widest cursor-pointer hover:underline">Reset</span>
            </div>
            <div className="relative flex items-center group">
               <Lock className="absolute left-4 w-4 h-4 text-secondary/30 group-focus-within:text-brand transition-colors" />
               <input 
                 type={showPassword ? "text" : "password"} 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)} 
                 required 
                 className="premium-input w-full pl-11 pr-11 py-4 text-[14px]" 
                 placeholder="••••••••" 
               />
               <button 
                 type="button"
                 className="absolute right-4 cursor-pointer text-secondary/30 hover:text-brand transition-colors"
                 onClick={() => setShowPassword(!showPassword)}
               >
                 <Eye className={`w-4 h-4 ${showPassword ? 'text-brand' : ''}`} />
               </button>
            </div>
          </div>

          <button 
             type="submit" 
             disabled={isLoading}
             className="primary-button w-full mt-4 py-4 text-[13px] font-bold uppercase tracking-widest shadow-brand/10"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Initialize Session <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-secondary opacity-80">
            No credentials? <Link to="/signup" className="text-brand font-bold hover:underline underline-offset-4">Request Enrollment</Link>
          </p>
        </div>
      </div>
      
      {/* Mesh Footer Detail */}
      <div className="absolute bottom-10 flex gap-12 opacity-30 grayscale saturate-0 pointer-events-none">
         <Zap className="w-5 h-5 text-slate-400" />
         <Globe className="w-5 h-5 text-slate-400" />
         <ShieldCheck className="w-5 h-5 text-slate-400" />
      </div>
    </div>
  );
};

export default Login;
