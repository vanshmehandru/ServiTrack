import { Link } from 'react-router-dom';
import dashboardPreview from '../assets/dashboard-preview.png';
import { ShieldCheck, Layout } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-border-color">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="bg-black p-1.5 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">WarrantySys</span>
            </Link>
            

          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-[13px] font-semibold hover:opacity-70 transition-opacity">Login</Link>
            <Link to="/signup" className="primary-button">
              Try for free
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32">
        
        {/* Banner Announcement */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-secondary border border-border-color text-[11px] font-semibold text-text-secondary animate-in">
             <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
             We're live on Product Hunt! <span className="text-black underline cursor-pointer">Check it out</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 text-center mb-24">
          <h1 className="text-7xl font-bold tracking-tight mb-8 animate-in leading-[1.05]">
            Unified <span className="italic serif-heading">Warranty</span> infrastructure <br /> for modern hardware.
          </h1>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 font-medium animate-in">
            WarrantySys is designed for teams that need to manage high-quality, verified service claims at scale. From device enrollment to global dispatch.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in">
            <Link to="/signup" className="primary-button px-10 py-4 text-base">
              Start for free
            </Link>

          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="max-w-6xl mx-auto px-6 mb-40 animate-in">
          <div className="relative p-4 md:p-8 bg-bg-secondary rounded-[2.5rem] border border-border-color shadow-2xl overflow-hidden group">
            {/* The "Blue Interior" with Improved Visualization */}
            <div className="aspect-[16/10] bg-black rounded-[1.5rem] relative overflow-hidden flex flex-col group/preview">
              {/* Background Image with Gradient Overlay */}
              <img 
                src={dashboardPreview} 
                alt="WarrantySys Dashboard Preview" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/preview:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0052FF]/40 via-transparent to-black/20"></div>
              
              {/* Floating Content */}
              <div className="relative h-full flex flex-col p-12 justify-between">
                <div className="flex justify-between items-start text-white/90">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold border border-white/20">
                    <Layout className="w-4 h-4" /> Comprehensive Dashboard
                  </div>
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white/20 bg-cover bg-center shadow-lg" style={{backgroundImage: `url(https://i.pravatar.cc/100?img=${i+44})`}}></div>
                    ))}
                  </div>
                </div>

                <div className="max-w-md space-y-4">
                  <div className="inline-flex items-center gap-2 bg-[#0052FF] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white shadow-xl shadow-blue-500/30">
                    Trusted by 500+ Hardware Teams
                  </div>
                  <h3 className="text-4xl font-bold text-white tracking-tight leading-tight">
                    Manage service <span className="italic serif-heading">at the speed of light.</span>
                  </h3>
                  <p className="text-white/80 text-base font-medium leading-relaxed">
                    Automated claim processing, encrypted serial verification, and real-time technician dispatching — all in one unified interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-border-color">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: "Asset Registry", desc: "Enroll hardware units with encrypted serial verification in seconds." },
              { title: "Real-time Policy", desc: "Automated warranty validation against your custom service terms." },
              { title: "Unified Dispatch", desc: "Centralized claim tracking and technician synchronization." }
            ].map((f, i) => (
              <div key={i} className="space-y-4">
                <div className="text-[12px] font-bold uppercase tracking-widest text-text-secondary mb-2">{String(i+1).padStart(2, '0')}</div>
                <h4 className="text-xl font-bold tracking-tight">{f.title}</h4>
                <p className="text-text-secondary leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-24 border-t border-border-color">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="bg-black p-1 rounded-md">
                   <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">WarrantySys</span>
              </div>
              <p className="text-sm text-text-secondary font-medium">© 2024 WarrantySys Technologies Inc.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
              <div>
                <h5 className="text-[11px] font-bold text-black uppercase tracking-widest mb-6">Product</h5>
                <ul className="space-y-4 text-sm text-text-secondary font-medium">
                  <li className="hover:text-black cursor-pointer">Features</li>
                  <li className="hover:text-black cursor-pointer">Security</li>
                  <li className="hover:text-black cursor-pointer">API</li>
                </ul>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-black uppercase tracking-widest mb-6">Company</h5>
                <ul className="space-y-4 text-sm text-text-secondary font-medium">
                  <li className="hover:text-black cursor-pointer">About</li>
                  <li className="hover:text-black cursor-pointer">Careers</li>
                  <li className="hover:text-black cursor-pointer">Blog</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>

      </main>



    </div>
  );
};

export default Landing;
