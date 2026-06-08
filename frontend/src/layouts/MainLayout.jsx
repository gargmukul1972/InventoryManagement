import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

function MainLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <div className={`layout ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-sidebar-open" : ""}`}>
      {mobileOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeMobileSidebar}
          role="button"
          tabIndex={0}
          aria-label="Close menu overlay"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              closeMobileSidebar();
            }
          }}
        />
      )}

      <Sidebar 
        collapsed={sidebarCollapsed} 
        toggleCollapse={toggleSidebar}
        mobileOpen={mobileOpen}
        closeMobile={closeMobileSidebar}
      />

      <div className="main-content">
        <Navbar 
          toggleMobileSidebar={toggleMobileSidebar} 
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;