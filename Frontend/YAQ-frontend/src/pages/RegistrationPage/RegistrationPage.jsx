import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegistrationPage.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Eye icons for toggling visibility
import * as userAPI from '../../utilities/user-api'; // Import user API functions

function Registration() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('user'); // Default role is 'user'
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  // Basic validation functions
  const validateUsername = (username) => {
    const regex = /^[a-zA-Z]{3,}$/;  // Only letters and minimum 3 characters
    return regex.test(username);
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Clear success message

    // Basic validation for all roles
    if (!username || !email || !password) {
      setError('All required fields must be filled.');
      return;
    }
    if (!validateUsername(username)) {
      setError('Username must be at least 3 characters long and contain only letters.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Additional validations for Doctor role
    if (userRole === 'doctor') {
      if (!specialization || !certificateId) {
        setError('Please fill in all doctor-specific fields.');
        return;
      }
    }

    try {
      const registrationData = { username, email, password, userRole };
      if (userRole === 'doctor') {
        registrationData.specialization = specialization;
        registrationData.certificateId = certificateId;
        registrationData.status = 'pending'; // Set the status as pending for admin review
      }

      const response = await userAPI.register(registrationData);

      if (response.success) {
        if (userRole === 'user') {
          setSuccessMessage('Registration successful!'); // Success message for User
          setTimeout(() => navigate('/user-dashboard'), 2000); // Redirect after 2 seconds
        } else if (userRole === 'doctor') {
          setSuccessMessage('Your request will be reviewed by the admin.');
          setTimeout(() => navigate('/doctor-dashboard'), 2000); // Redirect after 2 seconds
        } else {
          navigate('/');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering', error);
      setError('An error occurred during registration.');
    }
  };

  return (
    <div className="center-wrapper">
      <div className="register-container">
        <h2 className="register-title">Create an Account</h2>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Success message display */}

        {/* Role Selection Dropdown */}
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="register-select"
        >
          <option value="user">User</option>
          <option value="doctor">Doctor</option>
        </select>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Username Input */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            className="register-input"
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="register-input"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Show additional fields for Doctor */}
          {userRole === 'doctor' && (
            <>
              <input
                type="text"
                placeholder="Specialization"
                value={specialization}
                className="register-input"
                onChange={(e) => setSpecialization(e.target.value)}
              />
              <input
                type="text"
                placeholder="SCFHS Certificate ID"
                value={certificateId}
                className="register-input"
                onChange={(e) => setCertificateId(e.target.value)}
              />
            </>
          )}

          {/* Password Input */}
          <div className="password-field">
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              className="register-input"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="eye-icon" onClick={togglePasswordVisibility}>
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        <p className="login-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Registration;
