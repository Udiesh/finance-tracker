import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import {
  getTransactions, getCategories, createTransaction, updateTransaction,
  deleteTransaction, parseTransaction,
} from '../services/api';
import toast from 'react-hot-toast';
import {
  Plus, Search, Sparkles, Trash2, Pencil, X, ArrowUpRight, ArrowDownRight,
  Filter, Loader2, Send, Calendar,
} from 'lucide-react';

const Transactions = () => {
  const { currency, formatAmount } = useSettings();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [filters, setFilters] = useState({ category_id: '', type: '', start_date: '', end_date: '' });
  const [form, setForm] = useState({
    amount: '', description: '', date: new Date().toISOString().split('T')[0], category_id: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        getTransactions({}),
        getCategories(),
      ]);
      setTransactions(transRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (filterParams = filters) => {
    try {
      const params = {};
      if (filterParams.category_id) params.category_id = filterParams.category_id;
      if (filterParams.type) params.type = filterParams.type;
      if (filterParams.start_date) params.start_date = filterParams.start_date;
      if (filterParams.end_date) params.end_date = filterParams.end_date;
      const res = await getTransactions(params);
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchTransactions(newFilters);
  };

  const handleAIParse = async () => {
    if (!aiText.trim()) return;
    setAiLoading(true);
    try {
      const res = await parseTransaction(aiText);
      if (res.data.error) {
        toast.error('AI could not parse that. Try again.');
        return;
      }
      setForm({
        amount: res.data.amount || '',
        description: res.data.description || '',
        date: res.data.date || new Date().toISOString().split('T')[0],
        category_id: res.data.category_id || '',
      });
      setShowModal(true);
      setAiText('');
      toast.success('AI parsed your input!');
    } catch (err) {
      toast.error('AI parsing failed');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        amount: parseFloat(form.amount),
        description: form.description,
        date: form.date,
        category_id: parseInt(form.category_id),
      };

      if (editingTransaction) {
        // Only send fields that changed
        const updatePayload = {};
        if (payload.amount !== editingTransaction.amount) updatePayload.amount = payload.amount;
        if (payload.description !== editingTransaction.description) updatePayload.description = payload.description;
        if (payload.date !== editingTransaction.date) updatePayload.date = payload.date;
        if (payload.category_id !== editingTransaction.category_id) updatePayload.category_id = payload.category_id;

        await updateTransaction(editingTransaction.id, updatePayload);
        toast.success('Transaction updated');
      } else {
        await createTransaction(payload);
        toast.success('Transaction added');
      }

      closeModal();
      fetchTransactions();
    } catch (err) {
      const detail = err.response?.data?.detail;
      const msg = typeof detail === 'string' ? detail : 'Failed to save';
      toast.error(msg);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (t) => {
    setEditingTransaction(t);
    setForm({
      amount: t.amount,
      description: t.description,
      date: t.date,
      category_id: t.category_id,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setForm({ amount: '', description: '', date: new Date().toISOString().split('T')[0], category_id: '' });
  };

  const groupByDate = (transactions) => {
    const groups = {};
    transactions.forEach((t) => {
      const date = t.date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return Object.entries(groups).sort(([a], [b]) => new Date(b) - new Date(a));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) return 'Today';
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-20 pb-10 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold">Transactions</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{transactions.length} total</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] text-black text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all duration-200"
        >
          <Plus size={16} />
          Add New
        </button>
      </div>

      {/* AI Input */}
      <div className="glass-card p-4 mb-6 animate-fade-in animate-border-glow" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3">
          <Sparkles size={18} className="text-[var(--color-accent)] shrink-0" />
          <input
            type="text"
            value={aiText}
            onChange={(e) => setAiText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAIParse()}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-[var(--color-text-muted)] outline-none"
            placeholder='Try: "spent 500 on groceries yesterday" or "earned 50000 salary today"'
          />
          <button
            onClick={handleAIParse}
            disabled={aiLoading || !aiText.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent)] text-xs font-medium hover:bg-[var(--color-accent-glow-strong)] transition-all duration-200 disabled:opacity-30"
          >
            {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            Parse
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <select
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="glow-input px-3 py-2 text-xs"
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={filters.category_id}
          onChange={(e) => handleFilterChange('category_id', e.target.value)}
          className="glow-input px-3 py-2 text-xs"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={filters.start_date}
          onChange={(e) => handleFilterChange('start_date', e.target.value)}
          className="glow-input px-3 py-2 text-xs"
        />
        <input
          type="date"
          value={filters.end_date}
          onChange={(e) => handleFilterChange('end_date', e.target.value)}
          className="glow-input px-3 py-2 text-xs"
        />
        {(filters.type || filters.category_id || filters.start_date || filters.end_date) && (
          <button
            onClick={() => {
              setFilters({ category_id: '', type: '', start_date: '', end_date: '' });
              fetchTransactions({ category_id: '', type: '', start_date: '', end_date: '' });
            }}
            className="px-3 py-2 text-xs text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-6 stagger-children">
        {transactions.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <Sparkles size={32} className="text-[var(--color-text-muted)] mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)] mb-1">No transactions found</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Add one manually or use AI to parse your spending
            </p>
          </div>
        ) : (
          groupByDate(transactions).map(([date, items]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <Calendar size={14} className="text-[var(--color-text-muted)]" />
                <h3 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                  {formatDate(date)}
                </h3>
                <div className="flex-1 h-px bg-[var(--color-border)]" />
              </div>
              <div className="space-y-1">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between py-3.5 px-4 rounded-xl hover:bg-[#0A0A0A] transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-xl">{t.category_icon || '💰'}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{t.description}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{t.category_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        {t.category_type === 'income' ? (
                          <ArrowUpRight size={14} className="text-[var(--color-income)]" />
                        ) : (
                          <ArrowDownRight size={14} className="text-[var(--color-expense)]" />
                        )}
                        <span
                          className={`text-sm font-mono-nums font-semibold ${
                            t.category_type === 'income' ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]'
                          }`}
                        >
                          {formatAmount(t.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={() => openEdit(t)}
                          className="p-1.5 rounded-lg hover:bg-[#1A1A1A] text-[var(--color-text-muted)] hover:text-white transition-all"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 rounded-lg hover:bg-[var(--color-danger-dim)]/30 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 m-4 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-[#1A1A1A] text-[var(--color-text-muted)] hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">
                  Amount ({currency.symbol})
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="glow-input w-full py-3 px-4 text-sm font-mono-nums"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">
                  Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="glow-input w-full py-3 px-4 text-sm"
                  placeholder="What was this for?"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="glow-input w-full py-3 px-4 text-sm"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="glow-input w-full py-3 px-4 text-sm"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl border border-[var(--color-border)] text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[#111111] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[var(--color-accent)] text-black text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all duration-200"
                >
                  {editingTransaction ? 'Update' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
