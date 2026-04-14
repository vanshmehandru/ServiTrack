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
    <aside className="w-64 h-screen sticky top-0 bg-bg-primary border-r border-border-color flex flex-col hidden lg:flex transition-colors duration-300">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-brand p-1.5 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-bg-primary" />
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-text-primary serif-heading italic">WarrantySys</span>
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
                  ? 'bg-brand text-bg-primary shadow-sm' 
                  : 'bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 ${isActive ? 'text-bg-primary' : 'opacity-60'}`} />
                <span className={`text-[13px] ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </div>
              {isActive && <div className="w-1 h-1 bg-bg-primary rounded-full opacity-50"></div>}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border-color">
         <div className="p-6 bg-bg-secondary rounded-2xl border border-border-color">
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60 mb-2">Support</div>
            <p className="text-[11px] text-text-secondary leading-relaxed font-medium">Need help? Contact our dedicated global support team.</p>
         </div>
      </div>
    </aside>
  );

};

export default Sidebar;
