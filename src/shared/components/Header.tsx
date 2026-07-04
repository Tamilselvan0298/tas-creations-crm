import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Plus, 
  Globe, 
  UserPlus, 
  TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3); // Stub notification count

  return (
    <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/75 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      
      {/* Search Input Bar */}
      <div className="w-96 max-w-lg hidden sm:block">
        <div className="relative flex items-center">
          <Search size={16} className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search leads, audits, proposals..." 
            className="w-full text-sm pl-9 pr-4 py-1.5 bg-slate-100/60 focus:bg-white dark:bg-slate-800/40 dark:focus:bg-slate-800/80 border border-transparent focus:border-slate-300 dark:focus:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]/10 dark:focus:ring-white/5 transition-all text-slate-700 dark:text-slate-200"
          />
        </div>
      </div>
      <div className="sm:hidden text-lg font-bold text-[#0B1F3A] dark:text-white">
        TAS CRM
      </div>

      {/* Action Buttons & Utilities */}
      <div className="flex items-center space-x-3">
        
        {/* Quick Add Button */}
        <div className="relative">
          <button 
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="bg-[#0B1F3A] hover:bg-[#133056] text-white px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1.5 shadow-sm hover:shadow transition-all cursor-pointer dark:bg-slate-100 dark:text-[#0B1F3A] dark:hover:bg-slate-200"
          >
            <Plus size={14} />
            <span>Quick Action</span>
          </button>
          
          <AnimatePresence>
            {showQuickMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowQuickMenu(false)}
                />
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 overflow-hidden"
                >
                  <button 
                    onClick={() => setShowQuickMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                  >
                    <UserPlus size={14} className="text-blue-500" />
                    <span>Create Lead</span>
                  </button>
                  <button 
                    onClick={() => setShowQuickMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                  >
                    <Globe size={14} className="text-emerald-500" />
                    <span>Run Website Audit</span>
                  </button>
                  <button 
                    onClick={() => setShowQuickMenu(false)}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 cursor-pointer"
                  >
                    <TrendingUp size={14} className="text-[#D4AF37]" />
                    <span>Generate Proposal</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Realtime Notifications Toggle */}
        <div className="relative">
          <button 
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            onClick={() => setNotificationsCount(0)} // Clear notification badge on click
          >
            <Bell size={18} />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-[10px] text-white font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900 animate-pulse">
                {notificationsCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {/* Small Profile Info */}
        <div className="hidden sm:flex items-center space-x-2 px-1">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-3">
              {user?.displayName?.split(' ')[0]}
            </span>
            <span className="text-[10px] text-slate-400 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
