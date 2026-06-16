import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const INCOME_CATEGORIES = ['Salary', 'Business', 'Investments', 'Side Hustle', 'Gifts', 'Other'];
const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Rent & Utilities',
  'Transport',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Insurance',
  'Education',
  'Travel',
  'Other',
];

const TransactionFormModal = ({ isOpen, onClose, onSubmitSuccess, initialData = null }) => {
  const isEdit = !!initialData;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: 'expense',
      title: '',
      amount: '',
      category: 'Other',
      note: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  // Load initialData if editing
  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        title: initialData.title,
        amount: initialData.amount,
        category: initialData.category || 'Other',
        note: initialData.note || '',
        date: new Date(initialData.date).toISOString().split('T')[0],
      });
    } else {
      reset({
        type: 'expense',
        title: '',
        amount: '',
        category: 'Other',
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        amount: parseFloat(data.amount),
        category: data.category || 'Other',
      };

      if (isEdit) {
        await api.put(`/transactions/${initialData._id}`, payload);
        toast.success('Transaction updated successfully!');
      } else {
        await api.post('/transactions', payload);
        toast.success('Transaction added successfully!');
      }
      onSubmitSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#000000]/60 backdrop-blur-xs"
        onClick={onClose}
      ></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 animate-in fade-in zoom-in duration-200">
        <div className="relative z-10 flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <h3 className="text-base font-bold text-slate-900">
            {isEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('type', 'expense')}
                className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  watch('type') === 'expense'
                    ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'income')}
                className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  watch('type') === 'income'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Grocery Shop"
              {...register('title', { required: 'Title is required' })}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-1.5">
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' },
              })}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-1.5">
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date.message}</p>}
          </div>

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-xs font-semibold text-slate-550 uppercase tracking-wider mb-1.5">
              Note (Optional)
            </label>
            <textarea
              id="note"
              placeholder="Add details..."
              rows={2}
              {...register('note')}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-2 border-t border-slate-200 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="glow-btn bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded-xl text-xs transition-colors duration-150 cursor-pointer disabled:opacity-50 w-full sm:w-auto"
            >
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionFormModal;
export { INCOME_CATEGORIES, EXPENSE_CATEGORIES };
