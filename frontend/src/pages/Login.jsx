import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../config';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const tId = toast.loading('Authenticating...');
    
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('userRole', data.role);
        localStorage.setItem('userData', JSON.stringify(data.user));
        toast.success('Authentication successful', { id: tId });
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(data.message || 'Invalid credentials', { id: tId });
      }
    } catch (err) {
      toast.error('Connection failed. Is the server running?', { id: tId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 font-sans">
      <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 group transition-all">
        <ArrowLeft className="w-4 h-4 text-text-secondary" />
        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Back</span>
      </Link>

      <div className="w-full max-w-[420px] bg-white p-12 border border-border-color rounded-[2rem] shadow-sm animate-in">
        
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="bg-black p-2 rounded-xl mb-6 shadow-xl shadow-black/10">
             <ShieldCheck className="w-8 h-8 text-white" />
           </div>
           <h2 className="text-3xl font-bold text-text-primary mb-2 tracking-tight italic serif-heading">Welcome Back.</h2>
           <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Verified Enrollment Gate</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Identity (Email)</label>
            <div className="relative group">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
               <input 
                 type="email" 
                 required 
                 className="premium-input w-full pl-11 py-3.5 text-[14px]"
                 placeholder="name@enterprise.com" 
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
               />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Security Key</label>
            <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
               <input 
                 type={showPassword ? "text" : "password"} 
                 required 
                 className="premium-input w-full pl-11 pr-11 py-3.5 text-[14px]" 
                 placeholder="••••••••" 
                 value={formData.password}
                 onChange={e => setFormData({...formData, password: e.target.value})}
               />
               <button 
                 type="button"
                 className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-30 hover:opacity-100 transition-opacity border-none bg-transparent"
                 onClick={() => setShowPassword(!showPassword)}
               >
                 <Eye className={`w-4 h-4 ${showPassword ? 'text-black' : ''}`} />
               </button>
            </div>
          </div>

          <button 
             type="submit" 
             disabled={isLoading}
             className="primary-button w-full mt-4 py-4 text-[13px] font-bold uppercase tracking-widest"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Initialize session <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm font-medium text-text-secondary">
            No credentials? <Link to="/signup" className="text-black font-bold hover:underline underline-offset-4">Request Enrollment</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

