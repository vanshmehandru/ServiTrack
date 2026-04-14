import { useState } from 'react';
import { Search, Sun, Moon, User, LogOut, ChevronDown, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('userData') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <header className="h-20 sticky top-0 bg-bg-primary border-b border-border-color flex items-center justify-between px-10 z-[2000] transition-colors duration-300 shadow-sm">
      <div className="flex-1 max-w-xl group">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-text-secondary opacity-40 group-focus-within:opacity-100 transition-opacity" />
          <input
            placeholder="Search serials, claims or products..."
            className="premium-input w-full pl-11 pr-4 py-2 text-[13px] bg-bg-secondary focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary text-text-secondary hover:text-text-primary transition-all cursor-pointer border-none"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-8 w-px bg-border-color mx-2"></div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-4 py-1.5 pl-1.5 pr-3 rounded-xl hover:bg-bg-secondary transition-all border-none bg-transparent cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand p-0.5 overflow-hidden shadow-sm">
              <div className="w-full h-full rounded-[9px] overflow-hidden flex items-center justify-center bg-bg-primary">
                <img
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.First_Name || 'Master'}`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[13px] font-bold text-text-primary leading-none mb-1 flex items-center gap-2">
                {user.First_Name || 'Master'}
                <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] opacity-60">
                {localStorage.getItem('userRole') || 'Verified Member'}
              </div>
            </div>
          </button>

          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-64 bg-bg-primary border border-border-color rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] z-[2001] py-4 animate-in overflow-hidden">
                <div className="px-6 py-3 mb-3 border-b border-border-color">
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-1 italic">Identity</div>
                  <div className="text-[14px] font-bold text-text-primary truncate">{user.Email}</div>
                </div>

                <div className="px-2 space-y-1">
                  <button
                    onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                    className="w-full text-left px-5 py-3.5 text-[13px] font-bold text-text-primary hover:bg-bg-secondary rounded-xl flex items-center gap-4 border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <User className="w-4 h-4 opacity-40" /> Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-3.5 text-[13px] font-bold text-red-500 hover:bg-red-50/50 rounded-xl flex items-center gap-4 border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <LogOut className="w-4 h-4 opacity-40" /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>

  );
};

export default Navbar;
