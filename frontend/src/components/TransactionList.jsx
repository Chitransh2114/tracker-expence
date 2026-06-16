import React from 'react';
import { Edit2, Trash2, Search, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from './TransactionFormModal';

const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

const TransactionList = ({
  transactions = [],
  pagination = { page: 1, limit: 10, total: 0, pages: 1 },
  filters = { search: '', type: '', category: '', startDate: '', endDate: '', sortBy: 'date', sortOrder: 'desc' },
  onFilterChange,
  onEditClick,
  onDeleteClick,
  onPageChange,
}) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const toggleSort = () => {
    const nextOrder = filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFilterChange({ sortOrder: nextOrder });
  };

  const handleSortByChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  const formatCurrency = (amount, type) => {
    const val = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    return type === 'income' ? `+${val}` : `-${val}`;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="glass-panel p-5 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-800">
            Filter Transactions
          </h3>
          <button
            onClick={clearFilters}
            className="text-xs text-indigo-600 hover:text-indigo-500 font-semibold transition-colors duration-150"
          >
            Reset All Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              name="search"
              placeholder="Search by title..."
              value={filters.search}
              onChange={handleInputChange}
              className="w-full bg-white/60 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-400"
            />
          </div>

          {/* Type Filter */}
          <select
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          {/* Category Filter */}
          <select
            name="category"
            value={filters.category}
            onChange={handleInputChange}
            className="w-full bg-white/60 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Sort Fields */}
          <div className="flex gap-2">
            <select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleSortByChange}
              className="flex-1 bg-white/60 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="title">Sort by Title</option>
            </select>
            <button
              onClick={toggleSort}
              title={`Sorting ${filters.sortOrder === 'asc' ? 'ascending' : 'descending'}`}
              className="px-3 bg-white/60 border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-colors text-slate-500"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Start Date */}
          <div className="flex items-center gap-2 bg-white/60 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-450 select-none pl-1">From:</span>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="bg-transparent border-0 text-xs text-slate-800 focus:outline-none w-full"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-2 bg-white/60 border border-slate-200 px-3 py-1.5 rounded-xl">
            <span className="text-xs text-slate-450 select-none pl-1">To:</span>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="bg-transparent border-0 text-xs text-slate-800 focus:outline-none w-full"
            />
          </div>
        </div>
      </div>

      {/* Transaction List / Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="text-xs">No transactions found matching criteria.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Note</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-white/[0.15] transition-colors duration-100">
                      <td className="px-6 py-4 font-semibold text-slate-800">{t.title}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(t.date)}</td>
                      <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate" title={t.note}>
                        {t.note || '-'}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${t.type === 'income' ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                        {formatCurrency(t.amount, t.type)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => onEditClick(t)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteClick(t._id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-slate-100">
              {transactions.map((t) => (
                <div key={t._id} className="p-4 flex flex-col gap-2 hover:bg-white/[0.15] transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{t.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(t.date)}</p>
                    </div>
                    <span className={`font-bold text-sm ${t.type === 'income' ? 'text-[#10b981]' : 'text-[#f43f5e]'}`}>
                      {formatCurrency(t.amount, t.type)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="px-2 py-0.5 text-[9px] font-semibold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                      {t.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEditClick(t)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClick(t._id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {t.note && (
                    <p className="text-xs text-slate-500 italic border-l border-slate-200 pl-2 py-0.5 mt-1">
                      {t.note}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination footer */}
            {pagination.pages > 1 && (
              <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Showing Page <strong className="text-slate-800">{pagination.page}</strong> of{' '}
                  <strong className="text-slate-800">{pagination.pages}</strong> ({pagination.total} total items)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => onPageChange(pagination.page - 1)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors text-slate-500 hover:text-slate-800"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={pagination.page >= pagination.pages}
                    onClick={() => onPageChange(pagination.page + 1)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors text-slate-500 hover:text-slate-800"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
