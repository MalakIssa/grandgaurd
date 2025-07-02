import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-col">
            <h3>About GrandGuard</h3>
            <p>
              Professional elderly care services dedicated to enhancing the quality of life for seniors through compassionate and reliable care.
            </p>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Our Services</Link></li>
              <li><Link to="/volunteer">Join Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Our Services</h3>
            <ul>
              <li><Link to="/services">Personal Care</Link></li>
              <li><Link to="/services">Medical Care</Link></li>
              <li><Link to="/services">Home Care</Link></li>
              <li><Link to="/services">Companion Care</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Contact Info</h3>
            <ul className="contact-info">
              <li>
                <span className="icon">📍</span>
                123 Care Street, City, State
              </li>
              <li>
                <span className="icon">📞</span>
                (555) 123-4567
              </li>
              <li>
                <span className="icon">✉️</span>
                info@grandguard.com
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} GrandGuard. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="divider">|</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 