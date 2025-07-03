import React from 'react';
import { Link } from 'react-router-dom';
import elderycare2 from '../images/elderycare2.png';
import elderycare3 from '../images/elderycare3.png';
import elderycare1 from '../images/elderycare1.png';
import elderlycare4 from '../images/elderlycare4.png';
import icons8car from '../images/car.png';
import healthyLifestyle from '../images/healthy-lifestyle.png';
import icons8WindowsCalendar from '../images/icons8-windows-calendar-48.png';
import oldWoman from '../images/old-woman.png';
import hospital from '../images/hospital.png';
import home from '../images/home.png';
import handshake from '../images/handshake.png';
import './Services.css';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';

const Services = () => {
  const mainServices = [
    {
      id: 1,
      icon: <img src={oldWoman} alt="Personal Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Personal Care",
      description: "Comprehensive personal care services tailored to individual needs",
      details: [
        "Assistance with bathing and grooming",
        "Mobility support and fall prevention",
        "Medication reminders and management",
        "Dressing and personal appearance assistance",
        "Toileting and incontinence care"
      ],
      image: elderycare2
    },
    {
      id: 2,
      icon: <img src={hospital} alt="Medical Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Medical Care",
      description: "Professional medical supervision and health monitoring",
      details: [
        "Vital signs monitoring",
        "Medication administration",
        "Wound care and dressing changes",
        "Chronic disease management",
        "Coordination with healthcare providers"
      ],
      image: elderlycare4
    },
    {
      id: 3,
      icon: <img src={home} alt="Home Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Home Care",
      description: "The caregiver will take care of the elderly in 3 shifts: day, night, and full. Users may customize their preferred shift arrangement.",
      details: [
        "Day shift care",
        "Night shift care",
        "Full shift (7 AM to 7 PM) care",
        "Flexible scheduling based on user needs",
        "Personalized shift arrangements"
      ],
      image: elderycare1
    },
    {
      id: 4,
      icon: <img src={handshake} alt="Companion Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Companion Care",
      description: "Emotional support and social engagement",
      details: [
        "Friendly conversation and companionship",
        "Social activities and games",
        "Accompaniment to appointments",
        "Reading and letter writing",
        "Memory exercises and cognitive stimulation"
      ],
      image: elderycare3
    }
  ];

  const additionalServices = [
    {
      icon: <img src={icons8car} alt="Transportation" style={{ width: 32, height: 32, verticalAlign: 'middle' }} />,
      title: "Transportation",
      description: "Safe and reliable transportation for appointments and activities"
    },
    {
      icon: <img src={icons8WindowsCalendar} alt="Respite Care" style={{ width: 32, height: 32, verticalAlign: 'middle' }} />,
      title: "Respite Care",
      description: "Temporary relief for family caregivers"
    },
    {
      icon: "🌙",
      title: "Overnight Care",
      description: "24/7 supervision and assistance when needed"
    },
    {
      icon: <img src={healthyLifestyle} alt="Exercise Support" style={{ width: 32, height: 32, verticalAlign: 'middle' }} />,
      title: "Exercise Support",
      description: "Support with daily movement, stretching, and gentle activities to promote mobility and well-being."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="services-page">
        {/* Hero Section */}
        <section className="services-hero">
          <div className="container">
            <h1>Our Services</h1>
            <p>Comprehensive care solutions tailored to your unique needs</p>
          </div>
        </section>

        {/* Main Services Section */}
        <section className="main-services">
          <div className="container">
            <div className="services-intro">
              <h2>Core Care Services</h2>
              <p>
                We offer a wide range of professional care services designed to support
                seniors in maintaining their independence and quality of life. Each
                service is personalized to meet individual needs and preferences.
              </p>
            </div>

            <div className="services-grid">
              {mainServices.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-header">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                  <div className="service-details">
                    <ul>
                      {service.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="service-image">
                    <img src={service.image} alt={service.title} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services Section */}
        <section className="additional-services">
          <div className="container">
            <h2>Additional Support Services</h2>
            <div className="additional-services-grid">
              {additionalServices.map((service, index) => (
                <div key={index} className="additional-service-card">
                  <span className="additional-service-icon">{service.icon}</span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Get Started?</h2>
              <p>
                Contact us today to learn more about our services and how we can create
                a personalized care plan for your loved one.
              </p>
              <div className="cta-buttons">
                <Link to="/contact" className="primary-button" onClick={() => window.scrollTo(0,0)}>
                  Contact Us
                  <span className="arrow">→</span>
                </Link>
                <Link to="/about" className="secondary-button">
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Services;


