import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, User, Mail, Lock, UserPlus, ArrowRight, ArrowLeft } from 'lucide-react';

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  return (
    <div className="min-h-screen font-sans bg-mesh flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[5%] right-[10%] w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[5%] left-[10%] w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 group transition-all hover:-translate-x-1">
        <ArrowLeft className="w-4 h-4 text-secondary group-hover:text-brand" />
        <span className="text-sm font-bold text-secondary group-hover:text-primary uppercase tracking-widest">Back to Hub</span>
      </Link>

      <div className="w-full max-w-[500px] glass-card p-12 relative z-10 animate-in border-border-color bg-bg-secondary">
        
        <div className="flex flex-col items-center mb-10">
           <div className="bg-brand p-3.5 rounded-2xl mb-6 shadow-xl shadow-brand/20">
             <UserPlus className="w-9 h-9 text-white" />
           </div>
           <h2 className="text-3xl font-bold text-primary mb-2 tracking-tight">Warranty<span className="text-brand">Sys</span></h2>
           <p className="text-[10px] font-bold text-secondary uppercase tracking-widest opacity-60">Enterprise Enrollment</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest ml-1 opacity-60">First Name</label>
              <div className="relative flex items-center group">
                 <User className="absolute left-4 w-4 h-4 text-secondary/30 group-focus-within:text-brand transition-colors" />
                 <input 
                   name="firstName" 
                   value={formData.firstName} 
                   onChange={handleChange} 
                   required 
                   className="premium-input w-full pl-11 py-4 text-[14px]" 
                   placeholder="Jane" 
                 />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest ml-1 opacity-60">Last Name</label>
              <div className="relative flex items-center group">
                 <User className="absolute left-4 w-4 h-4 text-secondary/30 group-focus-within:text-brand transition-colors" />
                 <input 
                   name="lastName" 
                   value={formData.lastName} 
                   onChange={handleChange} 
                   required 
                   className="premium-input w-full pl-11 py-4 text-[14px]" 
                   placeholder="Doe" 
                 />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-5">
             <div className="col-span-1 space-y-2">
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest ml-1 opacity-60">Age</label>
                <input 
                  type="number" 
                  name="age" 
                  value={formData.age} 
                  onChange={handleChange} 
                  required 
                  className="premium-input w-full py-4 text-[14px]" 
                  placeholder="25" 
                />
             </div>
             <div className="col-span-2 space-y-2">
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest ml-1 opacity-60">Email</label>
                <div className="relative flex items-center group">
                   <Mail className="absolute left-4 w-4 h-4 text-secondary/30 group-focus-within:text-brand transition-colors" />
                   <input 
                     type="email" 
                     name="email" 
                     value={formData.email} 
                     onChange={handleChange} 
                     required 
                     className="premium-input w-full pl-11 py-4 text-[14px]" 
                     placeholder="jane@example.com" 
                   />
                </div>
             </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-secondary uppercase tracking-widest ml-1 opacity-60">Security Key</label>
            <div className="relative flex items-center group">
               <Lock className="absolute left-4 w-4 h-4 text-secondary/30 group-focus-within:text-brand transition-colors" />
               <input 
                 type="password" 
                 name="password" 
                 value={formData.password} 
                 onChange={handleChange} 
                 required 
                 className="premium-input w-full pl-11 py-4 text-[14px]" 
                 placeholder="••••••••" 
               />
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
                Confirm Enrollment <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-secondary opacity-80">
            Already verified? <Link to="/login" className="text-brand font-bold hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
