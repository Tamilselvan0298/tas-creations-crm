import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] dark:bg-slate-950">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <Header />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default Layout;
