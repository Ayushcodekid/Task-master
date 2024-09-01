import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import api from "../../api";
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when input changes
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  }

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid email address';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z]+$/.test(formData.username)) {
      newErrors.username = 'Username must contain only letters';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    return newErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await api.post('/register', formData);
      alert(response.data.message);
      navigate('/'); // Redirect to the login page after successful registration
    } catch (err) {
      setErrors({
        apiError: err.response?.data?.message || "Registration failed"
      });
    }
  }

  return (
    <div className="register-body">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="register-title">Register</h2>

          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="register-input"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

      

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={formData.username}
            className="register-input"
          />
          {errors.username && <p className="error-message">{errors.username}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="register-input"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}


          <div className="submit-reg">

            <button type="submit" className="register-button">Register</button>
            <br />

            <Link to="/"><button type="button" className="login-button-1">Login</button></Link>
            {errors.apiError && <p className="error-message">{errors.apiError}</p>}

          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

