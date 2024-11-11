


import React, { useContext, useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import api from "../../api";
import { UserContext } from "../Context/UserContext";
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '', // Field for either username or email
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const Client_ID = "1030045454770-o702q1tv5t6s1p99m0vuqgbuf6cf1kcg.apps.googleusercontent.com"
  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [e.target.name]: ''
    }));
  }

  // Validation logic for username and password
  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      // newErrors.email = 'Email is required';
      toast.error('Email is required');  // Show toast error for email validation
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      // newErrors.email = 'Please enter a valid email';
      toast.error('Please enter a valid email');  // Show toast error for invalid email format
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  }

  // Handle form submission (for username/password login)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      for (let error in validationErrors) {
        toast.error(validationErrors[error]);  
      }
      return;
    }

    const loadingToast = toast.loading('Logging in...');

    setLoading(true);

    const loginData = {
      email: formData.email, // Only sending email
      password: formData.password,
    };

    try {
      const response = await api.post('/login', loginData);
      console.log('API Response:', response.data);

      const { token, userId, username, email } = response.data;

      if (!userId) {
        console.error("userId is undefined!"); // Log error if userId is missing
      }

      setUser({ userId, token, username, email });
      toast.success('Login successful'); // Show success message via Toastify

      navigate('/todo');
    } catch (err) {
      const status = err.response?.status;
      let apiError = "Login failed. Please try again.";

      if (status === 401) {
        apiError = "Please log in using Google."; // This is the custom error for Google signups
      } else if (status === 403) {
        apiError = "Invalid password. Please check your credentials."; // Invalid password error
      } else if (status === 500) {
        apiError = "Server error. Please try again later.";
      } else if (status === 404) {
        apiError = "User not found.";
      }
      else if (err.message === 'Network Error') {
        apiError = "Network error. Please check your internet connection.";
      }


      setErrors({ apiError });
      toast.error(apiError); // Show API error via Toastify

    } finally {
      setLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast

    }
  }

  // Handle Google OAuth login

  const handleGoogleLogin = async (response) => {
    const { credential } = response;

    if (!credential) {
      console.error("No Google credential received");
      return;
    }
    const loadingToast = toast.loading('Logging in with Google...');

    setLoading(true);

    try {
      const googleResponse = await api.post('/login', { credential });
      const { token, userId, username } = googleResponse.data;

      setUser({ userId, token, username });
      navigate('/todo');
    } catch (err) {
      setErrors({ apiError: "Google login failed. Please try again." });
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast

    }
  };


  const handleGoogleFailure = (error) => {
    console.error("Google login error", error);
    setErrors({ apiError: "Google login failed. Please try again." });
  }

  return (
    <div className="login-body">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h1 className="login-title" style={{ color: 'white' }}>Login</h1>

          {/* Google Login Button */}
          <GoogleLogin
            clientId={Client_ID}
            buttonText="Login with Google"
            onSuccess={handleGoogleLogin}
            onFailure={handleGoogleFailure}
            cookiePolicy="single_host_origin"
            size="large"
            shape="square"  
            />






          <div className="input-container-login">
            <FaUser className="icon" />
            <input
              type="email" // Updated to email type
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              className="login-input"
            />
          </div>
          {/* {errors.usernameOrEmail && <p className="error-message">{errors.usernameOrEmail}</p>} */}

          <div className="input-container-login">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              className="login-input"
            />
          </div>
          {/* {errors.password && <p className="error-message">{errors.password}</p>} */}

          <div className="login-btn-form">
            <button type="submit" className="login-button" disabled={loading}>Login</button><br />
          </div>

          <div className="register-link">
            <Link to="/register">
              <p className="p-text" style={{ color: 'white' }}>Don't have an account? Register</p>
            </Link>
          </div>



        </form>
        {/* {errors.apiError && <p className="error-message">{errors.apiError}</p>} */}



      </div>
      <Toaster position="top-center" />

    </div>
  );
};

export default Login;
