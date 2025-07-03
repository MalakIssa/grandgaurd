import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import ForVolunteer from './pages/ForVolunteer';
import VolunteerForm from './pages/VolunteerForm';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminVolunteers from './pages/AdminVolunteers';
import AddAdmin from './pages/AddAdmin';
import Reports from './pages/Reports';
import ManageAdmins from './pages/ManageAdmins';
import AdminClients from './pages/AdminClients';
import Retrieve from './pages/Retrieve';
import ProtectedRoute from './component/protectedRoutes';
import AdminInterviews from './pages/AdminInterviews';
import './App.css';
import ScrollToTop from './ScrollToTop';

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/volunteer" element={<ForVolunteer />} />
        <Route path="/caregiver/form" element={<VolunteerForm />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/retrieve" element={<Retrieve />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/clients" element={<ProtectedRoute><AdminClients /></ProtectedRoute>} />
        <Route path="/admin/volunteers" element={<ProtectedRoute><AdminVolunteers /></ProtectedRoute>} />
        <Route path="/admin/interviews" element={<ProtectedRoute><AdminInterviews /></ProtectedRoute>} />
        <Route path="/admin/add" element={<ProtectedRoute><AddAdmin /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/admin/manage" element={<ProtectedRoute><ManageAdmins /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;