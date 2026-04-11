import { Link } from 'react-router-dom';
import { 
  ShieldCheck, ArrowRight, Shield, Globe, 
  Activity, Database, CheckCircle, Terminal,
  Cpu, Zap, CreditCard
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-brand/20 bg-[#0F172A] text-[#E2E8F0] overflow-hidden relative">
      
      {/* Radial Gradient Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3B82F6]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#6366F1]/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '12s' }}></div>
      </div>

      {/* Top Navbar */}
      <header className="w-full px-8 md:px-16 py-5 flex justify-between items-center z-50 sticky top-0 bg-[#0F172A]/70 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="bg-gradient-to-tr from-[#3B82F6] to-[#6366F1] p-1.5 rounded-lg shadow-lg">
             <ShieldCheck className="w-6 h-6 text-white" />
           </div>
           <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-widest uppercase">WarrantySys</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-10 text-sm font-semibold text-[#94A3B8]">
           <span className="hover:text-white cursor-pointer transition-colors relative group">
             Platform
             <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full"></span>
           </span>
           <span className="hover:text-white cursor-pointer transition-colors relative group">
             Solutions
             <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full"></span>
           </span>
           <span className="hover:text-white cursor-pointer transition-colors relative group">
             Compliance
             <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-[#3B82F6] transition-all duration-300 group-hover:w-full"></span>
           </span>
        </nav>

        <div className="flex items-center gap-6">
           <Link to="/login" className="text-sm font-bold text-[#94A3B8] hover:text-white transition-colors cursor-pointer">Log in</Link>
           <Link to="/signup" className="text-sm font-bold text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-all border border-white/10">Start Free</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col w-full relative z-10">
        
        <section className="px-6 py-20 lg:py-32 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center lg:text-left z-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#6366F1] bg-[#6366F1]/10 border border-[#6366F1]/20 mb-8 w-max mx-auto lg:mx-0">
               <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse"></span>
               Next-Gen Infrastructure
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1] drop-shadow-2xl">
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#6366F1] drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]">Unified Warranty</span><br/>Platform
            </h1>
            
            <p className="text-[#94A3B8] text-lg md:text-xl mb-10 max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
              Transform product lifecycles with encrypted claims, automated technician dispatch, and zero-latency hardware validations.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start w-full">
              <Link to="/signup" className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] text-white px-8 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_40px_rgba(59,130,246,0.5)] hover:scale-[1.02] transition-all duration-300 border-none">
                Start Building <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
          </div>

          {/* Right: Glass Mockup Card */}
          <div className="flex-1 w-full max-w-lg lg:max-w-xl relative group">
             {/* Glow behind card */}
             <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6] to-[#6366F1] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700 rounded-3xl"></div>
             
             {/* The Glass Panel */}
             <div className="relative bg-white/[0.05] backdrop-blur-[20px] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-500">
                
                {/* Mockup Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-blue-400" />
                     </div>
                     <div>
                       <div className="font-bold text-white text-lg">System Status</div>
                       <div className="text-xs text-[#94A3B8] font-mono">LIVE // 99.99% UPTIME</div>
                     </div>
                   </div>
                   <div className="w-16 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   </div>
                </div>

                {/* Mockup Active Service Run */}
                <div className="space-y-4">
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-[#94A3B8]" />
                        <div>
                           <div className="text-sm font-bold text-[#E2E8F0]">Hardware Sync</div>
                           <div className="text-[10px] text-[#3B82F6] uppercase tracking-widest mt-1">Validated</div>
                        </div>
                     </div>
                     <span className="text-xs font-mono text-[#94A3B8]">0.02ms</span>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden">
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6366F1]"></div>
                     <div className="flex items-center gap-3 pl-2">
                        <Activity className="w-5 h-5 text-[#6366F1]" />
                        <div>
                           <div className="text-sm font-bold text-[#E2E8F0]">Service Request #892</div>
                           <div className="text-[10px] text-orange-400 uppercase tracking-widest mt-1 animate-pulse">Processing Dispatch</div>
                        </div>
                     </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#94A3B8]" />
                        <div>
                           <div className="text-sm font-bold text-[#E2E8F0]">Technician Routing</div>
                           <div className="text-[10px] text-[#94A3B8] uppercase tracking-widest mt-1">Pending Assignment</div>
                        </div>
                     </div>
                  </div>
                </div>

             </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-32 px-6 relative z-10 max-w-[1400px] mx-auto w-full">
           <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight drop-shadow-sm text-white">Engineered for Scale</h2>
             <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto font-medium">Modular architecture designed to handle thousands of concurrent queries.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Warranty Tracking', desc: 'Real-time cryptographic logging of purchase dates and entitlement boundaries.', icon: ShieldCheck, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { title: 'Service Requests', desc: 'Automated workflow pipelines for rapid intake and diagnostic categorization.', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                { title: 'Technician Engine', desc: 'Spatially-aware dispatching system bridging admins and field engineers.', icon: Terminal, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { title: 'Payment Handling', desc: 'Direct cost settlement, ledger integrations, and seamless invoicing.', icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
              ].map((f, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-[10px] border border-white/5 p-8 rounded-3xl hover:-translate-y-2 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${f.bg} group-hover:scale-110 transition-transform`}>
                      <f.icon className={`w-6 h-6 ${f.color}`} />
                   </div>
                   <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{f.title}</h3>
                   <p className="text-[#94A3B8] text-sm font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </section>

      </main>
    </div>
  );
};

export default Landing;
