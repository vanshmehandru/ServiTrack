import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, UserPlus } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Creating account...');
    
    try {
      const res = await axios.post('http://localhost:5000/signup', formData);
      if (res.data.success) {
        toast.success('Account created successfully! Logging you in...', { id: toastId });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(res.data.message || 'Registration failed', { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error during registration', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-0 bg-[#0F172A] text-[#E2E8F0] font-sans overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6366F1]/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '9s' }}></div>
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-[#3B82F6]/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '11s' }}></div>
      
      <div className="w-full max-w-lg z-10 pt-10 pb-10">
        <div className="flex justify-center mb-8">
           <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
              <div className="bg-gradient-to-tr from-[#3B82F6] to-[#6366F1] p-2 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">WarrantySys</h1>
           </Link>
        </div>

        <div className="bg-white/[0.03] backdrop-blur-[20px] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          {/* Subtle hover glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/5 to-[#6366F1]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <div className="mb-10 text-center relative z-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create an Account</h2>
            <p className="text-[#94A3B8] text-sm font-medium">Join us to manage your service claims.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6 relative z-10">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2 ml-1">First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full bg-white/[0.05] border border-white/10 text-white text-base rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2 ml-1">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full bg-white/[0.05] border border-white/10 text-white text-base rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all" placeholder="Doe" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
               <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2 ml-1">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full bg-white/[0.05] border border-white/10 text-white text-base rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all" placeholder="25" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2 ml-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-white/[0.05] border border-white/10 text-white text-base rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all" placeholder="jane@example.com" />
               </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2 ml-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full bg-white/[0.05] border border-white/10 text-white text-base rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/30 transition-all" placeholder="••••••••" />
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
                  <UserPlus className="w-4 h-4 text-white/80" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center relative z-10 border-t border-white/5 pt-6">
            <p className="text-sm text-[#94A3B8] font-medium">
              Already have an account? <Link to="/login" className="text-[#3B82F6] font-bold hover:text-white transition-colors ml-1">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
