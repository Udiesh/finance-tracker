import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Check, Globe } from 'lucide-react';

const Settings = () => {
  const { currency, currencies, changeCurrency } = useSettings();
  const { user } = useAuth();

  return (
    <div className="pt-20 pb-10 px-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Customize your experience
        </p>
      </div>

      {/* Currency Section */}
      <div className="glass-card p-6 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center">
            <DollarSign size={16} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Currency</h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Choose how amounts are displayed across the app
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => changeCurrency(c.code)}
              className={`flex items-center justify-between px-4 py-4 rounded-xl border transition-all duration-300 ${
                currency.code === c.code
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent-glow)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[#0F0F0F]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono-nums">{c.symbol}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{c.code}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{c.name}</p>
                </div>
              </div>
              {currency.code === c.code && (
                <div className="w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                  <Check size={14} className="text-black" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 px-4 py-3 rounded-xl bg-[#0A0A0A] border border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-muted)]">
            Preview: <span className="text-white font-mono-nums">{currency.symbol}1,00,000</span> ({currency.code})
          </p>
        </div>
      </div>

      {/* App Info */}
      <div className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center">
            <Globe size={16} className="text-[var(--color-accent)]" />
          </div>
          <div>
            <h2 className="text-base font-semibold">About</h2>
            <p className="text-xs text-[var(--color-text-muted)]">App information</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[var(--color-text-secondary)]">Version</span>
            <span className="text-sm font-mono-nums text-white">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[var(--color-text-secondary)]">AI Model</span>
            <span className="text-sm text-white">Llama 3.1 (Groq)</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-[var(--color-text-secondary)]">Logged in as</span>
            <span className="text-sm text-white">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
