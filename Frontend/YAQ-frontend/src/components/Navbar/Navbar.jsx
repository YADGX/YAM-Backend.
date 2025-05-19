import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useState } from 'react';
import defaultProfilePic from '../../assets/images/DFimage.png';  // Import default profile picture

const Navbar = ({ toggleSidebar, toggleDarkMode }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation(); // Get current location

  const handleProfileClick = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="dashboard-header">
      {/* Left section: Hamburger Menu and Navigation Links */}
      <div className="left-section">
        {/* Hamburger Menu */}
        <button className="hamburger" onClick={toggleSidebar}>
          <div></div>
          <div></div>
          <div></div>
        </button>

        {/* Navigation Links */}
        <nav>
          <ul>
            {/* Conditionally render Home link based on current route */}
            {location.pathname !== "/" && <li><Link to="/">Home</Link></li>}

            {/* Conditionally render About link based on current route */}
            {location.pathname !== "/about" && <li><Link to="/about">About</Link></li>}
          </ul>
        </nav>
      </div>

      {/* Centered App Name */}
      <h1 className="app-name">
        <Link to="/">YaqeenMed</Link>
      </h1>

      {/* Right section: Profile Picture Container and Buttons */}
      <div className="right-section">
        {/* Profile Picture Container */}
        <div
          className={`profile-pic-container ${dropdownVisible ? 'show-dropdown' : ''}`}
          onClick={handleProfileClick}
        >
          <img
            src={defaultProfilePic}  // Display default profile picture
            alt="Profile"
            className="profile-pic"
          />

          {/* Dropdown Menu for SignUp and Login */}
          <div className="profile-dropdown">
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
