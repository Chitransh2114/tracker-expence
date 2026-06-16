import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const Analytics = ({
  categoryBreakdown = [],
  monthlyBreakdown = [],
}) => {
  // Balanced dark tech palette for categories
  const COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#6366f1', // Indigo
    '#f59e0b', // Amber
    '#db2777', // Pink
    '#8b5cf6', // Violet
    '#ef4444', // Red
  ];

  // Custom tooltips to fit the SaaS carbon-black aesthetic
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xl">
          {label && <p className="text-[10px] font-semibold text-slate-500 mb-1">{label}</p>}
          {payload.map((entry, idx) => (
            <p key={idx} className="text-xs font-bold" style={{ color: entry.color || entry.fill }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Monthly Comparison Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col h-[380px]">
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Monthly Income vs Expenses
        </h3>
        <div className="flex-1 w-full min-h-0">
          {monthlyBreakdown.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No monthly statistics available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyBreakdown}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  verticalAlign="bottom"
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Expense Category Breakdown Pie Chart */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col h-[380px]">
        <h3 className="text-sm font-bold text-slate-800 mb-4">
          Expense Category Breakdown
        </h3>
        <div className="flex-1 w-full min-h-0">
          {categoryBreakdown.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No expense categories recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '10px', maxHeight: '90px', overflowY: 'auto' }}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
