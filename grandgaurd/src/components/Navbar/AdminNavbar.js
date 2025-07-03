import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar admin-navbar">
      <Link className="nav-brand" to="/admin/dashboard">Admin Panel</Link>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
        <span className="hamburger-bar"></span>
      </button>
      <div className={`nav-links-container${menuOpen ? ' open' : ''}`}>
        <ul className="nav-items">
          <li className="nav-item"><Link className="nav-link" to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/clients" onClick={() => setMenuOpen(false)}>Clients</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/volunteers" onClick={() => setMenuOpen(false)}>Caregivers</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/interviews" onClick={() => setMenuOpen(false)}>Interviews</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/reports" onClick={() => setMenuOpen(false)}>Reports</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/manage" onClick={() => setMenuOpen(false)}>Manage Admins</Link></li>
        </ul>
      </div>
      <div className="nav-button-container">
        <Link to="/" className="book-button">Main Site</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar; 