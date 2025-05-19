import React from "react";
import { Link } from "react-router-dom";
import './Footer.css';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPinterest, FaGooglePlus, FaLinkedin } from 'react-icons/fa'; // Social icons

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About YaqeenMed</h3>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>My YaqeenMed</h3>
          <ul>
            <li><Link to="/user-dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Help & FAQs</h3>
          <ul>
            <li><Link to="/support">Customer Support</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <ul className="social-icons">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a></li>
          </ul>
        </div>

    
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 YaqeenMed. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
