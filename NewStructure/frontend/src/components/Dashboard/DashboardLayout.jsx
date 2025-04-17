import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './dashboardNavbar';

/**
 * Shared layout component for all dashboard pages
 * This prevents unmount/remount of the sidebar and navbar when navigating between dashboard pages
 */
const DashboardLayout = () => {
  return (
    <div className="h-screen w-screen overflow-hidden bg-testingColorGrey">
      <div className="flex h-screen overflow-x-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-y-auto p-2">
          <main className="bg-testingColorBlack w-full h-full rounded-xl px-4 py-6 space-y-6">
            <Navbar />
            {/* Outlet renders the child route components */}
            <div className="bg-testingColorBlack">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
