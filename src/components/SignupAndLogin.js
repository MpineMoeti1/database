import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Style.css';

const SignupAndLogin = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true); // Default to login mode
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error message
    setSuccessMessage(''); // Clear previous success message

    try {
      const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/signup'; 
      const requestBody = { username, password };
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      if (isLogin) {
        // Handle login
        console.log('Login successful:', data);
        localStorage.setItem('userToken', data.token); // Save token
        setIsAuthenticated(true); // Update authentication state
        navigate('/dashboard'); // Navigate to dashboard
      } else {
        // Handle signup
        console.log('Signup successful');
        setSuccessMessage('Signup successful! Please log in.');

        // Automatically log the user in after signup
        const loginResponse = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        const loginData = await loginResponse.json();

        if (!loginResponse.ok) {
          throw new Error(loginData.message || 'Login after signup failed');
        }

        console.log('Login successful after signup:', loginData);
        localStorage.setItem('userToken', loginData.token); // Save token
        setIsAuthenticated(true); // Update authentication state
        navigate('/dashboard'); // Navigate to dashboard
      }
    } catch (err) {
      setError('Error: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="form-container">
      {/* Welcome Header */}
      <h2 style={{ fontStyle: 'italic' }}>Welcome to Wings Cafe Inventory System</h2>
      
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>

      {/* Success and error messages */}
      <div className="form-messages">
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <p>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupAndLogin;