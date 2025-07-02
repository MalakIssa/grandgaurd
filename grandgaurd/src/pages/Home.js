import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import dashboardImage from '../images/dashboardPicture.png';
import elderycare1 from '../images/elderycare1.png';
import caregivertalking from '../images/caregivertalking.png';
import oldWoman from '../images/old-woman.png';
import hospital from '../images/hospital.png';
import home from '../images/home.png';
import handshake from '../images/handshake.png';
import star from '../images/star.png';
import clock from '../images/clock.png';
import heart from '../images/heart.png';
import './Home.css';
import supabase from './supabaseClient';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../Footer/Footer';

const Home = () => {
  const services = [
    {
      id: 1,
      icon: <img src={oldWoman} alt="Personal Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Personal Care",
      description: "Assistance with daily activities, hygiene, and mobility to maintain independence and dignity."
    },
    {
      id: 2,
      icon: <img src={hospital} alt="Medical Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Medical Care",
      description: "Professional medical supervision and assistance with medications and health monitoring."
    },
    {
      id: 3,
      icon: <img src={home} alt="Home Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Home Care",
      description: "The caregiver will take care of the elderly in 3 shifts: day, night, and full. Users may customize their preferred shift arrangement."
    },
    {
      id: 4,
      icon: <img src={handshake} alt="Companion Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Companion Care",
      description: "Friendly companionship, emotional support, and social interaction for a fulfilling lifestyle."
    }
  ];

  const features = [
    {
      icon: <img src={star} alt="Expert Caregivers" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Expert Caregivers",
      description: "Our team consists of certified professionals with years of experience."
    },
    {
      icon: <img src={clock} alt="24/7 Support" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "24/7 Support",
      description: "Round-the-clock care and support whenever you need us."
    },
    {
      icon: <img src={heart} alt="Personalized Care" style={{width: 32, height: 32, verticalAlign: 'middle'}} />,
      title: "Personalized Care",
      description: "Customized care plans tailored to individual needs and preferences."
    }
  ];

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('volunteer_reviews')
        .select('review_text, user_id, clients(full_name)')
        .eq('rating', 5);
      if (!error && data) setReviews(data);
    }
    fetchReviews();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-page">
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
                <img src={elderycare1} alt="Caregiver with elderly" />
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
              {reviews.length > 0 ? reviews.map((review, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"{review.review_text}"</p>
                    <div className="testimonial-author">
                      <h4>{review.clients?.full_name || 'Anonymous'}</h4>
                    </div>
                  </div>
                </div>
              )) : <p>No reviews found for the selected date.</p>}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;