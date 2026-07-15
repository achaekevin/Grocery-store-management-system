import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@components/common/Sidebar';
import { Navbar } from '@components/common/Navbar';
import { cn } from '@utils/cn';

export const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      
      <div
        className={cn(
          'transition-all duration-300',
          isCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <Navbar />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
