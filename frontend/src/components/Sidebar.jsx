import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Box, ShieldCheck, Wrench, 
  History, CreditCard, User, LogOut, ChevronRight,
  Plus, MessageSquare
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'products', label: 'Products', icon: Box, path: '/products' },
    { id: 'warranty', label: 'Warranties', icon: ShieldCheck, path: '/warranty' },
    { id: 'service', label: 'Request Service', icon: Plus, path: '/request-service' },
    { id: 'tracking', label: 'Service Tracking', icon: Wrench, path: '/tracking' },
    { id: 'history', label: 'History', icon: History, path: '/history' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payment' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, path: '/feedback' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-white border-r border-border-color flex flex-col hidden lg:flex">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-black p-1.5 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-black serif-heading italic">WarrantySys</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all border-none cursor-pointer ${
                isActive 
                  ? 'bg-black text-white shadow-sm' 
                  : 'bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-60'}`} />
                <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </div>
              {isActive && <div className="w-1 h-1 bg-white rounded-full opacity-50"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border-color space-y-2">
        <button 
          onClick={() => navigate('/profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all border-none cursor-pointer ${
            location.pathname === '/profile' 
              ? 'bg-bg-secondary text-black' 
              : 'text-text-secondary hover:bg-bg-secondary'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[13px] font-semibold">Profile</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all border-none cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[13px] font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );

};

export default Sidebar;
