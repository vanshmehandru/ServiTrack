import { Link } from 'react-router-dom';
import { ShieldAlert, Cpu, BarChart3, Globe, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-blue/20 bg-primary text-primary">
      
      {/* Navigation Header */}
      <header className="w-full px-12 py-8 flex justify-between items-center z-20 bg-secondary border-b border-std">
        <div className="text-2xl font-black flex items-center gap-3 text-primary">
          <div className="p-2 flex items-center justify-center rounded-xl bg-primary border-std border">
             <ShieldAlert className="text-brand w-6 h-6" />
          </div>
          <span className="tracking-tighter">Warranty<span className="font-light">Sys</span></span>
        </div>
        <div className="flex items-center gap-6">
           <Link to="/login" className="text-sm font-bold text-secondary hover:text-primary transition-colors uppercase tracking-widest text-[10px]">Login</Link>
           <Link to="/signup" className="px-6 py-2.5 rounded-lg bg-brand-blue text-white hover:opacity-90 transition-all font-bold text-xs uppercase tracking-widest border-none">Sign Up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full text-[10px] font-bold uppercase tracking-widest mb-8 text-brand animate-in fade-in slide-in-from-bottom-4 shadow-sm border border-std">
           <Globe className="w-3 h-3" />
           Global Warranty Standards
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-8 text-primary tracking-tight leading-[1] max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
           Institutional-Grade <br /> 
           <span className="text-brand">Asset Management.</span>
        </h1>
        
        <p className="text-secondary text-lg mb-12 max-w-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
          Simplify your product lifecycle tracking, validate warranties in real-time, and manage service requests through a single unified portal.
        </p>

        <div className="flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000">
           <Link to="/signup" className="px-10 py-4 rounded-xl text-white font-bold text-sm uppercase tracking-widest transition-all shadow-md flex items-center gap-3 active:scale-95 border-none" style={{backgroundColor: "var(--brand-blue)"}}>
             Get Started <ChevronRight className="w-5 h-5" />
           </Link>
           <Link to="/login" className="px-10 py-4 rounded-xl bg-secondary text-primary border border-std font-bold text-sm uppercase tracking-widest hover:bg-hover transition-all active:scale-95 text-center flex items-center justify-center shadow-sm">
             Login to Portal
           </Link>
        </div>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-32 px-4 animate-in fade-in slide-in-from-bottom-20 duration-1000">
           {[
             { title: 'Asset Ledger', desc: 'Secure tracking of every hardware asset you purchase.', icon: Cpu },
             { title: 'Service Requests', desc: 'Fast turnaround diagnostics with transparent tracking.', icon: BarChart3 },
             { title: 'Warranty Validation', desc: 'Automatic validation logic ensuring zero costs when under term.', icon: ShieldAlert }
           ].map((f, i) => (
             <div key={i} className="std-card p-10 text-left hover:-translate-y-1 transition-transform duration-300">
                <div className="w-14 h-14 bg-primary border-std border rounded-2xl flex items-center justify-center mb-8">
                   <f.icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="text-xl font-black mb-3 text-primary">{f.title}</h3>
                <p className="text-secondary font-medium leading-relaxed">{f.desc}</p>
             </div>
           ))}
        </section>
      </main>

      {/* Footer Info */}
      <footer className="w-full px-12 py-10 border-t border-std flex flex-col md:flex-row justify-between items-center text-secondary text-[10px] font-bold uppercase tracking-widest gap-8 bg-secondary mt-20 z-20">
         <div className="flex items-center gap-4">
            <span>© 2026 WarrantySys</span>
            <div className="w-1 h-1 bg-secondary rounded-full"></div>
            <span>Enterprise Distribution</span>
         </div>
         <div className="flex gap-8">
            <span className="hover:text-brand cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-brand cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-brand cursor-pointer transition-colors">Contact</span>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
