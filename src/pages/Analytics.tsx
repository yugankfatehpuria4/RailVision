import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, TrendingUp, ShieldAlert, BarChart3, PieChart as PieIcon, Cpu, Globe } from 'lucide-react';
import { LineChart, BarChart, PieChart, ScatterChart, lineClasses } from '@mui/x-charts';
import { DUMMY_TRENDS, DUMMY_ZONE_PERFORMANCE, DUMMY_AI_METRICS, DUMMY_ANALYSIS_RESULTS } from '@/lib/dummy-data';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#050A15] text-white font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      {/* Scanline */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] shadow-[0_0_5px_rgba(0,0,0,0.5)] animate-scanline bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,1)_51%)] bg-[length:100%_4px] z-40" />
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(6,182,212,0.15)]">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-white/5 gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Map
              </Button>
            </Link>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <h1 className="text-xl font-bold tracking-[0.2em] bg-gradient-to-r from-white via-cyan-200 to-cyan-500 bg-clip-text text-transparent uppercase font-['Exo_2']">
                Analytics <span className="text-cyan-500 font-black italic">Pulse</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">System Status</span>
              <span className="text-xs text-green-400 flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                AI ENGINES ACTIVE
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6 max-w-[1600px] mx-auto space-y-6">

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Inspected', value: '4.2k', sub: '+12% from last week', icon: Globe, color: 'blue' },
            { label: 'Average Confidence', value: '94.2%', sub: 'Model: YOLOv8-X', icon: Cpu, color: 'indigo' },
            { label: 'Active Encroachments', value: '156', sub: 'Critical Priority: 12', icon: ShieldAlert, color: 'rose' },
            { label: 'Network Health', value: '88/100', sub: 'Optimal condition', icon: TrendingUp, color: 'emerald' },
          ].map((kpi, i) => (
            <Card key={i} className="bg-[#0B1221]/80 backdrop-blur-xl border-cyan-500/20 p-5 relative overflow-hidden group hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.2)] transition-all duration-300">
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${kpi.color}-500/10 blur-[40px] rounded-full group-hover:bg-${kpi.color}-500/20 transition-all`} />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-2 rounded-lg bg-${kpi.color}-500/10 text-${kpi.color}-400 shadow-[0_0_10px_rgba(var(--${kpi.color}-500),0.2)]`}>
                  <kpi.icon className="w-5 h-5" />
                </div>
                <span className="text-cyan-400 text-[9px] font-black bg-cyan-400/10 border border-cyan-400/30 px-2 py-1 rounded shadow-[0_0_10px_rgba(6,182,212,0.2)] tracking-widest uppercase">LIVE</span>
              </div>
              <div className="text-3xl font-black tracking-tight mb-1">{kpi.value}</div>
              <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">{kpi.label}</div>
              <div className="text-[10px] text-slate-500 mt-2 font-mono italic">{kpi.sub}</div>
            </Card>
          ))}
        </div>

        {/* Middle Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Trend Chart */}
          <Card className="lg:col-span-2 bg-[#0B1221]/80 backdrop-blur-xl border-cyan-500/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-cyan-500/40 transition-colors relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Temporal Encroachment Trends
              </h3>
              <select className="bg-[#050A15] border border-cyan-500/30 text-[10px] px-3 py-1.5 rounded text-cyan-400 font-bold uppercase tracking-wider outline-none focus:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <LineChart
                xAxis={[{
                  data: DUMMY_TRENDS.map(t => t.month),
                  scaleType: 'band',
                  tickLabelStyle: { fill: '#64748b', fontSize: 10, fontFamily: 'Rajdhani' }
                }]}
                series={[
                  {
                    data: DUMMY_TRENDS.map(t => t.encroachments),
                    label: 'Encroachments',
                    color: '#6366f1',
                    area: true,
                    stack: 'total',
                    showMark: true,
                    valueFormatter: (v) => (v == null ? '' : `${v} incidents`),
                  },
                  {
                    data: DUMMY_TRENDS.map(t => t.vegetation / 3), // scaled for visual
                    label: 'Vegetation Loss',
                    color: '#10b981',
                    area: true,
                    stack: 'total',
                    showMark: true,
                    valueFormatter: (v) => (v == null ? '' : `${(v * 3).toFixed(1)} hectares`),
                  }
                ]}
                sx={{
                  [`& .${lineClasses.line}`]: {
                    display: 'none',
                  },
                }}
                slotProps={{
                  legend: {
                    sx: {
                      '& .MuiChartsLegend-label': { fill: '#94a3b8', fontSize: 10, fontFamily: 'Rajdhani' },
                    },
                  },
                }}
                height={300}
                margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
              />
            </div>
          </Card>

          {/* Asset Health Distribution */}
          <Card className="bg-[#0B1221]/80 backdrop-blur-xl border-cyan-500/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-cyan-500/40 transition-colors relative overflow-hidden">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-amber-400" />
              Asset Health Distribution
            </h3>
            <div className="h-[300px] flex items-center justify-center relative">
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: DUMMY_ANALYSIS_RESULTS.trackQuality.good, label: 'Good', color: '#10b981' },
                      { id: 1, value: DUMMY_ANALYSIS_RESULTS.trackQuality.fair, label: 'Fair', color: '#f59e0b' },
                      { id: 2, value: DUMMY_ANALYSIS_RESULTS.trackQuality.poor, label: 'Poor', color: '#ef4444' },
                    ],
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    innerRadius: 75,
                    outerRadius: 110,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    arcLabel: (item) => `${item.value}%`,
                    arcLabelMinAngle: 15,
                    valueFormatter: (item) => `${item.value}% of total network`,
                  },
                ]}
                sx={{
                  '& .MuiPieArcLabel-root': {
                    fill: 'white',
                    fontSize: '11px',
                    fontFamily: 'Rajdhani',
                    fontWeight: 'bold',
                  },
                }}
                slotProps={{
                  legend: {
                    position: { vertical: 'bottom', horizontal: 'center' },
                    sx: {
                      '& .MuiChartsLegend-label': { fill: '#94a3b8', fontSize: 11, fontFamily: 'Rajdhani' },
                    },
                  },
                }}
                height={300}
                margin={{ bottom: 40 }}
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[20px] text-center pointer-events-none">
                <div className="text-[10px] text-cyan-500/80 font-mono tracking-widest uppercase">Sync Rate</div>
                <div className="text-2xl font-black text-white italic tracking-tighter">94.2%</div>
              </div>
            </div>
          </Card>

        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Zone Performance Bar Chart */}
          <Card className="bg-[#0B1221]/80 backdrop-blur-xl border-cyan-500/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-cyan-500/40 transition-colors relative overflow-hidden">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              Zone-wise Risk Index
            </h3>
            <div className="h-[300px]">
              <BarChart
                xAxis={[{
                  scaleType: 'band',
                  data: DUMMY_ZONE_PERFORMANCE.map(z => z.zone),
                  tickLabelStyle: { fill: '#64748b', fontSize: 10, fontFamily: 'Rajdhani' }
                }]}
                series={[
                  { data: DUMMY_ZONE_PERFORMANCE.map(z => z.risk), label: 'Risk Score', color: '#f43f5e', valueFormatter: (v) => (v == null ? '' : `${v}/100 Risk Level`) },
                  { data: DUMMY_ZONE_PERFORMANCE.map(z => z.efficiency / 1.5), label: 'Efficiency Index', color: '#0ea5e9', valueFormatter: (v) => (v == null ? '' : `${(v * 1.5).toFixed(1)}% Operational`) }
                ]}
                grid={{ horizontal: true }}
                slotProps={{
                  legend: {
                    sx: {
                      '& .MuiChartsLegend-label': { fill: '#94a3b8', fontSize: 10, fontFamily: 'Rajdhani' },
                    },
                  },
                }}
                height={300}
              />
            </div>
          </Card>

          {/* AI Precision/Recall Scatter */}
          <Card className="bg-[#0B1221]/80 backdrop-blur-xl border-cyan-500/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-cyan-500/40 transition-colors relative overflow-hidden">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              AI Model Performance Matrix
            </h3>
            <div className="h-[300px]">
              <ScatterChart
                series={[
                  {
                    label: 'Models Precision vs Recall',
                    data: DUMMY_AI_METRICS.map((m, i) => ({
                      x: m.precision,
                      y: m.recall,
                      id: i,
                      label: m.model,
                    })),
                    color: '#a855f7',
                    valueFormatter: (v) =>
                      v == null ? '' : `Precision: ${(v.x * 100).toFixed(1)}% | Recall: ${(v.y * 100).toFixed(1)}%`,
                  },
                ]}
                xAxis={[{ min: 0.8, max: 1, label: 'Precision', labelStyle: { fill: '#64748b', fontSize: 10 } }]}
                yAxis={[{ min: 0.8, max: 1, label: 'Recall', labelStyle: { fill: '#64748b', fontSize: 10 } }]}
                grid={{ vertical: true, horizontal: true }}
                height={300}
              />
            </div>
          </Card>

        </div>

      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400;1,700;1,900&display=swap');
        @font-face {
          font-family: 'Rajdhani';
          src: url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap');
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
