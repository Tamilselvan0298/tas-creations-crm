import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Building2,
  Globe, 
  FileSpreadsheet,
  Columns, 
  CheckSquare,
  Calendar,
  Mail, 
  MessageSquare, 
  FileText, 
  FileCheck, 
  Receipt, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Puzzle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Failed to log out:', e);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Companies', path: '/companies', icon: Building2 },
    { name: 'Website Audit', path: '/website-audit', icon: Globe },
    { name: 'SEO Reports', path: '/seo-reports', icon: FileSpreadsheet },
    { name: 'CRM Kanban', path: '/crm', icon: Columns },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Meetings', path: '/meetings', icon: Calendar },
    { name: 'Email Campaigns', path: '/email', icon: Mail },
    { name: 'WhatsApp CRM', path: '/whatsapp', icon: MessageSquare },
    { name: 'Quotations', path: '/quotations', icon: FileText },
    { name: 'Proposals', path: '/proposals', icon: FileCheck },
    { name: 'Invoices', path: '/invoices', icon: Receipt },
    { name: 'AI Intelligence', path: '/analytics', icon: Sparkles },
    { name: 'Extension Hub', path: '/extension-hub', icon: Puzzle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside 
      className={`h-screen sticky top-0 bg-[#0B1F3A] text-slate-100 flex flex-col justify-between transition-all duration-300 border-r border-[#0d2a4f]/50 shadow-xl z-20 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#0d2a4f]/70 shrink-0">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <span className="h-8 w-8 bg-[#D4AF37] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-[#D4AF37]/20">
                T
              </span>
              <span className="font-bold text-base tracking-wide bg-gradient-to-r from-white to-[#D4AF37] bg-clip-text text-transparent uppercase">
                TAS Outreach
              </span>
            </div>
          )}
          {collapsed && (
            <span className="mx-auto h-8 w-8 bg-[#D4AF37] rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
              T
            </span>
          )}
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className="p-1 rounded-md hover:bg-[#14325a]/60 text-[#D4AF37] transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Items (Scrollable) */}
        <nav className="mt-4 px-3 space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-xs font-semibold transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/10'
                      : 'text-slate-300 hover:bg-[#14325a]/40 hover:text-white'
                  }`
                }
              >
                <Icon size={16} className="shrink-0" />
                {!collapsed && <span className="ml-3 truncate">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      {user && (
        <div className="p-4 border-t border-[#0d2a4f]/70 bg-[#07162b]/80 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <div className="h-9 w-9 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 flex items-center justify-center font-semibold shrink-0">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              {!collapsed && (
                <div className="ml-3 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {user.displayName}
                  </p>
                  <div className="flex items-center mt-0.5 text-[9px] text-slate-400 capitalize">
                    {user.role === 'admin' ? (
                      <ShieldCheck size={9} className="text-[#D4AF37] mr-1 shrink-0" />
                    ) : (
                      <UserCheck size={9} className="text-slate-400 mr-1 shrink-0" />
                    )}
                    <span>{user.role}</span>
                  </div>
                </div>
              )}
            </div>
            
            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="p-1 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800/30 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
