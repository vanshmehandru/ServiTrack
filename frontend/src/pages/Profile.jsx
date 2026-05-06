import API_URL from '../config';
import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Phone, ShieldCheck, Zap, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData') || '{}'));
  const [formData, setFormData] = useState({
    firstName: userData.First_Name || '',
    lastName: userData.Last_Name || '',
    email: userData.Email || '',
    phone: userData.Phone || '',
    address: userData.Address || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const tId = toast.loading('Synchronizing profile...');
    
    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userData.Customer_ID,
          phone: formData.phone,
          address: formData.address
        })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Profile updated successfully', { id: tId });
        // Update local storage
        const updatedUser = { ...userData, Phone: formData.phone, Address: formData.address };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setUserData(updatedUser);
      } else {
        toast.error(data.message || 'Update failed', { id: tId });
      }
    } catch (err) {
      toast.error('Connection failed', { id: tId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 font-sans transition-colors duration-300">
      {/* Profile Header */}
      <div className="relative">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary italic serif-heading">My Profile.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80">Manage your verified account and contact details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Col: Avatar & Badge */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-bg-secondary p-10 flex flex-col items-center border border-border-color rounded-[2.5rem] shadow-sm">
              <div className="w-32 h-32 rounded-[2rem] bg-brand p-1 mb-6 shadow-xl relative group">
                 <div className="w-full h-full rounded-[1.8rem] overflow-hidden bg-bg-primary">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`} alt="Avatar" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand text-bg-primary rounded-xl flex items-center justify-center shadow-lg border-2 border-bg-secondary">
                    <Zap className="w-4 h-4 fill-bg-primary" />
                 </div>
              </div>
              <h3 className="text-2xl font-bold text-text-primary tracking-tight italic serif-heading">{formData.firstName} {formData.lastName}</h3>
              <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[.2em] mt-1 opacity-60">Verified Member</p>
              
              <div className="w-full h-px bg-border-color my-8"></div>
              
              <div className="w-full space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-text-secondary">
                    <span>Account Tier</span>
                    <span className="text-text-primary">Standard</span>
                 </div>
                 <div className="w-full h-1.5 bg-border-color rounded-full overflow-hidden">
                    <div className="w-[100%] h-full bg-brand rounded-full shadow-sm"></div>
                 </div>
              </div>
           </div>

           <div className="bg-brand p-8 text-bg-primary rounded-[2.5rem] shadow-sm relative overflow-hidden group">
              <h5 className="text-[10px] uppercase font-bold tracking-[.3em] opacity-50 mb-6 italic">Secure Metadata</h5>
              <div className="space-y-4">
                 <div className="flex justify-between items-center bg-bg-primary/10 p-4 rounded-xl border border-bg-primary/20">
                    <span className="text-[9px] font-bold uppercase opacity-40">Account ID</span>
                    <span className="font-mono text-[11px] font-bold tracking-tighter">CUST-ID-{userData.Customer_ID || '000'}</span>
                 </div>
                 <div className="flex justify-between items-center bg-bg-primary/10 p-4 rounded-xl border border-bg-primary/20">
                    <span className="text-[9px] font-bold uppercase opacity-40">System Status</span>
                    <span className="text-[10px] font-bold bg-bg-primary text-brand px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Active</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Col: Forms */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-bg-secondary p-10 border border-border-color rounded-[2.5rem] shadow-sm">
              <h4 className="text-xl font-bold tracking-tight text-text-primary mb-10 flex items-center gap-2 italic serif-heading">
                 <ShieldCheck className="w-5 h-5" /> Profile Details
              </h4>
              
              <form onSubmit={handleUpdate} className="space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">First Name</label>
                       <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30" />
                          <input 
                            readOnly
                            value={formData.firstName} 
                            className="premium-input w-full pl-11 py-3 text-[14px] bg-bg-primary/50 cursor-not-allowed opacity-50 border-none" 
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Last Name</label>
                       <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30" />
                          <input 
                            readOnly
                            value={formData.lastName} 
                            className="premium-input w-full pl-11 py-3 text-[14px] bg-bg-primary/50 cursor-not-allowed opacity-50 border-none" 
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30" />
                       <input 
                         disabled
                         value={formData.email} 
                         className="premium-input w-full pl-11 py-3 text-[14px] bg-bg-primary/50 cursor-not-allowed opacity-50 border-none" 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Contact Phone</label>
                    <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
                       <input 
                         value={formData.phone} 
                         onChange={e=>setFormData({...formData, phone:e.target.value})}
                         className="premium-input w-full pl-11 py-3 text-[14px] font-mono tracking-widest bg-bg-primary" 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-text-secondary tracking-widest ml-1">Residential Address</label>
                    <div className="relative group">
                       <MapPin className="absolute left-4 top-6 w-4 h-4 text-text-secondary opacity-30 group-focus-within:opacity-100" />
                       <textarea 
                         value={formData.address} 
                         onChange={e=>setFormData({...formData, address:e.target.value})}
                         className="premium-input w-full pl-11 py-5 text-[14px] min-h-[120px] leading-relaxed resize-none bg-bg-primary" 
                       />
                    </div>
                 </div>

                 <div className="pt-6 border-t border-border-color">
                    <button type="submit" disabled={isLoading} className="primary-button w-full py-5 text-[13px] font-bold uppercase tracking-widest shadow-lg shadow-brand/10">
                       Save Changes
                    </button>
                 </div>
              </form>
           </div>
           
           <div className="bg-bg-secondary p-10 border border-border-color border-dashed rounded-[2.5rem]">
              <h4 className="text-xl font-bold tracking-tight text-red-500 mb-6 flex items-center gap-2 italic serif-heading">
                 <LogOut className="w-5 h-5" /> Sign Out
              </h4>
              <p className="text-sm text-text-secondary mb-8 font-medium">Ready to end your session? Your data is securely synchronized.</p>
              <button 
                onClick={handleLogout}
                className="secondary-button w-full py-4 text-red-500 border-red-100 hover:bg-red-50/50 hover:border-red-500 hover:text-red-600 transition-all font-bold uppercase tracking-widest text-[11px]"
              >
                 Sign Out from ServiTrack
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
