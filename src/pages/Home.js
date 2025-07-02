import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import dashboardImage from '../images/dashboardPicture.png';
import caregiverwithelderly from '../images/caregiverwithelderly.png';
import caregivertalking from '../images/caregivertalking.png';
import './Home.css';

const Home = () => {
  const services = [
    {
      id: 1,
      icon: "👵",
      title: "Personal Care",
      description: "Assistance with daily activities, hygiene, and mobility to maintain independence and dignity."
    },
    {
      id: 2,
      icon: "🏥",
      title: "Medical Care",
      description: "Professional medical supervision and assistance with medications and health monitoring."
    },
    {
      id: 3,
      icon: "🏠",
      title: "Home Care",
      description: "Comprehensive home care services including cleaning, meal preparation, and household management."
    },
    {
      id: 4,
      icon: "🤝",
      title: "Companion Care",
      description: "Friendly companionship, emotional support, and social interaction for a fulfilling lifestyle."
    }
  ];

  const features = [
    {
      icon: "⭐",
      title: "Expert Caregivers",
      description: "Our team consists of certified professionals with years of experience."
    },
    {
      icon: "🕒",
      title: "24/7 Support",
      description: "Round-the-clock care and support whenever you need us."
    },
    {
      icon: "💝",
      title: "Personalized Care",
      description: "Customized care plans tailored to individual needs and preferences."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Family Member",
      content: "The care and attention my mother receives from GrandGuard is exceptional. The caregivers are not just professionals; they're now like family.",
      image: caregivertalking
    },
    {
      name: "Robert Wilson",
      role: "Client",
      content: "I couldn't be happier with the services. The team is always punctual, professional, and genuinely caring.",
      image: caregiverwithelderly
    }
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Professional Care <br />
              for Your Loved Ones
            </h1>
            <p>
              Providing compassionate and reliable elderly care services to help seniors
              maintain their independence and quality of life in the comfort of their own homes.
            </p>
            <div className="hero-buttons">
              <Link to="/contact" className="primary-button">
                Get Started
                <span className="arrow">→</span>
              </Link>
              <Link to="/about" className="secondary-button">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src={dashboardImage} alt="Elderly care services" />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive care solutions tailored to your needs</p>
          </div>
          <div className="services-grid">
            {services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-content">
            <div className="features-image">
              <img src={caregiverwithelderly} alt="Caregiver with elderly" />
            </div>
            <div className="features-text">
              <h2>Why Choose GrandGuard?</h2>
              <p>
                We're committed to providing the highest quality of care with a
                personal touch that makes all the difference.
              </p>
              <div className="features-grid">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">{feature.icon}</div>
                    <div className="feature-info">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>
              Contact us today to learn more about our services and how we can help
              your loved ones live their best life.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="primary-button">
                Contact Us
              </Link>
              <Link to="/volunteer" className="secondary-button">
                Join Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Clients Say</h2>
            <p>Real stories from families we've helped</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home; 