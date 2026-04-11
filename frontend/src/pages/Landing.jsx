import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Activity, Globe, Archive, Shield, Database } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand/20 bg-primary text-primary">
      
      {/* Top Navbar */}
      <header className="w-full px-12 py-6 flex justify-between items-center z-20 bg-secondary sticky top-0 border-b border-std shadow-sm">
        <div className="text-xl font-black text-brand tracking-widest uppercase">
          Warrantysys
        </div>
        
        <div className="flex items-center gap-6">
           <Link to="/login" className="px-8 py-3 rounded bg-brand text-white hover:bg-brand-hover transition-all font-bold text-xs uppercase tracking-widest border-none shadow-sm">Login</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col w-full">
        
        {/* Top Header Split */}
        <section className="flex-1 flex flex-col items-center justify-center px-6 py-28 text-center bg-gradient-to-b from-white to-[#f8fafc]">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#eaf4ed] rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-10 text-[#0f8a4a]">
              <MapPin className="w-3 h-3" />
              Institutional Grade Reliability
           </div>

           <h1 className="text-5xl md:text-7xl font-black mb-6 text-primary tracking-tight leading-[1.05] max-w-4xl mx-auto">
              Enterprise Warranty & <br />Service Claim <br />Management
           </h1>
           
           <p className="text-secondary text-[15px] mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
             Streamlining product lifecycles, service requests, and warranty validation for high-end assets. Secure your service operations with our multi-layered management infrastructure.
           </p>

           <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/login" className="px-8 py-3.5 rounded bg-brand text-white font-bold text-xs transition-colors hover:bg-brand-hover border-none text-center min-w-[200px]">
                Start Managing Claims
              </Link>
              <Link to="/login" className="px-8 py-3.5 rounded bg-[#e2e8f0] text-primary font-bold text-xs hover:bg-[#cbd5e1] transition-colors text-center min-w-[200px] border-none">
                Login to Portal
              </Link>
           </div>
        </section>

        {/* Feature Cards Section */}
        <section className="bg-[#f3f4f6] py-24 px-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
              {[
                { title: 'Automated Claims', desc: 'AI-driven claim validation and automated approval workflows that reduce processing time by up to 80% across your network.', icon: Activity },
                { title: 'Warranty Tracking', desc: 'Comprehensive lifecycle monitoring from purchase to expiration, ensuring global compliance and accurate service entitlement.', icon: Globe },
                { title: 'Secure Service Records', desc: 'Encryption-backed digital service logs and multi-signature governance for immutable proof of maintenance and repair history.', icon: Archive }
              ].map((f, i) => (
                <div key={i} className="bg-white p-10 text-left border border-std rounded hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                   <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center mb-8">
                      <f.icon className="w-5 h-5 text-brand" />
                   </div>
                   <h3 className="text-lg font-black mb-3 text-primary">{f.title}</h3>
                   <p className="text-secondary text-[13px] font-medium leading-relaxed">{f.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Compliance Section */}
        <section className="py-20 px-6 bg-white text-center">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-10">Compliance & Global Standards</p>
           <div className="flex flex-wrap justify-center gap-16 items-center max-w-4xl mx-auto">
              <div className="flex items-center gap-3 text-secondary font-bold text-sm">
                 <ShieldCheck className="w-6 h-6 text-[#64748b]" /> ISO 27001
              </div>
              <div className="flex items-center gap-3 text-secondary font-bold text-sm">
                 <Shield className="w-6 h-6 text-[#64748b]" /> GDPR Compliant
              </div>
              <div className="flex items-center gap-3 text-secondary font-bold text-sm">
                 <ShieldCheck className="w-6 h-6 text-[#64748b]" /> SOC2 Type II
              </div>
              <div className="flex items-center gap-3 text-secondary font-bold text-sm">
                 <Database className="w-6 h-6 text-[#64748b]" /> FINRA Regulated
              </div>
           </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="py-20 px-6 bg-white">
           <div className="max-w-6xl mx-auto bg-brand rounded-2xl p-16 md:p-24 text-center text-white relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to secure your <br/>institutional legacy?</h2>
                <p className="text-blue-100 text-[15px] font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                  Join over 400 global enterprises who trust WarrantySys for their primary service management and warranty validation needs.
                </p>
                <Link to="/login" className="px-10 py-4 rounded bg-white text-brand font-black text-sm transition-all hover:bg-gray-100 uppercase tracking-widest inline-block shadow-lg">
                  Access Enterprise Portal
                </Link>
             </div>
           </div>
        </section>

      </main>

      {/* Footer Info */}
      <footer className="w-full px-12 py-10 flex flex-col md:flex-row justify-between items-center text-[#94a3b8] bg-[#f8fafc] border-t border-std gap-8 text-[9px] font-black uppercase tracking-[0.2em]">
         <div className="flex flex-col items-start gap-2">
            <span className="text-brand text-sm tracking-widest">WARRANTYSYS</span>
            <span className="max-w-md leading-relaxed">© 2026 WARRANTYSYS. ENTERPRISE WARRANTY & SERVICE CLAIM MANAGEMENT. PROTECTED BY 256-BIT ENCRYPTION.</span>
         </div>
         <div className="flex gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors block">Privacy Policy</span>
            <span className="hover:text-primary cursor-pointer transition-colors block">Regulatory Disclosure</span>
            <span className="hover:text-primary cursor-pointer transition-colors block">Terms of Service</span>
            <span className="hover:text-primary cursor-pointer transition-colors block">Security Architecture</span>
            <span className="hover:text-primary cursor-pointer transition-colors block">Global Support</span>
         </div>
      </footer>
    </div>
  );
};

export default Landing;
