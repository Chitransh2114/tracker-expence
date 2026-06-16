import React from 'react';

const DashboardStats = ({ summary = { totalIncome: 0, totalExpense: 0, balance: 0 } }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  const stats = [
    {
      title: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      valueColor: 'text-[#10b981]',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(summary.totalExpense),
      valueColor: 'text-[#f43f5e]',
    },
    {
      title: 'Net Balance',
      value: formatCurrency(summary.balance),
      valueColor: summary.balance >= 0 ? 'text-slate-800' : 'text-[#f43f5e]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => {
        return (
          <div
            key={idx}
            className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col space-y-1"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {stat.title}
            </p>
            <h3 className={`text-2xl font-black ${stat.valueColor} tracking-tight`}>
              {stat.value}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
