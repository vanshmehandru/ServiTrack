import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-bg-primary font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-mesh">
          <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
