import React from "react";
import "./Footer.css";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-section">
          <img src="/travelling.jpg" alt="Logo" className="footer-logo" />
          <p>Your journey begins here. Explore, dream, and discover the world with us.</p>
        </div>
        <div className="footer-section">
          <h3>The journey of a thousand miles begins with a single step</h3></div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
          </div></div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Trip Planner. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
