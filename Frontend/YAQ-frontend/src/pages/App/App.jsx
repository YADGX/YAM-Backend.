import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";

//IMPORTS
import HomePage from "../HomePage/HomePage";
import AboutPage from "../AboutPage/AboutPage";
import UserPage from "../UserPage/UserPage";
import DoctorPage from "../DoctorPage/DoctorPage";
import Navbar from '../../components/Navbar/Navbar';
import LoginPage from "../LoginPage/LoginPage";
import Registration from '../RegistrationPage/RegistrationPage';
import ForgotPasswordPage from '../ForgotPasswordPage/ForgotPasswordPage';
import Footer from "../../components/Footer/Footer";
import AdminPage from "../../pages/AdminDashboard/AdminDashboard";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    document.body.classList.toggle('dark-mode', newMode);
  };

  // الصفحات التي لا نريد اظهار الـ Navbar و Footer فيها
  const noNavbarFooterPaths = ['/user', '/doctor'];

  const showNavbarFooter = !noNavbarFooterPaths.includes(location.pathname);

  return (
    <>
      <div className={`dashboard-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
        {showNavbarFooter && <Navbar toggleSidebar={toggleSidebar} toggleDarkMode={toggleDarkMode} />}

        <main>
          <Routes>
            <Route path="/*" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Registration />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/doctor" element={<DoctorPage />} />
            <Route path="/Admin" element={<AdminPage />} />
          </Routes>
        </main>

        {showNavbarFooter && <Footer />}
      </div>
    </>
  );
}
