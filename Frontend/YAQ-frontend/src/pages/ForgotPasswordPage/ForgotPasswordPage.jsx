import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordPage.css'; // Import CSS for forgot password page

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);  // Start loading state

    // Validate input field
    if (!email) {
      setError('Email is required.');
      setLoading(false);
      return;
    }

    try {
      // Send password reset request here (adjust API call as necessary)
      // const response = await userAPI.sendPasswordReset({ email });

      // Example of success response
      alert('Password reset link sent!');
      navigate('/login'); // Navigate back to the login page after successful reset

    } catch (error) {
      console.error('Error resetting password', error);
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);  // Set loading to false after the request is finished
    }
  };

  return (
    <div className="center-wrapper">
      <div className="forgot-password-container">
        <h2 className="forgot-password-title">Forgot Password</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            className="forgot-password-input"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="forgot-password-button" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="back-to-login-link" onClick={() => navigate('/login')}>
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
