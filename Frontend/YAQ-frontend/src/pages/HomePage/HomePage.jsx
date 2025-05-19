import { Link } from 'react-router-dom';
import { FaRegHospital, FaRegHandPaper, FaUserMd } from 'react-icons/fa'; // Importing icons from react-icons
import './HomePage.css';
import Video from '../../assets/videos/LoginVL.mp4'; 

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section with Video Background */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <video autoPlay loop muted className="background-video">
          <source src={Video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-content">
          <h1>Welcome to YaqeenMed</h1>
          <p>Your trusted platform for sharing and reviewing radiology results</p>
          <div className="cta-buttons">
            <Link to="/signup" className="cta-button">Get Started</Link>
            <Link to="/login" className="cta-button">Login</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-container">
          <div className="feature">
            <FaRegHospital className="feature-icon" />
            <h3>Consult Doctors</h3>
            <p>Submit your radiology results and get quick consultations from top doctors.</p>
          </div>
          <div className="feature">
            <FaRegHandPaper className="feature-icon" />
            <h3>Easy to Use</h3>
            <p>Our platform is easy to use, intuitive, and accessible for all users.</p>
          </div>
          <div className="feature">
            <FaUserMd className="feature-icon" />
            <h3>Safe and Secure</h3>
            <p>Your privacy is our priority. All data is securely stored and encrypted.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
