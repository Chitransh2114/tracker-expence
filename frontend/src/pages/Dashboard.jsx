import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import DashboardStats from '../components/DashboardStats';
import Analytics from '../components/Analytics';
import TransactionList from '../components/TransactionList';
import TransactionFormModal from '../components/TransactionFormModal';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [stats, setStats] = useState({
    summary: { totalIncome: 0, totalExpense: 0, balance: 0 },
    categoryBreakdown: [],
    monthlyBreakdown: [],
  });

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Debounced search / filter handling
  const triggerReload = () => setReloadTrigger((prev) => prev + 1);

  const fetchTransactions = useCallback(async () => {
    try {
      const params = {
        ...filters,
        page,
        limit: 10,
      };
      const res = await api.get('/transactions', { params });
      setTransactions(res.data.transactions);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      toast.error('Failed to load transactions');
    }
  }, [filters, page]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/transactions/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      toast.error('Failed to load dashboard metrics');
    }
  }, []);

  // Fetch data on load or filter/page/reload change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, reloadTrigger]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats, reloadTrigger]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
    setPage(1); // Reset to page 1 on filter changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEditClick = (transaction) => {
    setEditData(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/transactions/${id}`);
        toast.success('Transaction deleted');
        triggerReload();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleAddClick = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Dashboard Overview
            </h2>
            <p className="text-slate-655 text-xs sm:text-sm">
              Real-time cashflow intelligence and transactions history
            </p>
          </div>
          <button
            onClick={handleAddClick}
            className="glow-btn bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-sm flex items-center justify-center gap-2 self-start sm:self-center shadow-lg shadow-indigo-600/20"
          >
            <Plus className="h-4.5 w-4.5" />
            Add Transaction
          </button>
        </div>

        {/* Dashboard Stat Cards */}
        <DashboardStats summary={stats.summary} />

        {/* Charts Section */}
        <Analytics
          categoryBreakdown={stats.categoryBreakdown}
          monthlyBreakdown={stats.monthlyBreakdown}
        />

        {/* Transactions Table & Filters */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Transactions History
          </h3>
          <TransactionList
            transactions={transactions}
            pagination={pagination}
            filters={filters}
            onFilterChange={handleFilterChange}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {/* Form Dialog Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={triggerReload}
        initialData={editData}
      />
    </div>
  );
};

export default Dashboard;
