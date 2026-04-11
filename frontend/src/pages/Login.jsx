import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans text-primary bg-[#f8fafc]">
      
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-8">
           <Link to="/" className="flex items-center gap-3 text-brand hover:scale-105 transition-transform">
              <ShieldCheck className="text-brand w-8 h-8" />
              <h1 className="text-2xl font-black tracking-widest uppercase">WarrantySys</h1>
           </Link>
        </div>

        <div className="bg-white border border-std p-10 md:p-12 shadow-sm rounded">
          <div className="flex flex-col items-center mb-8 text-center">
            <h2 className="text-2xl font-black text-primary mb-2 tracking-tight">Institutional Login</h2>
            <p className="text-secondary text-sm font-medium">Please authenticate to access your portal.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-[#b91c1c] px-4 py-3 rounded mb-8 text-[10px] font-bold uppercase tracking-widest text-center shadow-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#475569] mb-2" htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                className="w-full std-input font-medium rounded text-sm bg-[#f8fafc]"
                placeholder="User / Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#475569] mb-2" htmlFor="password">Security Key</label>
              <input 
                id="password"
                type="password" 
                className="w-full std-input font-medium rounded text-sm bg-[#f8fafc]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit" className="w-full bg-brand hover:bg-brand-hover text-white py-3.5 rounded transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 mt-4 border-none cursor-pointer">
              <Lock className="w-4 h-4 text-white/70" />
              Sign In
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default Login;
