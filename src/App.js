import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import ForVolunteer from './pages/ForVolunteer';
import Volunteer from './pages/Volunteer';
import ContactUs from './pages/ContactUs';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/volunteer" element={<ForVolunteer />} />
        <Route path="/volunteer/form" element={<Volunteer />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App; 