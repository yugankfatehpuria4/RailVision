import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Zap, Shield, Satellite, Layers, Activity, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-hidden relative selection:bg-cyan-500/30">
      {/* Premium Futuristic Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[70%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[70%] h-[50%] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#020617]/50 backdrop-blur-2xl border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
              <Satellite className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">
              RAIL<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">VISION</span>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
              <Link to="/platform" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">Platform</Link>
              <a href="#features" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">Capabilities</a>
              <a href="#workflow" className="hover:text-cyan-400 transition-colors uppercase tracking-widest">Intelligence</a>
            </div>
            <Link to="/dashboard">
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 rounded-full px-8 font-bold transition-all hover:scale-105 active:scale-95">
                LAUNCH SYSTEM
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            System Online • Neural Link Established
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-white">
            NEXT-GEN <br/>
            <span className="relative inline-block mt-2">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">CYBER-SPATIAL</span>
              <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            Autonomous geospatial intelligence for global infrastructure. Real-time threat detection, asset monitoring, and predictive analytics powered by deep-space neural engines.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link to="/dashboard">
              <Button size="lg" className="bg-white hover:bg-slate-100 text-black gap-2 w-full sm:w-auto rounded-full px-10 h-16 text-lg font-black shadow-2xl shadow-cyan-500/10 transition-all hover:-translate-y-1">
                ACCESS COMMAND CENTER
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto rounded-full px-10 h-16 text-lg font-bold shadow-sm transition-all hover:-translate-y-1 backdrop-blur-md">
              VIEW MISSION SPECS
            </Button>
          </div>

          {/* Dynamic Stats Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-20 max-w-5xl mx-auto">
            {[
              { value: '99.9%', label: 'Neural Accuracy', trend: '+2.4%', icon: Cpu },
              { value: 'μ-sec', label: 'Latency', trend: 'Ultra-Low', icon: Zap },
              { value: '1.2M+', label: 'Geo-Assets', trend: 'Global', icon: MapPin },
              { value: 'Fully', label: 'Automated', trend: 'AI-Core', icon: Activity },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl p-8 text-left hover:bg-white/10 transition-all group cursor-default">
                <stat.icon className="w-8 h-8 text-cyan-400 mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                <p className="text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                  <span className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-lg">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-40 px-6 relative z-10 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black mb-6 text-white tracking-tighter uppercase">Operational Core</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto font-light">Deep-integrated intelligence across every segment of your infrastructure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Large Card 1 */}
            <Card className="md:col-span-2 bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border-white/5 p-12 rounded-[3rem] relative overflow-hidden group hover:shadow-[0_0_50px_-12px_rgba(6,182,212,0.2)] transition-all duration-700 backdrop-blur-md">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Satellite className="w-64 h-64 text-cyan-400" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-cyan-500 text-black rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-cyan-500/40">
                  <Satellite className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-black mb-4 text-white tracking-tighter uppercase">NEURAL FUSION</h3>
                <p className="text-slate-400 max-w-md text-xl leading-relaxed font-light">
                  Real-time synchronization of multi-spectral orbital data and tactical UAV streams for absolute visibility.
                </p>
              </div>
            </Card>

            {/* Small Card 1 */}
            <Card className="bg-white/5 border-white/5 p-12 rounded-[3rem] hover:bg-white/10 transition-all duration-500 backdrop-blur-md group">
              <div className="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white tracking-tighter uppercase">CYBER SHIELD</h3>
              <p className="text-slate-500 leading-relaxed font-light">
                Automated perimeter defense and encroachment suppression using advanced ML segmentation.
              </p>
            </Card>

            {/* Small Card 2 */}
            <Card className="bg-white/5 border-white/5 p-12 rounded-[3rem] hover:bg-white/10 transition-all duration-500 backdrop-blur-md group">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-white tracking-tighter uppercase">VITAL METRICS</h3>
              <p className="text-slate-500 leading-relaxed font-light">
                Continuous health telemetry for structural assets with predictive failure modeling.
              </p>
            </Card>

            {/* Large Card 2 */}
            <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-black border-white/5 p-12 rounded-[3rem] relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
              <div className="relative z-10 text-white">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/10">
                  <Layers className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-4xl font-black mb-4 tracking-tighter uppercase">TEMPORAL SHIFT ANALYSIS</h3>
                <p className="text-slate-400 max-w-lg text-xl leading-relaxed mb-8 font-light">
                  Analyze deep-historical data to visualize geological shifts, structural fatigue, and environmental evolution.
                </p>
                <div className="inline-flex items-center text-cyan-400 font-black tracking-widest text-xs cursor-pointer group-hover:text-cyan-300 transition-colors uppercase">
                  ENTER SIMULATION <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Intelligence Workflow */}
      <section id="workflow" className="py-40 px-6 bg-[#0a0f1d] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                Mission Workflow
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] uppercase">
                RAW PIXELS TO <br/>
                <span className="text-cyan-400">DECISION INTEL</span>
              </h2>
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                Our proprietary vision engines process petabytes of geospatial data, delivering high-confidence intelligence directly to command consoles.
              </p>
              
              <div className="space-y-8 pt-6">
                {[
                  { title: 'Ingest', desc: 'Secure uplink of GeoTIFF or standard multi-spectral streams.' },
                  { title: 'Neural Scan', desc: 'AI-Core segmentation and classification of all network assets.' },
                  { title: 'Deployment', desc: 'Instant transmission of critical alerts to tactical response teams.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 text-cyan-400 flex items-center justify-center font-black text-xl flex-shrink-0 border border-white/5 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                      0{i+1}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">{step.title}</h4>
                      <p className="text-slate-500 font-light">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup / Abstract visual */}
            <div className="relative h-[700px] w-full rounded-[4rem] bg-black overflow-hidden shadow-[0_0_100px_-20px_rgba(6,182,212,0.3)] border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-[#0a0f1d] to-black flex items-center justify-center">
                <div className="w-full h-full p-12 flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="w-4 h-4 rounded-full bg-rose-500 animate-pulse"></div>
                      <div className="w-32 h-4 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-cyan-400 animate-spin" style={{animationDuration: '4s'}} />
                    </div>
                  </div>
                  <div className="flex-1 my-12 relative rounded-3xl border border-white/5 bg-white/5 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[2px] bg-cyan-500/20 blur-sm animate-[scandn_4s_infinite]"></div>
                    
                    <MapPin className="w-20 h-20 text-cyan-400 absolute animate-bounce" style={{top: '30%', left: '40%'}} />
                    <div className="absolute top-[30%] left-[40%] w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
                    
                    <Shield className="w-16 h-16 text-rose-500 absolute" style={{top: '60%', left: '70%'}} />
                    <div className="absolute top-[60%] left-[70%] w-32 h-32 bg-rose-500/10 rounded-full blur-2xl"></div>
                  </div>
                  <div className="h-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl p-6 flex gap-6 items-center">
                    <div className="h-full aspect-square bg-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Zap className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="w-3/4 h-4 bg-white/20 rounded-full"></div>
                      <div className="w-1/2 h-4 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800 rounded-[4rem] p-16 md:p-32 text-center text-white shadow-[0_0_100px_-20px_rgba(6,182,212,0.5)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-1000"></div>
            <div className="relative z-10 space-y-12">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">Command <br/> The Future.</h2>
              <p className="text-cyan-50 text-xl md:text-3xl max-w-3xl mx-auto font-light leading-relaxed">
                Join the elite infrastructure networks utilizing RailVision AI for total tactical dominance.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-black gap-4 rounded-full px-16 h-20 text-2xl font-black shadow-2xl transition-all hover:scale-110 active:scale-95 uppercase tracking-tighter">
                  LAUNCH COMMAND CENTER
                  <ArrowRight className="w-8 h-8" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020617] border-t border-white/5 py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Satellite className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white uppercase">RAIL<span className="text-cyan-400">VISION</span></span>
          </div>
          <div className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} NEURAL SYSTEMS CORP. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-cyan-400 transition-colors">INTEL DOCS</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">PRIVACY PROTOCOL</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">SYSTEM TERMS</a>
          </div>
        </div>
      </footer>
    </div>

  );
}
