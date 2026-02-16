import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { getSummary, getMonthlyBreakdown, getTransactions, getCategoryBreakdown } from '../services/api';
import AnimatedNumber from '../components/AnimatedNumber';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Sparkles, CalendarDays,
} from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const Dashboard = () => {
  const { user } = useAuth();
  const { currency, formatAmount } = useSettings();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('area');

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      // Build date range for filtering transactions
      const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`;
      const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
      const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const [summaryRes, monthlyRes, transRes, breakdownRes] = await Promise.all([
        getSummary({ month: selectedMonth, year: selectedYear }),
        getMonthlyBreakdown({ year: selectedYear }),
        getTransactions({ start_date: startDate, end_date: endDate, limit: 5 }),
        getCategoryBreakdown({ month: selectedMonth, year: selectedYear }),
      ]);
      setSummary(summaryRes.data);
      setMonthlyData(
        monthlyRes.data.map((item, index) => ({
          ...item,
          name: MONTHS[item.month - 1],
          isSelected: item.month === selectedMonth,
        }))
      );
      setRecentTransactions(transRes.data);
      setCategoryBreakdown(breakdownRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate year options (current year and 2 years back)
  const yearOptions = [];
  for (let y = now.getFullYear(); y >= now.getFullYear() - 2; y--) {
    yearOptions.push(y);
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card p-3 !rounded-xl text-xs">
        <p className="font-medium text-white mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-[var(--color-text-secondary)] capitalize">{entry.name}:</span>
            <span className="font-mono-nums text-white">{formatAmount(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
      </div>
    );
  }

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  };

  const isCurrentMonth = selectedMonth === (now.getMonth() + 1) && selectedYear === now.getFullYear();

  return (
    <div className="pt-20 pb-10 px-6 max-w-7xl mx-auto">
      {/* Header + Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold mb-1">
            Good {getHour()}, <span className="text-[var(--color-accent)]">{user?.name}</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {isCurrentMonth ? "Here's your financial overview" : `Viewing ${MONTH_NAMES[selectedMonth - 1]} ${selectedYear}`}
          </p>
        </div>

        {/* Month/Year Filter */}
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-[var(--color-text-muted)]" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="glow-input px-3 py-2 text-xs"
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="glow-input px-3 py-2 text-xs"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          {!isCurrentMonth && (
            <button
              onClick={() => {
                setSelectedMonth(now.getMonth() + 1);
                setSelectedYear(now.getFullYear());
              }}
              className="px-3 py-2 text-xs text-[var(--color-accent)] hover:bg-[var(--color-accent-glow)] rounded-lg transition-all duration-200"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger-children">
        {/* Income */}
        <div className="glass-card p-6 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              {isCurrentMonth ? 'Total Income' : `Income — ${MONTHS[selectedMonth - 1]}`}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center">
              <TrendingUp size={16} className="text-[var(--color-accent)]" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-[var(--color-income)]">
            <AnimatedNumber value={summary.total_income} prefix={currency.symbol} />
          </div>
        </div>

        {/* Expense */}
        <div className="glass-card p-6 group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              {isCurrentMonth ? 'Total Expense' : `Expense — ${MONTHS[selectedMonth - 1]}`}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--color-danger)]/10 flex items-center justify-center">
              <TrendingDown size={16} className="text-[var(--color-danger)]" />
            </div>
          </div>
          <div className="text-3xl font-semibold text-[var(--color-expense)]">
            <AnimatedNumber value={summary.total_expense} prefix={currency.symbol} />
          </div>
        </div>

        {/* Balance */}
        <div className="glass-card p-6 animate-pulse-glow group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              {isCurrentMonth ? 'Balance' : `Net — ${MONTHS[selectedMonth - 1]}`}
            </span>
            <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center">
              <Wallet size={16} className="text-[var(--color-accent)]" />
            </div>
          </div>
          <div className={`text-3xl font-semibold ${summary.balance >= 0 ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]'}`}>
            <AnimatedNumber value={summary.balance} prefix={currency.symbol} />
          </div>
        </div>
      </div>

      {/* Chart + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Monthly Overview — {selectedYear}
            </h2>
            <div className="flex gap-1 bg-[#111111] rounded-lg p-1">
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  chartType === 'area'
                    ? 'bg-[var(--color-accent-glow)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:text-white'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                  chartType === 'bar'
                    ? 'bg-[var(--color-accent-glow)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:text-white'
                }`}
              >
                Bar
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'area' ? (
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4B5563" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2}
                  fill="url(#incomeGrad)" animationDuration={1500}
                />
                <Area
                  type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2}
                  fill="url(#expenseGrad)" animationDuration={1500}
                />
              </AreaChart>
            ) : (
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />
                <XAxis dataKey="name" stroke="#4B5563" tick={{ fontSize: 12 }} />
                <YAxis stroke="#4B5563" tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} animationDuration={1000} />
                <Bar dataKey="expense" fill="#EF4444" radius={[6, 6, 0, 0]} animationDuration={1000} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-4">
            {isCurrentMonth ? 'Recent Transactions' : `Transactions — ${MONTHS[selectedMonth - 1]}`}
          </h2>
          <div className="space-y-3 stagger-children">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Sparkles size={24} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-sm text-[var(--color-text-muted)]">No transactions {isCurrentMonth ? 'yet' : 'this month'}</p>
                {isCurrentMonth && <p className="text-xs text-[var(--color-text-muted)] mt-1">Add your first one!</p>}
              </div>
            ) : (
              recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-[#111111] transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{t.category_icon || '💰'}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{t.description}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{t.category_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {t.category_type === 'income' ? (
                      <ArrowUpRight size={14} className="text-[var(--color-income)]" />
                    ) : (
                      <ArrowDownRight size={14} className="text-[var(--color-expense)]" />
                    )}
                    <span
                      className={`text-sm font-mono-nums font-medium ${
                        t.category_type === 'income' ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]'
                      }`}
                    >
                      {formatAmount(t.amount)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="glass-card p-6 mt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-sm font-medium text-[var(--color-text-secondary)] uppercase tracking-wider mb-6">
            Category Breakdown — {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
          </h2>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    dataKey="total"
                    nameKey="name"
                    stroke="#000000"
                    strokeWidth={3}
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const data = payload[0].payload;
                      return (
                        <div className="glass-card p-3 !rounded-xl text-xs">
                          <p className="font-medium text-white">{data.icon} {data.name}</p>
                          <p className="font-mono-nums text-white mt-1">{formatAmount(data.total)}</p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 space-y-3 stagger-children">
              {categoryBreakdown.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[index % PIE_COLORS.length] }} />
                    <span className="text-sm">{item.icon} {item.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.type === 'income' ? 'bg-[var(--color-income)]/10 text-[var(--color-income)]' : 'bg-[var(--color-expense)]/10 text-[var(--color-expense)]'
                    }`}>{item.type}</span>
                  </div>
                  <span className="font-mono-nums text-sm font-medium">{formatAmount(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;