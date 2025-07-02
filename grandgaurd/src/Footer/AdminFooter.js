import React from 'react';
import './Footer.css';

const AdminFooter = () => {
  return (
    <footer className="site-footer admin-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>GrandGuard Admin</h3>
          <p>Admin Panel &copy; {new Date().getFullYear()}</p>
        </div>
        <div className="footer-links">
          <div className="links-column">
            <h4>Quick Links</h4>
            <ul>
              <li>Dashboard</li>
              <li>Volunteers</li>
              <li>Clients</li>
              <li>Reports</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter; 