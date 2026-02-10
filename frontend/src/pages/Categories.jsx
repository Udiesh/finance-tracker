import { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Tag } from 'lucide-react';

const ICONS = ['💰', '🍕', '🏠', '🚗', '🎮', '👕', '💊', '📚', '✈️', '🎬', '💼', '📱', '🏋️', '☕', '🎵', '🛒', '💡', '🎁', '🏦', '💳'];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'expense', icon: '💰' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, form);
        toast.success('Category updated');
      } else {
        await createCategory(form);
        toast.success('Category created');
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save');
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? All transactions in this category will be deleted too.`)) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (c) => {
    setEditingCategory(c);
    setForm({ name: c.name, type: c.type, icon: c.icon });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setForm({ name: '', type: 'expense', icon: '💰' });
  };

  const incomeCategories = categories.filter((c) => c.type === 'income');
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  const CategoryGrid = ({ items, title, emptyText }) => (
    <div className="mb-8">
      <h2 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-text-muted)] py-4">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 stagger-children">
          {items.map((c) => (
            <div key={c.id} className="glass-card p-4 group relative">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-2xl block mb-3">{c.icon}</span>
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className={`text-xs mt-1 ${c.type === 'income' ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]'}`}>
                    {c.type}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEdit(c)}
                    className="p-1.5 rounded-lg hover:bg-[#1A1A1A] text-[var(--color-text-muted)] hover:text-white transition-all"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1.5 rounded-lg hover:bg-[var(--color-danger-dim)]/30 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="pt-20 pb-10 px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Organize your transactions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-accent)] text-black text-sm font-semibold hover:brightness-110 active:scale-[0.98] transition-all duration-200"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <Tag size={40} className="text-[var(--color-text-muted)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)] mb-1">No categories yet</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Create categories to organize your spending and income
          </p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <CategoryGrid items={expenseCategories} title="Expense Categories" emptyText="No expense categories" />
          <CategoryGrid items={incomeCategories} title="Income Categories" emptyText="No income categories" />
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 m-4 animate-fade-in-scale">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-[#1A1A1A] text-[var(--color-text-muted)] hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm({ ...form, icon })}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-200 ${
                        form.icon === icon
                          ? 'bg-[var(--color-accent-glow)] border border-[var(--color-accent)] scale-110'
                          : 'bg-[#111111] border border-[var(--color-border)] hover:border-[var(--color-border-hover)]'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="glow-input w-full py-3 px-4 text-sm"
                  placeholder="e.g. Food, Salary, Rent"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-text-secondary)] mb-2 block uppercase tracking-wider">
                  Type
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'expense' })}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      form.type === 'expense'
                        ? 'border-[var(--color-expense)] bg-[var(--color-expense)]/10 text-[var(--color-expense)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)]'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'income' })}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      form.type === 'income'
                        ? 'border-[var(--color-income)] bg-[var(--color-income)]/10 text-[var(--color-income)]'
                        : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-hover)]'
                    }`}
                  >
                    Income
                  </button>
                </div>
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
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
