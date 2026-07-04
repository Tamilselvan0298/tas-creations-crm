import React from 'react';
import { Card } from '../../shared/components/Card';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import type { DashboardStats } from '../../shared/services/dashboardRepository';

interface DashboardChartsProps {
  stats: DashboardStats;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Monthly Revenue Chart */}
      <div className="lg:col-span-2">
        <Card title="Monthly Revenue Growth" subtitle="Tracking historical billing & sales volume progress">
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.95)',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                  }} 
                />
                <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Lead Sources Donut Chart */}
      <div>
        <Card title="Traffic & Lead Sources" subtitle="Where are current prospects coming from?">
          <div className="h-60 mt-4 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.leadSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.leadSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Total indicator inside donut */}
            <div className="absolute text-center">
              <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {stats.totalLeads.toLocaleString()}
              </p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Leads</p>
            </div>
          </div>
          {/* Color Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {stats.leadSources.map((src) => (
              <div key={src.name} className="flex items-center space-x-2">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                  {src.name} ({src.value}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sales Funnel Stages */}
      <div className="lg:col-span-3">
        <Card title="Sales Funnel Performance" subtitle="Drop-off conversions along the pipeline stages">
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.funnel}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="stage" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0B1F3A" radius={[4, 4, 0, 0]}>
                  {stats.funnel.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === stats.funnel.length - 1 ? '#D4AF37' : '#0B1F3A'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

    </div>
  );
};
export default DashboardCharts;
