import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { User, Mail, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { currency } = useSettings();

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <div className="pt-20 pb-10 px-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl font-semibold mb-1">Profile</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Your account information
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-8 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col items-center mb-8">
          {/* Large Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-emerald-700 flex items-center justify-center text-black text-3xl font-bold mb-4 animate-fade-in-scale">
            {getInitial(user?.name)}
          </div>
          <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{user?.email}</p>
        </div>

        {/* Info Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 px-4 py-4 rounded-xl bg-[#0A0A0A] border border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center shrink-0">
              <User size={16} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Name</p>
              <p className="text-sm font-medium text-white">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-4 rounded-xl bg-[#0A0A0A] border border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center shrink-0">
              <Mail size={16} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-white">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-4 py-4 rounded-xl bg-[#0A0A0A] border border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center shrink-0">
              <Shield size={16} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">Currency</p>
              <p className="text-sm font-medium text-white">{currency.symbol} {currency.name} ({currency.code})</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
