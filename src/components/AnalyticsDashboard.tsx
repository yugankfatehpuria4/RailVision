

import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { DUMMY_ANALYSIS_RESULTS } from '@/lib/dummy-data';
import { AlertCircle, TrendingUp, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsDashboard() {
  const trackQualityData = Object.entries(DUMMY_ANALYSIS_RESULTS.trackQuality).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })
  );

  const encroachmentData = Object.entries(DUMMY_ANALYSIS_RESULTS.encroachments).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })
  );

  const damageData = Object.entries(DUMMY_ANALYSIS_RESULTS.damageTypes).map(
    ([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    })
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Inspected</p>
              <p className="text-3xl font-bold text-slate-900">
                {DUMMY_ANALYSIS_RESULTS.totalInspected}
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Encroachments Found</p>
              <p className="text-3xl font-bold text-slate-900">
                {DUMMY_ANALYSIS_RESULTS.encroachments.total}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600">Avg Confidence</p>
              <p className="text-3xl font-bold text-slate-900">
                {(DUMMY_ANALYSIS_RESULTS.averageConfidence * 100).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track Quality Pie Chart */}
        <Card className="p-4 bg-white border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Track Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={trackQualityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {trackQualityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Encroachment Severity Bar Chart */}
        <Card className="p-4 bg-white border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Encroachment Severity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={encroachmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Damage Types Bar Chart */}
        <Card className="p-4 bg-white border border-slate-200 lg:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Detected Damage Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={damageData}
              layout="horizontal"
              margin={{ left: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="p-4 bg-white border border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-600">Critical Issues</p>
            <p className="text-2xl font-bold text-red-600">
              {DUMMY_ANALYSIS_RESULTS.encroachments.critical}
            </p>
          </div>
          <div>
            <p className="text-slate-600">High Priority</p>
            <p className="text-2xl font-bold text-orange-600">
              {DUMMY_ANALYSIS_RESULTS.encroachments.high}
            </p>
          </div>
          <div>
            <p className="text-slate-600">Total Damage Areas</p>
            <p className="text-2xl font-bold text-slate-900">
              {Object.values(DUMMY_ANALYSIS_RESULTS.damageTypes).reduce((a, b) => a + b, 0)}
            </p>
          </div>
          <div>
            <p className="text-slate-600">Last Update</p>
            <p className="text-lg font-bold text-blue-600">
              {new Date(DUMMY_ANALYSIS_RESULTS.latestUpdate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
