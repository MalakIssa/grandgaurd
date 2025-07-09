// src/components/Footer/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>GrandGuard</h3>
          <p>Compassionate care for your loved ones</p>
        </div>

        <div className="footer-links">
          <div className="links-column">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">In-Home Care</Link></li>
              <li><Link to="/services">Specialized Care</Link></li>
              <li><Link to="/services">Respite Care</Link></li>
              <li><Link to="/services">Companion Care</Link></li>
            </ul>
          </div>

          <div className="links-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/volunteer">Join Our Team</Link></li>
              <li><Link to="/admin/login">Admin Login</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="links-column">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/licenses">Licenses</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} GrandGuard. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
