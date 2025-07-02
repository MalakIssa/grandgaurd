import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import caregiverwithelderly from '../images/caregiverwithelderly.png';
import caregivertalking from '../images/caregivertalking.png';
import dashboardImage from '../images/dashboardPicture.png';
import './Services.css';

const Services = () => {
  const mainServices = [
    {
      id: 1,
      icon: "👵",
      title: "Personal Care",
      description: "Comprehensive personal care services tailored to individual needs",
      details: [
        "Assistance with bathing and grooming",
        "Mobility support and fall prevention",
        "Medication reminders and management",
        "Dressing and personal appearance assistance",
        "Toileting and incontinence care"
      ],
      image: caregiverwithelderly
    },
    {
      id: 2,
      icon: "🏥",
      title: "Medical Care",
      description: "Professional medical supervision and health monitoring",
      details: [
        "Vital signs monitoring",
        "Medication administration",
        "Wound care and dressing changes",
        "Chronic disease management",
        "Coordination with healthcare providers"
      ],
      image: caregivertalking
    },
    {
      id: 3,
      icon: "🏠",
      title: "Home Care",
      description: "Maintaining a safe and comfortable living environment",
      details: [
        "Light housekeeping and cleaning",
        "Meal planning and preparation",
        "Laundry and linen changing",
        "Shopping and errands",
        "Home safety assessments"
      ],
      image: dashboardImage
    },
    {
      id: 4,
      icon: "🤝",
      title: "Companion Care",
      description: "Emotional support and social engagement",
      details: [
        "Friendly conversation and companionship",
        "Social activities and games",
        "Accompaniment to appointments",
        "Reading and letter writing",
        "Memory exercises and cognitive stimulation"
      ],
      image: caregivertalking
    }
  ];

  const additionalServices = [
    {
      icon: "🚗",
      title: "Transportation",
      description: "Safe and reliable transportation for appointments and activities"
    },
    {
      icon: "📅",
      title: "Respite Care",
      description: "Temporary relief for family caregivers"
    },
    {
      icon: "🌙",
      title: "Overnight Care",
      description: "24/7 supervision and assistance when needed"
    },
    {
      icon: "🏃",
      title: "Exercise Support",
      description: "Assisted physical activities and exercise programs"
    }
  ];

  return (
    <div className="services-page">
      <Navbar />
      
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
                  <span className="service-icon">{service.icon}</span>
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
              <Link to="/contact" className="primary-button">
                Schedule a Consultation
                <span className="arrow">→</span>
              </Link>
              <Link to="/about" className="secondary-button">
                Learn More About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services; 