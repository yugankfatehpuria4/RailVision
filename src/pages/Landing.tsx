import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Zap, Shield, Satellite, Layers, Activity, Cpu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-cyan-300/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-300/15 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Light Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-50"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Rail<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Vision</span>
            </span>
          </div>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link to="/platform" className="hover:text-blue-600 transition">Platform</Link>
              <a href="#features" className="hover:text-blue-600 transition">Capabilities</a>
              <a href="#workflow" className="hover:text-blue-600 transition">Intelligence</a>
            </div>
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 rounded-full px-6 font-medium transition-all hover:scale-105 active:scale-95">
                Launch System
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-widest mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Online • Processing Delhi Zone
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-slate-900">
            Next-Generation <br/>
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">Geospatial Intelligence</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-cyan-400/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Harness the power of AI-driven satellite and drone imagery to instantly detect encroachments, monitor asset health, and secure global railway infrastructure.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/dashboard">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white gap-2 w-full sm:w-auto rounded-full px-8 h-14 text-base shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1">
                Access Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-slate-200 bg-white hover:bg-slate-50 text-slate-700 w-full sm:w-auto rounded-full px-8 h-14 text-base shadow-sm transition-all hover:-translate-y-1">
              View Analytics Demo
            </Button>
          </div>

          {/* Dynamic Stats Bento */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-16 max-w-4xl mx-auto">
            {[
              { value: '99.8%', label: 'AI Accuracy', trend: '+2.4%', icon: Cpu },
              { value: 'Real-time', label: 'Processing', trend: '< 500ms', icon: Zap },
              { value: '500k+', label: 'Km Monitored', trend: 'Global', icon: MapPin },
              { value: 'Zero', label: 'Manual Scans', trend: 'Automated', icon: Activity },
            ].map((stat, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 text-left shadow-sm hover:shadow-md transition-shadow group">
                <stat.icon className="w-6 h-6 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">{stat.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="py-32 px-6 relative z-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 text-slate-900 tracking-tight">Enterprise Capabilities</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">A unified platform combining GIS, artificial intelligence, and real-time alerts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large Card 1 */}
            <Card className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-100 p-8 rounded-3xl relative overflow-hidden group border-0 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Satellite className="w-40 h-40 text-blue-600" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30">
                  <Satellite className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900">Multi-Modal Ingestion</h3>
                <p className="text-slate-600 max-w-md text-lg leading-relaxed">
                  Seamlessly fuse multi-spectral satellite imagery, drone footage, and LiDAR data to build a comprehensive digital twin of your network.
                </p>
              </div>
            </Card>

            {/* Small Card 1 */}
            <Card className="bg-white border-slate-200 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border shadow-sm">
              <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Encroachment Shield</h3>
              <p className="text-slate-600 leading-relaxed">
                Automatically detect unauthorized constructions and vegetation growth within the right-of-way zones.
              </p>
            </Card>

            {/* Small Card 2 */}
            <Card className="bg-white border-slate-200 p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Predictive Maintenance</h3>
              <p className="text-slate-600 leading-relaxed">
                Identify track degradation and potential failure points before they impact train operations.
              </p>
            </Card>

            {/* Large Card 2 */}
            <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 border-0 p-8 rounded-3xl relative overflow-hidden group shadow-xl">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 text-white">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-white/20">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Temporal Change Detection</h3>
                <p className="text-slate-300 max-w-md text-lg leading-relaxed mb-6">
                  Overlay historical imagery to automatically highlight structural shifts, environmental changes, and land deformation over time.
                </p>
                <div className="inline-flex items-center text-cyan-400 font-medium cursor-pointer group-hover:text-cyan-300">
                  See how it works <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Intelligence Workflow */}
      <section id="workflow" className="py-32 px-6 bg-slate-50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest">
                Workflow
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                From Raw Pixels to <br/>
                <span className="text-blue-600">Actionable Intel</span>
              </h2>
              <p className="text-lg text-slate-600">
                Our proprietary vision models process massive geospatial datasets in seconds, delivering high-confidence alerts directly to your operational dashboard.
              </p>
              
              <div className="space-y-6 pt-4">
                {[
                  { title: 'Ingest', desc: 'Securely upload GeoTIFF or standard imagery.' },
                  { title: 'Analyze', desc: 'Computer vision models segment and classify infrastructure.' },
                  { title: 'Alert', desc: 'Critical threats trigger immediate dashboard notifications.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 border border-blue-200">
                      0{i+1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-1">{step.title}</h4>
                      <p className="text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup / Abstract visual */}
            <div className="relative h-[600px] w-full rounded-3xl bg-slate-200 overflow-hidden shadow-2xl border border-slate-300 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  {/* Mock UI Header */}
                  <div className="flex justify-between items-center opacity-50">
                    <div className="w-20 h-4 bg-white/20 rounded-full"></div>
                    <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                  </div>
                  {/* Mock UI Map Area */}
                  <div className="flex-1 my-8 relative rounded-xl border border-white/10 bg-white/5 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
                    <MapPin className="w-16 h-16 text-emerald-400 absolute animate-pulse" style={{top: '40%', left: '40%'}} />
                    <div className="absolute top-[40%] left-[40%] w-32 h-32 bg-emerald-400/20 rounded-full blur-xl animate-pulse"></div>
                    
                    <Shield className="w-12 h-12 text-rose-500 absolute" style={{top: '60%', left: '70%'}} />
                    <div className="absolute top-[60%] left-[70%] w-24 h-24 bg-rose-500/20 rounded-full blur-xl"></div>
                  </div>
                  {/* Mock UI Footer */}
                  <div className="h-24 bg-white/10 rounded-xl border border-white/10 backdrop-blur-md p-4 flex gap-4">
                    <div className="h-full w-1/3 bg-white/20 rounded-lg"></div>
                    <div className="h-full w-2/3 bg-white/20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Deploy Intelligence Today.</h2>
              <p className="text-blue-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
                Experience the enterprise dashboard tailored for modern railway networks. No setup required.
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-white hover:bg-slate-50 text-blue-700 gap-2 rounded-full px-10 h-16 text-lg font-bold shadow-xl transition-transform hover:scale-105">
                  Launch Demo Application
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Satellite className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold tracking-tight text-slate-900">RailVision</span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} RailVision AI Technologies. Empowering infrastructure.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-blue-600 transition">Documentation</a>
            <a href="#" className="hover:text-blue-600 transition">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
