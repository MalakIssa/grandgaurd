import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const AdminNavbar = () => {
  return (
    <nav className="navbar admin-navbar">
      <Link className="nav-brand" to="/admin/dashboard">Admin Panel</Link>
      <div className="nav-links-container">
        <ul className="nav-items">
          <li className="nav-item"><Link className="nav-link" to="/admin/dashboard">Dashboard</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/clients">Clients</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/volunteers">Caregivers</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/interviews">Interviews</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/reports">Reports</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/admin/manage">Manage Admins</Link></li>
        </ul>
      </div>
      <div className="nav-button-container">
        <Link to="/" className="book-button">Main Site</Link>
      </div>
    </nav>
  );
};

export default AdminNavbar; 