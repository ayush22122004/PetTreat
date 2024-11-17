import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const handleSignup=()=>{
    navigate('/Signup')
  }
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/loginpage/', {
        username: formData.username,
        password: formData.password,
      });
      
      if (response.status === 200) {
        // Store username in localStorage or session storage
        localStorage.setItem('userDetails', JSON.stringify(response.data.user));

        // Navigate to Home page
        navigate('/Home');
      } else {
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      alert('Error during login. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
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
        <a onClick={handleSignup} style={{cursor:'pointer'}}>Don't have any account?</a>
        <button  type="submit">Login</button>

      </form>
    </div>
  );
};

export default LoginForm;
