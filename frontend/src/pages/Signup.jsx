import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, ArrowLeft, ShieldCheck } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const res = await axios.post('http://localhost:5000/signup', formData);
      if (res.data.success) {
        setSuccess('Signup successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(res.data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error during signup');
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans text-primary bg-primary">
      <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
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
            <h2 className="text-3xl font-black text-primary mb-2 tracking-tight">Sign Up</h2>
            <p className="text-secondary font-medium">Create a new account.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-8 text-[10px] font-bold uppercase tracking-widest text-center shadow-sm border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-8 text-[10px] font-bold uppercase tracking-widest text-center shadow-sm border border-green-100">
              {success}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 ml-1">First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full std-input font-medium text-sm" placeholder="Jane" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 ml-1">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full std-input font-medium text-sm" placeholder="Doe" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
               <div className="col-span-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 ml-1">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full std-input font-medium text-sm" placeholder="25" />
               </div>
               <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 ml-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full std-input font-medium text-sm" placeholder="jane@example.com" />
               </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-secondary mb-2 ml-1">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full std-input font-medium text-sm" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full std-btn flex items-center justify-center gap-3 uppercase tracking-widest text-xs mt-4">
              <UserPlus className="w-5 h-5 text-blue-100" />
              Sign Up
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-std text-center">
            <p className="text-[11px] text-secondary font-bold uppercase tracking-widest">
              Already have an account? <Link to="/login" className="text-brand hover:underline decoration-2 underline-offset-4 transition-all font-black ml-1">Log In</Link>
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

export default Signup;
