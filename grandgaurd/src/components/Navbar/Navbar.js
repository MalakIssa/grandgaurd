import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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
      
      <div className="nav-links-container">
        <ul className="nav-items">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link className="nav-link" to={item.href}>
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