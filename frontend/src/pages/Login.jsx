import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/login', { email, password });
      
      if (res.data.success) {
        const { role, user } = res.data;
        localStorage.setItem('userRole', role);
        localStorage.setItem('userData', JSON.stringify(user));
        
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans text-primary bg-primary">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-10">
           <Link to="/" className="flex items-center gap-3 text-primary hover:scale-105 transition-transform group">
              <div className="bg-secondary p-3 rounded-2xl shadow-sm border border-std group-hover:bg-hover transition-colors">
                 <ShieldCheck className="text-brand w-8 h-8" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter">Warranty<span className="font-light">Sys</span></h1>
           </Link>
        </div>

        <div className="std-card p-10 md:p-12 relative overflow-hidden">
          <div className="flex flex-col items-center mb-10 text-center">
            <h2 className="text-3xl font-black text-primary mb-2 tracking-tight">Login</h2>
            <p className="text-secondary font-medium">Please enter your credentials.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-8 text-[10px] font-bold uppercase tracking-widest text-center shadow-sm border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 ml-1" htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                className="w-full std-input transition-all font-medium"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 ml-1" htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                className="w-full std-input transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="w-full std-btn flex items-center justify-center gap-3 uppercase tracking-widest text-xs mt-4">
              <LogIn className="w-5 h-5 text-blue-100" />
              Sign In
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-std text-center">
            <p className="text-[11px] text-secondary font-bold uppercase tracking-widest">
              Don't have an account? <Link to="/signup" className="text-brand hover:underline decoration-2 underline-offset-4 transition-all font-black ml-1">Sign Up</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
           <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-[0.2em]">
             <ArrowLeft className="w-4 h-4" /> Back to Home
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
