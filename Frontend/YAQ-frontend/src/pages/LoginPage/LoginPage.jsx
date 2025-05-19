import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';
import * as userAPI from '../../utilities/user-api'; // Import user API functions

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);  // Start loading state

    // Validate input fields
    if (!username || !password) {
      setError('Both fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await userAPI.login({ username, password });
      
      setUser(response.user);

      if (response.access && response.refresh && response.role) {
        // Store tokens in localStorage
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);

        alert('Login successful!');

        const userRole = response.role;  

        // Navigate based on user role
        if (userRole === 'patient') {
          navigate('/patient-dashboard');
        } else if (userRole === 'doctor') {
          navigate('/doctor-dashboard');
        } else {
          navigate('/');  // Redirect to home page or another appropriate page
        }
      } else {
        setError('Invalid response from the server.');
      }
    } catch (error) {
      console.error('Error logging in', error);
      setError('Login failed. Check your credentials.');
    } finally {
      setLoading(false);  // Set loading to false after the request is finished
    }
  };

  return (
    <div className="center-wrapper">
      <div className="login-container">
        <h2 className="login-title">Login</h2>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            className="login-input"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="login-input"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="form-links">
          <p className="register-link">Don't have an account? <Link to="/signup">Register here</Link></p>
          <p className="forgot-password-link"><Link to="/forgot-password">Forgot Password?</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
