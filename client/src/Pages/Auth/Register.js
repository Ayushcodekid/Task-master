// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import api from "../../api";
// import './Register.css';
// import { MdAlternateEmail } from "react-icons/md";
// import { FaUser, FaLock } from "react-icons/fa";
// import { GoogleLogin } from '@react-oauth/google';  // Import the GoogleLogin component
// import { UserContext } from "../Context/UserContext";


// const Register = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     username: '',
//     password: ''
//   });

//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();
//   const { setUser } = useContext(UserContext);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     // Clear errors when input changes
//     setErrors({
//       ...errors,
//       [e.target.name]: ''
//     });
//   }

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Email must be a valid email address';
//     }
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (!/^[a-zA-Z]+$/.test(formData.username)) {
//       newErrors.username = 'Username must contain only letters';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters long';
//     } else if (!/[!@#$%^&*]/.test(formData.password)) {
//       newErrors.password = 'Password must contain at least one special character';
//     }

//     return newErrors;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     try {
//       const response = await api.post('/register', formData);
//       alert(response.data.message);
//       navigate('/'); // Redirect to the login page after successful registration
//     } catch (err) {
//       setErrors({
//         apiError: err.response?.data?.message || "Registration failed"
//       });
//     }
//   }



//   const handleGoogleLogin = async (credentialResponse) => {
//     const token = credentialResponse?.credential;
//     console.log("Token from Google:", token); // Check if the token exists

//     if (!token) {
//       console.error("Google token is missing!");
//       return;
//     }

//     try {
//       const response = await api.post('/google-login', { token });
//       console.log("Google login successful:", response.data); // Confirm success response
//     } catch (error) {
//       console.error("Google login failed:", error.response?.data || error.message);
//     }
//   };



//   return (
//     <div className="register-body">
//       <div className="register-container">
//         <form className="register-form" onSubmit={handleSubmit}>
//           <h2 className="register-title">Register</h2>

//           <div className="input-container">
//             <MdAlternateEmail className="icon" />
//             <input
//               type="text"
//               name="email"
//               placeholder="Email"
//               onChange={handleChange}
//               value={formData.email}
//               className="register-input"
//             />
//           </div>
//           {errors.email && <p className="error-message">{errors.email}</p>}

//           <div className="input-container">
//             <FaUser className="icon" />
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               onChange={handleChange}
//               value={formData.username}
//               className="register-input"
//             />
//           </div>
//           {errors.username && <p className="error-message">{errors.username}</p>}

//           <div className="input-container">
//             <FaLock className="icon" />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               onChange={handleChange}
//               value={formData.password}
//               className="register-input"
//             />
//           </div>
//           {errors.password && <p className="error-message">{errors.password}</p>}

//           <div className="submit-reg">

//             <button type="submit" className="register-button">Register</button>
//             <br />

//             <Link to="/"><p className="login-text">Already have an account. Click Here</p></Link>
//             {errors.apiError && <p className="error-message">{errors.apiError}</p>}

//           </div>




//         </form>

//         <div className="google-login-container">
//           <GoogleLogin
//             onSuccess={handleGoogleLogin}
//             onError={() => setErrors({ apiError: "Google login failed" })}
//             useOneTap // Optional: Use Google One Tap login (adds the 'one-tap' experience)
//             theme="outline" // Optional: Choose the theme, can be 'filled_blue' or 'outline'
//           />
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Register;



















import { GoogleLogin } from '@react-oauth/google';
import React, { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
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



  // Handle Google login success
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const response = await api.post('/login', { credential: credentialResponse.credential });
      alert(response.data.message);
      navigate('/');
    } catch (error) {
      setErrors({
        apiError: error.response?.data?.message || "Google login failed"
      });
    }
  };



  return (
    <div className="register-body">
      <div className="register-container">
        <form className="register-form" onSubmit={handleSubmit}>
          <h2 className="register-title">Register</h2>

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
          {errors.email && <p className="error-message">{errors.email}</p>}

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
          {errors.username && <p className="error-message">{errors.username}</p>}

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
          {errors.password && <p className="error-message">{errors.password}</p>}

          <div className="submit-reg">

            <button type="submit" className="register-button">Register</button>
            <br />

            <Link to="/"><p className="login-text">Already have an account. Click Here</p></Link>
            {errors.apiError && <p className="error-message">{errors.apiError}</p>}

          </div>
        </form>

        <div className="google-login-btn">

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onFailure={() => setErrors({ apiError: "Google login failed" })}
          />
        </div>
      </div>
    </div>
  );
};

export default Register;

