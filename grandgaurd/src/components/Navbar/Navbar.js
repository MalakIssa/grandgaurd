import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Service', href: '/services' },
    { label: 'Join as a Caregiver', href: '/volunteer' },
    { label: 'Contact Us', href: '/contact' }
  ];

  return (
    <nav className="navbar">
      <Link className="nav-brand" to="/">GrandGuard</Link>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>
      <div className={`nav-links-container${menuOpen ? ' open' : ''}`}>
        <ul className="nav-items">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link className="nav-link" to={item.href} onClick={() => setMenuOpen(false)}>
                <span className="nav-link-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="nav-button-container">
        <Link to="/admin/login" className="book-button">Admin Portal</Link>
      </div>
    </nav>
  );
};

export default Navbar;