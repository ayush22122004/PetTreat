import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import { useNavigate } from 'react-router-dom';

// Function to retrieve the CSRF token from cookies
function getCSRFToken() {
  let csrfToken = null;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('csrftoken=')) {
      csrfToken = cookie.substring('csrftoken='.length, cookie.length);
      break;
    }
  }
  return csrfToken;
}

const FormComponent = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    country: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/');
  };
  const handleHome = () => {
    navigate('/Home');
  };


  const [alertMessage, setAlertMessage] = useState(''); // To handle the alert message

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const csrfToken = getCSRFToken(); // Retrieve CSRF token
      const response = await axios.post('http://127.0.0.1:8000/api/submit-form/', formData, {
        headers: {
          'X-CSRFToken': csrfToken,  // Include CSRF token in headers
        },
      });
      setAlertMessage('Form submitted successfully!'); // Set success message
      setFormData({
        username: '',
        password: '',
        email: '',
        country: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
      }); // Clear form data
    } catch (error) {
      setAlertMessage('Error submitting form. Please try again.'); // Set error message
    }

    // Clear the alert message after 3 seconds
    setTimeout(() => setAlertMessage(''), 3000);
  };

  return (
    <div>
      {alertMessage && (
        <div style={{ color: alertMessage.includes('Error') ? 'red' : 'green' }}>
          {alertMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className='signupForm'>
        <h1>Sign Up</h1>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          required
        />
        <input
          type="text"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          placeholder="PIN Code"
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
        />
        <a onClick={handleLogin} style={{ cursor: 'pointer' }}>Already have an account?</a>
        <button type="submit" onClick={handleHome}>Submit</button>
      </form>
    </div>
  );
};

export default FormComponent;
