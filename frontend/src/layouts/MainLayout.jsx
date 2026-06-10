import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
// import Navbar from "../components/Navbar/Navbar";

function MainLayout() {
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
        <main className="page-container">
          <Outlet />
          {/* {children} */}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;