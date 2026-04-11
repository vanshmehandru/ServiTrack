import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Authenticating...');
    
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      
      if (res.data.success) {
        toast.success('Successfully logged in!', { id: toastId });
        const { role, user } = res.data;
        localStorage.setItem('userRole', role);
        localStorage.setItem('userData', JSON.stringify(user));
        
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        toast.error(res.data.message || 'Invalid credentials', { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error during login', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-0 bg-[#0F172A] text-[#E2E8F0] font-sans overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#3B82F6]/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6366F1]/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '10s' }}></div>
      
      <div className="w-full max-w-md z-10">
        <div className="flex justify-center mb-8">
           <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="bg-gradient-to-tr from-[#3B82F6] to-[#6366F1] p-2 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">WarrantySys</h1>
           </Link>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-[20px] border border-white/10 rounded-3xl p-10 shadow-2xl relative overflow-hidden group">
          {/* Subtle hover glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/10 to-[#6366F1]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="mb-8 text-center relative z-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-[#94A3B8] text-sm font-medium">Please enter your credentials to safely connect.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2 ml-1" htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                className="w-full bg-white/[0.05] border border-white/10 text-white text-base rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2 ml-1" htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                className="w-full bg-white/[0.05] border border-white/10 text-white text-base rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button 
               type="submit" 
               disabled={isLoading}
               className="w-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:scale-[1.02] shadow-[0_10px_20px_rgba(59,130,246,0.2)] hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] text-white py-4 rounded-xl transition-all font-bold text-base flex items-center justify-center gap-3 mt-8 border-none cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-white/80" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10 border-t border-white/5 pt-6">
            <p className="text-sm text-[#94A3B8] font-medium">
              Don't have an account yet? <Link to="/signup" className="text-[#3B82F6] font-bold hover:text-white transition-colors ml-1">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
