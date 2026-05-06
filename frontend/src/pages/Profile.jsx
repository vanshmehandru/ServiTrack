import { useState, useEffect } from 'react';
import { User, Mail, MapPin, Phone, ShieldCheck, Zap, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import API_URL from '../config';

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
          <h2 className="text-5xl font-bold tracking-tight text-text-primary serif-heading">My Profile.</h2>
          <p className="text-lg text-text-secondary font-medium opacity-80 italic">Manage your verified account and contact details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Col: Avatar & Badge */}
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-bg-primary p-12 flex flex-col items-center border border-border-color rounded-[3.5rem] shadow-sm">
               <div className="w-32 h-32 rounded-[3.5rem] bg-bg-secondary p-1 mb-8 shadow-xl relative group border border-border-color">
                  <div className="w-full h-full rounded-[3.4rem] overflow-hidden bg-bg-primary">
                     <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${formData.firstName}`} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-1 right-1 w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-bg-primary">
                     <Zap className="w-4 h-4 fill-white" />
                  </div>
               </div>
               <h3 className="text-3xl font-bold text-text-primary tracking-tight italic serif-heading">{formData.firstName} {formData.lastName}</h3>
               <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[.4em] mt-2 opacity-40 italic">Verified Member</p>
              
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

            <div className="bg-bg-primary p-12 text-text-primary rounded-[3.5rem] border border-border-color shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-40 h-40 bg-brand/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
               <h5 className="text-[10px] uppercase font-bold tracking-[.4em] text-text-secondary opacity-30 mb-8 italic">Secure Metadata</h5>
               <div className="space-y-4">
                  <div className="flex justify-between items-center bg-bg-secondary/40 p-5 rounded-2xl border border-border-color/50">
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Account ID</span>
                     <span className="font-mono text-[11px] font-bold tracking-tighter">CUST-ID-{userData.Customer_ID || '000'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-bg-secondary/40 p-5 rounded-2xl border border-border-color/50">
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">System Status</span>
                     <span className="text-[9px] font-bold bg-black text-white px-4 py-1 rounded-full uppercase tracking-[.3em] shadow-sm">Active</span>
                  </div>
               </div>
            </div>
        </div>

        {/* Right Col: Forms */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-bg-primary p-12 border border-border-color rounded-[3.5rem] shadow-sm">
               <h4 className="text-2xl font-bold tracking-tight text-text-primary mb-12 flex items-center gap-4 italic serif-heading">
                  <ShieldCheck className="w-6 h-6" /> Profile Details
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

                  <div className="pt-10">
                     <button type="submit" disabled={isLoading} className="bg-black text-white w-full py-6 rounded-full text-[12px] font-bold uppercase tracking-[.4em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-black/20 cursor-pointer">
                        {isLoading ? 'Synchronizing...' : 'Save Changes'}
                     </button>
                  </div>
              </form>
           </div>
           
            <div className="bg-bg-primary p-12 border border-border-color border-dashed rounded-[3.5rem]">
               <h4 className="text-2xl font-bold tracking-tight text-red-500 mb-8 flex items-center gap-4 italic serif-heading">
                  <LogOut className="w-6 h-6" /> Sign Out
               </h4>
               <p className="text-[15px] text-text-secondary mb-10 font-medium italic opacity-70">Ready to end your session? Your data is securely synchronized.</p>
               <button 
                 onClick={handleLogout}
                 className="w-full py-6 rounded-full border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-500 transition-all font-bold uppercase tracking-[.4em] text-[11px] cursor-pointer"
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
