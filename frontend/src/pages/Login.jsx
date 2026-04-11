import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-6 relative z-0">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
           <Link to="/" className="flex items-center gap-3 text-brand hover:scale-105 transition-transform">
              <div className="p-2 bg-brand text-white rounded-lg shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black tracking-widest uppercase">WarrantySys</h1>
           </Link>
        </div>

        <div className="glass-card p-10 shadow-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-primary mb-2">Welcome Back</h2>
            <p className="text-secondary text-sm font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-secondary mb-2" htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                className="w-full glass-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-secondary mb-2" htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                className="w-full glass-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button 
               type="submit" 
               disabled={isLoading}
               className="w-full std-btn py-3.5 flex items-center justify-center gap-3 mt-4 disabled:opacity-70"
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

          <div className="mt-8 text-center">
            <p className="text-sm text-secondary font-medium">
              Don't have an account? <Link to="/signup" className="text-brand font-bold hover:underline ml-1">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
