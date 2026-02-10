import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ArrowLeftRight, Tag, LogOut, Sparkles, Settings, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-[var(--color-accent-glow)] text-[var(--color-accent)] shadow-[0_0_20px_rgba(16,185,129,0.1)]'
        : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[#111111]'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-emerald-700 flex items-center justify-center">
            <Sparkles size={16} className="text-black" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Fin<span className="text-[var(--color-accent)]">Track</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          <NavLink to="/dashboard" className={linkClass}>
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>
          <NavLink to="/transactions" className={linkClass}>
            <ArrowLeftRight size={16} />
            Transactions
          </NavLink>
          <NavLink to="/categories" className={linkClass}>
            <Tag size={16} />
            Categories
          </NavLink>
        </div>

        {/* Profile Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-[#111111] transition-all duration-200"
          >
            <span className="text-sm text-[var(--color-text-secondary)] hidden sm:block">
              {user?.name}
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-emerald-700 flex items-center justify-center text-black font-semibold text-sm">
              {getInitial(user?.name)}
            </div>
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-card p-2 animate-fade-in-scale z-50">
              {/* User info */}
              <div className="px-3 py-3 border-b border-[var(--color-border)] mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-emerald-700 flex items-center justify-center text-black font-semibold">
                    {getInitial(user?.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-white hover:bg-[#111111] transition-all duration-200"
              >
                <Settings size={16} />
                Settings
              </button>

              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/profile');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-secondary)] hover:text-white hover:bg-[#111111] transition-all duration-200"
              >
                <User size={16} />
                Profile
              </button>

              <div className="border-t border-[var(--color-border)] mt-2 pt-2">
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-dim)]/20 transition-all duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
