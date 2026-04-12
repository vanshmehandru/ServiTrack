import { Link } from 'react-router-dom';
import { 
  ShieldCheck, ArrowRight, Play, CheckCircle2, 
  Search, Zap, Globe, Layout, Cpu
} from 'lucide-react';

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
            
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-text-secondary">
              <span className="hover:text-black cursor-pointer transition-colors">Product</span>
              <span className="hover:text-black cursor-pointer transition-colors">Enterprise</span>
              <span className="hover:text-black cursor-pointer transition-colors">Solutions</span>
              <span className="hover:text-black cursor-pointer transition-colors">Pricing</span>
            </div>
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
            <button className="secondary-button px-10 py-4 text-base">
              Watch video
            </button>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className="max-w-6xl mx-auto px-6 mb-40 animate-in">
          <div className="relative p-4 md:p-8 bg-bg-secondary rounded-[2.5rem] border border-border-color shadow-2xl overflow-hidden group">
            {/* The "Blue Interior" from reference */}
            <div className="aspect-[16/10] bg-[#0052FF] rounded-[1.5rem] relative overflow-hidden flex flex-col p-12">
              <div className="flex justify-between items-start mb-12 text-white/90">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-semibold">
                  <Layout className="w-4 h-4" /> Portfolio
                </div>
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0052FF] bg-white/20"></div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center relative text-white">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                
                <div className="relative text-center space-y-8 max-w-lg">
                  <div className="flex justify-center gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-[11px] font-bold tracking-widest uppercase">Auto-Capture</div>
                    <div className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-[11px] font-bold tracking-widest uppercase">Real-Time Policy</div>
                  </div>
                  
                  <h3 className="text-3xl font-bold italic serif-heading">How it works</h3>
                  <p className="text-white/70 text-sm font-medium leading-relaxed">
                    WarrantySys turns manual claim processing into continuous, verified financial control and service improvement.
                  </p>
                </div>

                {/* Simulated Floating Elements */}
                <div className="absolute top-10 left-10 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="absolute bottom-20 right-20 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                  <Zap className="w-5 h-5 text-yellow-300" />
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

      {/* Floating Bottom Bar (from reference) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-border-color rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-50">
        <span className="text-[11px] font-bold text-text-secondary">Ask Al about WarrantySys:</span>
        <div className="flex gap-4">
          <Zap className="w-4 h-4 opacity-40" />
          <Globe className="w-4 h-4 opacity-40" />
          <Layout className="w-4 h-4 opacity-40" />
        </div>
      </div>

    </div>
  );
};

export default Landing;
