import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  // Helper to extract first and last initials
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-white/80 border border-slate-200 p-2.5 rounded-xl">
              <Wallet className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Expense Tracker
              </span>
              <span className="hidden sm:inline text-xs text-slate-500 font-medium tracking-normal ml-2">
                | Personal Expense Hub
              </span>
            </div>
          </div>

          {/* User info & Logout */}
          {user && (
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Initials Avatar Icon with Hover Dropdown details */}
              <div className="relative group cursor-pointer">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs border border-slate-300 transition-colors duration-150 select-none">
                  {getInitials(user.name)}
                </div>

                {/* Profile Card Tooltip */}
                <div className="absolute right-0 top-10 bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xl w-48 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Signed in as
                  </p>
                  <p className="text-xs font-bold text-slate-800 truncate mt-1">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-rose-600 transition-colors py-2 px-3 hover:bg-slate-200/50 rounded-lg"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
