import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa"; // Import the required icons
import "./DoctorPage.css"; // Doctor Dashboard CSS

function DoctorDashboard({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userRequests, setUserRequests] = useState([]); // Requests for the doctor to review

  const navigate = useNavigate();

  // Function to fetch user requests assigned to the doctor
  const fetchUserRequests = async () => {
    try {
      // Example data: Replace this with an API call to get actual data from the backend
      const data = [
        { id: 1, title: "Consultation Request 1", summary: "Summary of request 1", date: "2025-05-15", user: "User 1" },
        { id: 2, title: "Consultation Request 2", summary: "Summary of request 2", date: "2025-05-14", user: "User 2" },
      ]; // Mock data for illustration
      setUserRequests(data);
    } catch (error) {
      console.error("Error fetching requests", error);
    }
  };

  useEffect(() => {
    fetchUserRequests(); // Fetch the requests when the component mounts

    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  // Toggle Sidebar visibility
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Toggle Dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.body.classList.toggle("dark-mode", newMode);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token and redirect
    navigate("/"); // Redirect to the login page
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
        <h2 className="dashboard-title">Welcome, Dr. {user?.username || "Doctor"}</h2>

        <div className="user-requests">
          <h3>Incoming Requests</h3>
          {userRequests.length === 0 ? (
            <p>No requests available</p>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Summary</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.title}</td>
                    <td>{request.summary}</td>
                    <td>{request.date}</td>
                    <td>
                      <button className="accept-btn">Accept</button>
                      <button className="deny-btn">Deny</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <footer className="dashboard-footer">
        &copy; {new Date().getFullYear()} YaqeenMed. All rights reserved.
      </footer>
    </div>
  );
}

export default DoctorDashboard;
