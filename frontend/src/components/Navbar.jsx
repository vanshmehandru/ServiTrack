import { Bell, Search, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ title }) => {
  const { isDark, toggleTheme } = useTheme();
  const user = JSON.parse(localStorage.getItem('userData') || '{}');

  return (
    <header className="h-20 sticky top-0 bg-white/80 border-b border-border-color flex items-center justify-between px-10 z-[40] backdrop-blur-md">
      <div className="flex-1 max-w-xl group">
        <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-text-secondary opacity-40 group-focus-within:opacity-100 transition-opacity" />
            <input 
              placeholder="Search serials, claims or assets..." 
              className="premium-input w-full pl-11 pr-4 py-2 text-[13px] bg-bg-secondary border-none focus:ring-1 focus:ring-black" 
            />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary text-text-secondary hover:text-black transition-all cursor-pointer border-none"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary text-text-secondary hover:text-black transition-all cursor-pointer relative border-none">
          <Bell className="w-4 h-4" />
          <span className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-border-color mx-2"></div>

        <div className="flex items-center gap-4 pl-2 cursor-pointer group">
           <div className="text-right hidden sm:block">
              <div className="text-[13px] font-bold text-black leading-none mb-1">{user.First_Name || 'Master'}</div>
              <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">System Operator</div>
           </div>
           <div className="w-10 h-10 rounded-xl bg-black p-0.5 overflow-hidden shadow-sm">
             <div className="w-full h-full rounded-[9px] overflow-hidden flex items-center justify-center bg-white">
               <img 
                 src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.First_Name || 'Admin'}`} 
                 alt="User" 
                 className="w-full h-full object-cover" 
               />
             </div>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
