import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, ArrowRight, ArrowLeft, Phone, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../config';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    email: '',
    address: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const tId = toast.loading('Creating account...');
    
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message || 'Account created successfully!', { id: tId });
        navigate('/login');
      } else {
        toast.error(data.message || 'Registration failed', { id: tId });
      }
    } catch (err) {
      toast.error('Could not connect to the server.', { id: tId });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 font-sans transition-colors duration-300">
      
      <Link to="/" className="absolute top-10 left-10 flex items-center gap-2 group transition-all">
        <ArrowLeft className="w-4 h-4 text-text-secondary" />
        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-widest">Back</span>
      </Link>

      <div className="w-full max-w-[480px] bg-bg-secondary p-12 border border-border-color rounded-[2.5rem] shadow-sm animate-in">
        
        <div className="flex flex-col items-center mb-10 text-center">
           <div className="bg-brand p-3 rounded-xl mb-6 shadow-xl">
             <UserPlus className="w-8 h-8 text-bg-primary" />
           </div>
           <h2 className="text-3xl font-bold text-text-primary mb-2 tracking-tight italic serif-heading">Create Account.</h2>
           <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[.2em] opacity-60">Join ServiTrack</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">First Name</label>
              <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
                 <input 
                   name="firstName" 
                   required 
                   className="premium-input w-full pl-11 py-3.5 text-[14px]" 
                   placeholder="Jane" 
                   value={formData.firstName}
                   onChange={e => setFormData({...formData, firstName: e.target.value})}
                 />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Last Name</label>
              <div className="relative group">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
                 <input 
                   name="lastName" 
                   required 
                   className="premium-input w-full pl-11 py-3.5 text-[14px]" 
                   placeholder="Doe" 
                   value={formData.lastName}
                   onChange={e => setFormData({...formData, lastName: e.target.value})}
                 />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
             <div className="space-y-2">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Age</label>
                <input 
                  type="number" 
                  required 
                  className="premium-input w-full py-3.5 text-[14px]" 
                  placeholder="25" 
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                />
             </div>
             <div className="space-y-2">
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Phone</label>
                <div className="relative group">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
                   <input 
                     type="tel" 
                     required 
                     className="premium-input w-full pl-11 py-3.5 text-[14px]" 
                     placeholder="999-000-1111" 
                     value={formData.phone}
                     onChange={e => setFormData({...formData, phone: e.target.value})}
                   />
                </div>
             </div>
          </div>

          <div className="space-y-2">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    type="email" 
                    required 
                    className="premium-input w-full pl-11 py-3.5 text-[14px]" 
                    placeholder="jane@example.com" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
              </div>
          </div>

          <div className="space-y-2">
              <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Address</label>
              <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
                  <input 
                    type="text" 
                    required 
                    className="premium-input w-full pl-11 py-3.5 text-[14px]" 
                    placeholder="123 Street, City" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  />
              </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
               <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100 transition-opacity" />
               <input 
                 type="password" 
                 required 
                 className="premium-input w-full pl-11 py-3.5 text-[14px]" 
                 placeholder="••••••••" 
                 value={formData.password}
                 onChange={e => setFormData({...formData, password: e.target.value})}
               />
            </div>
          </div>

          <button 
             type="submit" 
             disabled={isLoading}
             className="primary-button w-full mt-4 py-4 text-[13px] font-bold uppercase tracking-widest"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-bg-primary/30 border-t-bg-primary rounded-full animate-spin"></div>
            ) : (
              <>
                Confirm Registration <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm font-medium text-text-secondary">
            Already have an account? <Link to="/login" className="text-text-primary font-bold hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
