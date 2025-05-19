import React, { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import "./UserPage.css";

function UserDashboard({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

   const handleLogout = () => {
    localStorage.removeItem("token");  
    navigate("/");  
  };

  return (
    <div className={`dashboard-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <header className="dashboard-header">
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="app-name">YaqeenMed</h1>
        <div className="header-right">
          <button
            className="dark-mode-toggle"
            onClick={toggleDarkMode}
            style={{ backgroundColor: "#3c4e69" }}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="profile-button">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt="Profile"
              className="profile-pic"
            />
          </div>
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li>Dashboard</li>
          <li>Documents</li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="post-request-container">
          <button className="post-request-btn">Post Request +</button>
        </div>
        <h2 className="dashboard-title">Welcome, {user?.username || "User"}</h2>
        <p>This is your dashboard. Features will be added soon.</p>
      </main>

    </div>
  );
}

export default UserDashboard;
