import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Shield, Globe, Activity, Database, CheckCircle } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand/20">
      
      {/* Top Navbar */}
      <header className="w-full px-8 md:px-12 py-4 flex justify-between items-center z-50 sticky top-0 nav-glass">
        <div className="flex items-center gap-2">
           <div className="bg-brand text-white p-1.5 rounded-lg">
             <ShieldCheck className="w-6 h-6" />
           </div>
           <span className="text-xl font-black text-brand tracking-widest uppercase">WarrantySys</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-secondary uppercase tracking-widest">
           <span className="hover:text-primary cursor-pointer transition-colors">Platform</span>
           <span className="hover:text-primary cursor-pointer transition-colors">Solutions</span>
           <span className="hover:text-primary cursor-pointer transition-colors">Compliance</span>
           <span className="hover:text-primary cursor-pointer transition-colors">Pricing</span>
        </nav>

        <div className="flex items-center gap-4">
           <Link to="/login" className="text-xs font-bold text-secondary hover:text-primary transition-colors cursor-pointer uppercase tracking-widest">Login</Link>
           <Link to="/signup" className="std-btn text-xs tracking-widest uppercase px-6 py-2">Start Free</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col w-full relative">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        {/* Top Header Glass Container */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-32 text-center relative z-10 w-full max-w-5xl mx-auto">
           <div className="glass-card mb-10 px-4 py-2 inline-flex items-center gap-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-brand border border-brand/20">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              SaaS Warranty Operations
           </div>

           <h1 className="text-5xl md:text-7xl font-black mb-6 text-primary tracking-tight leading-[1.05] drop-shadow-sm">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Unified Warranty</span><br/>& Service Claims
           </h1>
           
           <p className="text-secondary text-lg mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
             Validate warranties seamlessly, process claims instantly, and track end-to-end product lifecycles in our high-fidelity, secure cloud environment.
           </p>

           <div className="flex flex-col md:flex-row gap-4 justify-center w-full max-w-md mx-auto">
              <Link to="/signup" className="std-btn py-4 text-sm flex items-center justify-center gap-2 flex-1">
                Start Managing <ArrowRight className="w-4 h-4"/>
              </Link>
           </div>
        </section>

        {/* Feature Cards Section */}
        <section className="py-24 px-6 relative z-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
              {[
                { title: 'Automated Approvals', desc: 'Accelerate the entire claims lifecycle with AI-driven rules logic and background checks.', icon: Activity },
                { title: 'Global Database', desc: 'Secure compliance ledgers and instantaneous serial validations across any continent.', icon: Globe },
                { title: 'Encrypted Records', desc: 'Military-grade storage securing proof of maintenance, receipts, and historical data.', icon: Database }
              ].map((f, i) => (
                <div key={i} className="glass-card p-10 text-left hover:-translate-y-2 group">
                   <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <f.icon className="w-6 h-6 text-brand" />
                   </div>
                   <h3 className="text-xl font-black mb-3 text-primary">{f.title}</h3>
                   <p className="text-secondary text-sm font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 px-6 text-center z-10">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-10">Trusted & Audited by the Best</p>
           <div className="flex flex-wrap justify-center gap-12 items-center max-w-4xl mx-auto">
              {['ISO 27001', 'SOC2 Type II', 'GDPR Compliant'].map((cert, i) => (
                <div key={i} className="glass-card px-6 py-3 flex items-center gap-3 text-secondary font-bold text-sm rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-500" /> {cert}
                </div>
              ))}
           </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
