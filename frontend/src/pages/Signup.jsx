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
    const toastId = toast.loading('Creating your account...');
    
    try {
      const res = await axios.post('http://localhost:5000/signup', formData);
      if (res.data.success) {
        toast.success('Account created! Redirecting...', { id: toastId });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(res.data.message || 'Signup failed', { id: toastId });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error during signup', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-0">
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      
      <div className="w-full max-w-lg">
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
            <h2 className="text-2xl font-black text-primary mb-2">Create an Account</h2>
            <p className="text-secondary text-sm font-medium">Join us to manage your service claims.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-secondary mb-2">First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full glass-input" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-xs font-bold text-secondary mb-2">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full glass-input" placeholder="Doe" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-5">
               <div className="col-span-1">
                  <label className="block text-xs font-bold text-secondary mb-2">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full glass-input" placeholder="25" />
               </div>
               <div className="col-span-2">
                  <label className="block text-xs font-bold text-secondary mb-2">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full glass-input" placeholder="jane@example.com" />
               </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-secondary mb-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full glass-input" placeholder="••••••••" />
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
                  <UserPlus className="w-4 h-4 text-white/80" />
                  Sign Up
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-std pt-6">
            <p className="text-sm text-secondary font-medium">
              Already have an account? <Link to="/login" className="text-brand font-bold hover:underline ml-1">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
