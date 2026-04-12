import { Link } from 'react-router-dom';
import { 
  Play, Settings, Bell, User, MapPin, ShieldCheck, 
  CreditCard, ArrowRight, BarChart3, ChevronRight, Activity, Zap, Globe
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen font-sans bg-mesh text-[#0F172A] overflow-x-hidden">
      
      {/* Top Navbar */}
      <header className="w-full px-8 py-5 flex justify-between items-center glass-panel sticky top-0 z-50 border-b border-white/20">
        <div className="flex items-center gap-14">
           <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
              <div className="bg-brand p-2.5 rounded-xl shadow-lg shadow-brand/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-primary tracking-tight">Warranty<span className="text-brand">Sys</span></span>
           </Link>
           
           <nav className="hidden lg:flex items-center gap-10 text-[13px] font-bold uppercase tracking-widest text-secondary">
             <span className="text-brand cursor-pointer relative py-2">
               Enterprise
               <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand rounded-full"></span>
             </span>
             <span className="hover:text-primary cursor-pointer transition-colors px-2 py-2">Products</span>
             <span className="hover:text-primary cursor-pointer transition-colors px-2 py-2">Solutions</span>
             <span className="hover:text-primary cursor-pointer transition-colors px-2 py-2">Pricing</span>
           </nav>
        </div>
        
        <div className="flex items-center gap-8">
           <span className="hidden md:block text-[13px] font-bold text-secondary hover:text-primary cursor-pointer uppercase tracking-widest">Support</span>
           <div className="flex items-center gap-5">
             <Link to="/login" className="px-6 py-2.5 bg-primary text-bg-primary rounded-xl font-bold text-[12px] uppercase tracking-widest hover:bg-brand transition-all">
               Login
             </Link>
             <Link to="/signup" className="primary-button px-6 py-2.5 text-[12px] font-bold">
               Join Now
             </Link>
           </div>
        </div>
      </header>

      <main className="flex flex-col w-full">
        
        {/* Dynamic Hero Section */}
        <section className="px-6 pt-32 pb-24 max-w-6xl mx-auto w-full text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-brand bg-brand-soft mx-auto mb-10 border border-brand/10 shadow-sm animate-in">
             <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></span>
             The Standard for Modern Warranty
          </div>
          
          <h1 className="heading-xl text-primary mb-8 animate-in" style={{ animationDelay: '0.1s' }}>
             Unified <span className="text-brand">Warranty</span> Infrastructure.
          </h1>
          
          <p className="text-secondary text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-90 animate-in" style={{ animationDelay: '0.2s' }}>
            Enterprise-grade platform for automated service claims and data-driven product lifecycle management. Scale trust, globally.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/signup" className="primary-button px-10 py-4 w-full sm:w-auto text-[13px] font-bold">
              Build your infrastructure <ArrowRight className="w-4 h-4"/>
            </Link>
            <button className="bg-bg-secondary text-primary border border-border-color px-10 py-4 rounded-xl font-bold text-[13px] shadow-sm hover:bg-bg-primary transition-all w-full sm:w-auto flex items-center justify-center gap-2">
              <Play className="w-4 h-4 text-brand fill-brand/10"/> System Overview
            </button>
          </div>
        </section>

        {/* Premium Dashboard Preview */}
        <section className="w-full px-6 pb-32 relative z-20 flex justify-center">
            <div className="w-full max-w-6xl glass-card overflow-hidden flex border-border-color animate-in" style={{ animationDelay: '0.4s' }}>
               {/* Side Panel Mockup */}
               <div className="w-56 bg-bg-secondary border-r border-border-color p-6 hidden lg:block">
                  <div className="flex items-center gap-2.5 mb-10 px-2">
                    <div className="bg-brand p-1.5 rounded-lg shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-primary tracking-tight">Warranty<span className="text-brand">Sys</span></span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-brand-soft text-brand px-4 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 border border-brand/10 shadow-sm">
                      <BarChart3 className="w-4 h-4" /> Dashboard
                    </div>
                    <div className="text-secondary px-4 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-bg-primary transition-colors">
                      <ShieldCheck className="w-4 h-4" /> Products
                    </div>
                  </div>
               </div>
               
               {/* Main Canvas Mockup */}
               <div className="flex-1 p-10 bg-bg-primary">
                 <div className="flex justify-between items-start mb-10">
                   <div>
                     <h3 className="font-bold text-primary text-2xl tracking-tight">Overview</h3>
                     <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">Live Telemetry</p>
                   </div>
                 </div>
-
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-48">
                    <div className="col-span-2 border border-border-color rounded-2xl p-6 relative bg-bg-secondary">
                       <div className="flex items-end gap-2.5 h-24 mt-6">
                         <div className="flex-1 bg-brand/10 h-[40%] rounded-lg"></div>
                         <div className="flex-1 bg-brand/20 h-[60%] rounded-lg"></div>
                         <div className="flex-1 bg-brand/30 h-[50%] rounded-lg"></div>
                         <div className="flex-1 bg-brand/40 h-[80%] rounded-lg"></div>
                         <div className="flex-1 bg-brand h-[100%] rounded-lg shadow-lg shadow-brand/20"></div>
                         <div className="flex-1 bg-brand/40 h-[70%] rounded-lg"></div>
                         <div className="flex-1 bg-brand/30 h-[55%] rounded-lg"></div>
                       </div>
                    </div>
                    <div className="bg-brand rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                       <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Efficiency</div>
                       <div className="text-5xl font-bold mb-2 tracking-tighter">98.2%</div>
                       <div className="h-1.5 w-full bg-white/20 rounded-full"><div className="h-full bg-white w-[92%] rounded-full shadow-[0_0_8px_white]"></div></div>
                    </div>
                 </div>
               </div>
            </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-bg-primary py-32 px-6 relative z-10 border-t border-border-color">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-20">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand mb-4">Core Ecosystem</div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight leading-tight">Precision Engineering for <br/><span className="text-brand">Post-Purchase.</span></h2>
              </div>
              <p className="text-secondary max-w-sm font-medium leading-relaxed opacity-80">
                World's most advanced claim infrastructure. Built for enterprise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {[
                 { icon: MapPin, title: "Smart Tracking", color: "brand", desc: "Real-time lifecycle monitoring with predictive failure analysis." },
                 { icon: ShieldCheck, title: "Automated Claims", color: "brand", desc: "AI-driven validation reduces manual review time by 85%." },
                 { icon: CreditCard, title: "Instant Payments", color: "brand", desc: "Global payout infrastructure supporting instant bank transfers." }
               ].map((feature, i) => (
                 <div key={i} className="group p-10 rounded-[2rem] bg-bg-secondary border border-border-color hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                    <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-8 shadow-sm">
                      <feature.icon className="w-7 h-7"/>
                    </div>
                    <h4 className="font-bold text-primary text-xl mb-4 tracking-tight">{feature.title}</h4>
                    <p className="text-secondary text-[15px] leading-relaxed mb-8 opacity-80">{feature.desc}</p>
                    <div className="w-10 h-1 bg-brand/20 rounded-full group-hover:w-20 transition-all"></div>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-[#0F172A] text-white py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-10 pointer-events-none"></div>
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between gap-24 relative z-10">
            
            <div className="flex-1">
              <h2 className="text-5xl font-black mb-8 tracking-tighter italic">The infrastructure<br/><span className="text-[#2563EB] not-italic border-b-4 border-blue-500 pb-2">for trust.</span></h2>
              <p className="text-[#94A3B8] max-w-sm mb-12 text-lg font-medium leading-relaxed opacity-80">
                We handle the complexity of compliance, validation, and fulfillment so you can deliver a premium brand experience at every touchpoint.
              </p>
              <button className="primary-button px-10 py-4 shadow-blue-500/10">
                Request Protocol Access
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-6">
              {[
                { val: "2.4M", label: "Claims Processed" },
                { val: "140+", label: "Global Partners" },
                { val: "85%", label: "Fast Resolution" },
                { val: "$1.2B", label: "Warranties Managed" }
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] flex flex-col justify-center hover:bg-white/10 transition-colors">
                   <div className="text-4xl font-black text-[#2563EB] mb-2 tracking-tighter">{stat.val}</div>
                   <div className="text-[10px] uppercase tracking-[0.3em] text-[#94A3B8] font-black">{stat.label}</div>
                </div>
              ))}
            </div>
            
          </div>
        </section>

        {/* Improved Footer */}
        <footer className="bg-bg-secondary py-24 px-6 border-t border-border-color">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
            <div className="col-span-1 md:col-span-1 text-primary">
              <div className="font-bold text-2xl mb-6 flex items-center gap-2.5">
                <div className="p-1.5 bg-brand rounded-lg"><ShieldCheck className="w-5 h-5 text-white"/></div>
                Warranty<span className="text-brand">Sys</span>
              </div>
              <p className="text-sm font-medium text-secondary mb-8 leading-relaxed opacity-80">
                Redefining the warranty experience with intelligent infrastructure and data-driven insights. Built for enterprise.
              </p>
            </div>
            
            {[
              { title: "Platform", links: ["Dashboard", "API Protocol", "Integrations", "Security"] },
              { title: "Company", links: ["About", "Careers", "Internal Blog", "Press"] },
              { title: "Support", links: ["Protocol Documentation", "Community Hub", "Enterprise Contact"] }
            ].map((col, i) => (
              <div key={i}>
                <h5 className="font-bold text-primary text-[11px] uppercase tracking-widest mb-8">{col.title}</h5>
                <ul className="space-y-4">
                  {col.links.map(link => (
                    <li key={link} className="text-sm font-bold text-secondary hover:text-brand cursor-pointer transition-colors opacity-80">{link}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="max-w-6xl mx-auto mt-24 pt-10 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[11px] font-bold text-secondary uppercase tracking-widest">© 2024 WarrantySys Technologies Inc. Verified for Enterprise</p>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default Landing;
