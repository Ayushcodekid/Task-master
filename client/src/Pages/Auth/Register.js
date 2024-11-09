import { GoogleLogin } from '@react-oauth/google';
import React, { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';  // Import CSS for toastify
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
      toast.error('Email is required');  // Show toast error for email validation
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email must be a valid email address';
      toast.error('Email must be a valid email address');  // Show toast error for invalid email format
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      toast.error('Username is required');  // Show toast error for username validation
    } else if (!/^[a-zA-Z]+$/.test(formData.username)) {
      newErrors.username = 'Username must contain only letters';
      toast.error('Username must contain only letters');  // Show toast error for invalid username format
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
      toast.error('Password is required');  // Show toast error for password validation
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      toast.error('Password must be at least 8 characters long');  // Show toast error for short password
    } else if (!/[!@#$%^&*]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
      toast.error('Password must contain at least one special character');  // Show toast error for missing special character
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
      toast.success(response.data.message); // Toast notification on success
      navigate('/'); // Redirect to the login page after successful registration
    } catch (err) {
      setErrors({
        apiError: err.response?.data?.message || "Registration failed"
      });

      toast.error(err.response?.data?.message || "Registration failed"); // Toast notification on error

    }
  }



  // Handle Google login success
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await api.post('/login', { credential: credentialResponse.credential });
      toast.success(response.data.message); // Toast notification on success
      navigate('/');
    } catch (error) {
      setErrors({
        apiError: error.response?.data?.message || "Google login failed"
      });

      toast.error(error.response?.data?.message || "Google login failed"); // Toast notification on error

    }
  };



  return (
    <div className="register-body">
      <div className="register-container">
      <Toaster position="top-center" />

        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="register-title">Register</h2>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onFailure={() => toast.error("Google login failed")}
          />

          <div className="input-container">
            <MdAlternateEmail className="icon" />
            <input
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              className="register-input"
            />
          </div>
          {/* {errors.email && <p className="error-message">{errors.email}</p>} */}

          <div className="input-container">
            <FaUser className="icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={formData.username}
              className="register-input"
            />
          </div>
          {/* {errors.username && <p className="error-message">{errors.username}</p>} */}

          <div className="input-container">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              className="register-input"
            />
          </div>
          {/* {errors.password && <p className="error-message">{errors.password}</p>} */}

          <div className="submit-reg">

            <button type="submit" className="register-button">Register</button>
            <br />

            <Link to="/"><p className="login-text">Already have an account. Click Here</p></Link>
            {/* {errors.apiError && <p className="error-message">{errors.apiError}</p>} */}

          </div>
        </form>

        <div className="google-login-btn">

          
        </div>
      </div>
    </div>
  );
};

export default Register;

