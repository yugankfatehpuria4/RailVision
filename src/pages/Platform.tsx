import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Satellite, Cpu, Database, Globe, Shield, Zap, Layers, BarChart3, Lock } from 'lucide-react';

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Satellite className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Rail<span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Vision</span>
            </span>
          </Link>
          <Link to="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 font-medium">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute top-0 left-[-10%] w-[40%] h-[50%] bg-blue-400/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest">
            Platform Architecture
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Built for <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Scale & Security</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto">
            An enterprise-grade platform combining AI inference, GIS mapping, real-time alerts, and emergency response into a unified operational dashboard.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Technology Stack</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Globe, title: 'React + Vite', desc: 'Blazing-fast SPA frontend with React Router, Zustand state management, and TailwindCSS.', color: '#3b82f6' },
              { icon: Cpu, title: 'FastAPI + Python', desc: 'High-performance async backend with Motor (MongoDB), YOLO inference, and SegFormer models.', color: '#10b981' },
              { icon: Database, title: 'MongoDB Atlas', desc: 'Cloud-native document database for incidents, detections, alerts, and geospatial indexing.', color: '#8b5cf6' },
              { icon: Layers, title: 'Leaflet + GeoJSON', desc: 'Interactive mapping with custom tile layers, polygon overlays, and real-time detection markers.', color: '#f59e0b' },
              { icon: Shield, title: 'JWT Authentication', desc: 'Role-based access control with secure token management and admin/operator/field roles.', color: '#ef4444' },
              { icon: Zap, title: 'Docker + CI/CD', desc: 'Containerized deployment with docker-compose orchestration for frontend, backend, and database.', color: '#06b6d4' },
            ].map((item, i) => (
              <Card key={i} className="p-6 rounded-2xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${item.color}15`, color: item.color }}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'AI Object Detection', desc: 'YOLOv8-powered detection of buildings, tracks, vegetation, water bodies, and unauthorized encroachments from satellite imagery.', badge: 'AI' },
              { title: 'Change Detection', desc: 'Temporal analysis overlaying historical imagery to automatically identify structural shifts, deforestation, and land use changes.', badge: 'GIS' },
              { title: 'Emergency SOS System', desc: 'One-click emergency reporting with incident classification, responder dispatch, safe route calculation, and risk heatmaps.', badge: 'SOS' },
              { title: 'Export & Reporting', desc: 'Generate GeoJSON exports, CSV detection reports, and comprehensive PDF analysis documents for regulatory compliance.', badge: 'DATA' },
            ].map((cap, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-100">
                  {cap.badge}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">{cap.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Lock className="w-12 h-12 mx-auto text-blue-400" />
          <h2 className="text-4xl font-bold">Enterprise-Grade Security</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Built with JWT authentication, role-based access control, encrypted data at rest, and comprehensive audit trails for full regulatory compliance.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-8">
            {[
              { stat: 'AES-256', label: 'Encryption' },
              { stat: 'RBAC', label: 'Access Control' },
              { stat: 'ISO 27001', label: 'Compliant' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
                <div className="text-2xl font-bold text-blue-400 mb-1">{s.stat}</div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to explore?</h2>
          <p className="text-slate-500 text-lg">Access the live dashboard and experience the full platform.</p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 h-14 text-base shadow-lg">
              Open Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-slate-500 text-sm">
          <span>&copy; {new Date().getFullYear()} RailVision AI</span>
          <div className="flex gap-6">
            <Link to="/landing" className="hover:text-blue-600">Home</Link>
            <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
