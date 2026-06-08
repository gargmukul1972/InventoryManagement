import { useEffect, useState } from "react";
import { FiMenu, FiSun, FiMoon, FiUser } from "react-icons/fi";

function Navbar({ toggleMobileSidebar }) {
  const [theme, setTheme] = useState(() => {
    // Read theme from document class, default to light
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark") ? "dark" : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      // Update meta tag
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.content = "dark";
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      // Update meta tag
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.content = "light";
    }
    window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="hamburger-btn" 
          onClick={toggleMobileSidebar} 
          aria-label="Open sidebar menu"
        >
          <FiMenu />
        </button>
        <h2 className="navbar-title">Enterprise Dashboard</h2>
      </div>

      <div className="navbar-right">
        <button 
          className="theme-toggle-btn" 
          onClick={toggleTheme} 
          aria-label={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>

        <div className="profile-container">
          <div className="profile-avatar" aria-label="User Profile">
            <FiUser />
          </div>
          <div className="profile-info">
            <span className="profile-name">Mukul Garg</span>
            <span className="profile-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

