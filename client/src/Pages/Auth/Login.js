
import React, { useContext, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import api from "../../api";
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { UserContext } from "../Context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const {setUser} = useContext(UserContext)
  const navigate = useNavigate();


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

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
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

    setLoading(true);

    try {
      const response = await api.post('/login', formData);
      console.log('API Response:', response.data);
      // login(response.data.token);

      const { token, userId } = response.data;

      if (!userId) {
        console.error("userId is undefined!"); // Log error if userId is missing
      }

      setUser({userId, token});


      navigate('/todo');
    } catch (err) {
      const status = err.response?.status;
      let apiError = "Login failed. Please try again.";

      if (status === 401) {
        apiError = "Invalid username or password.";
      } else if (status === 500) {
        apiError = "Server error. Please try again later.";
      } else if (err.message === 'Network Error') {
        apiError = "Network error. Please check your internet connection.";
      }

      setErrors({ apiError });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-body">
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>

          <h1 className="login-title">Login</h1>

          <div className="input-container-login">
            <FaUser className="icon" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              value={formData.username}
              className="login-input"
            />
          </div>
          {errors.username && <p className="error-message">{errors.username}</p>}

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
          {errors.password && <p className="error-message">{errors.password}</p>}

          <div className="login-btn-form">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button><br></br>
          </div>
          <Link to="/register">
            <div className="register-link">
              <p >Dont have an account? Register</p>

            </div>        </Link>

        </form>
        {errors.apiError && <p className="error-message">{errors.apiError}</p>}

      </div>
    </div>
  );
};


export default Login;


