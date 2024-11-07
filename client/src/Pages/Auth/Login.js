
// import React, { useContext, useState } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import api from "../../api";
// import './Login.css';
// import { FaUser, FaLock } from "react-icons/fa";
// import { UserContext } from "../Context/UserContext";
// import { GoogleLogin } from '@react-oauth/google';


// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const {setUser} = useContext(UserContext)
//   const navigate = useNavigate();


//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     setErrors((prevErrors) => ({
//       ...prevErrors,
//       [e.target.name]: ''
//     }));
//   }

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
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

//     setLoading(true);

//     try {
//       const response = await api.post('/login', formData);
//       console.log('API Response:', response.data);
//       // login(response.data.token);

//       const { token, userId , username} = response.data;

//       if (!userId) {
//         console.error("userId is undefined!"); // Log error if userId is missing
//       }

//       setUser({userId, token, username});


//       navigate('/todo');
//     } catch (err) {
//       const status = err.response?.status;
//       let apiError = "Login failed. Please try again.";

//       if (status === 401) {
//         apiError = "Invalid username or password.";
//       } else if (status === 500) {
//         apiError = "Server error. Please try again later.";
//       } else if (err.message === 'Network Error') {
//         apiError = "Network error. Please check your internet connection.";
//       }

//       setErrors({ apiError });
//     } finally {
//       setLoading(false);
//     }
//   }



//   const handleGoogleLogin = async (response) => {
//     try {
//       const { credential } = response;
//       const googleResponse = await api.post('/google-login', { token: credential });
//       const { userId, token, username } = googleResponse.data;
//       setUser({ userId, token, username });
//       navigate('/todo');
//     } catch (err) {
//       setErrors({ apiError: "Google login failed. Please try again." });
//     }
//   };



//   return (
//     <div className="login-body">
//       <div className="login-container">
//         <form className="login-form" onSubmit={handleSubmit}>

//           <h1 className="login-title">Login</h1>

//           <div className="input-container-login">
//             <FaUser className="icon" />
//             <input
//               type="text"
//               name="username"
//               placeholder="Username"
//               onChange={handleChange}
//               value={formData.username}
//               className="login-input"
//             />
//           </div>
//           {errors.username && <p className="error-message">{errors.username}</p>}

//           <div className="input-container-login">
//             <FaLock className="icon" />
//             <input
//               type="password"
//               name="password"
//               placeholder="Password"
//               onChange={handleChange}
//               value={formData.password}
//               className="login-input"
//             />
//           </div>
//           {errors.password && <p className="error-message">{errors.password}</p>}

//           <div className="login-btn-form">
//             <button type="submit" className="login-button" disabled={loading}>
//               {loading ? "Logging in..." : "Login"}
//             </button><br></br>
//           </div>
//           <Link to="/register">
//             <div className="register-link">
//               <p >Dont have an account? Register</p>

//             </div>        </Link>

//         </form>
//         {errors.apiError && <p className="error-message">{errors.apiError}</p>}

//         <div className="google-login-container">
//           <GoogleLogin
//             onSuccess={handleGoogleLogin}
//             onError={() => setErrors({ apiError: "Google login failed. Please try again." })}
//           />
//         </div>

//       </div>
//     </div>
//   );
// };


// export default Login;



















import React, { useContext, useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import api from "../../api";
import { UserContext } from "../Context/UserContext";
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '', // Field for either username or email
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

    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = 'Username or Email is required';
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
      return;
    }

    setLoading(true);

    const loginData = {
      username: formData.usernameOrEmail.includes('@') ? undefined : formData.usernameOrEmail,
      email: formData.usernameOrEmail.includes('@') ? formData.usernameOrEmail : undefined,
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
    } finally {
      setLoading(false);
    }
  }

  // Handle Google OAuth login

  const handleGoogleLogin = async (response) => {
    const { credential } = response;

    if (!credential) {
      console.error("No Google credential received");
      return;
    }

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
          <h1 className="login-title" style={{color: 'white'}}>Login</h1>

          <div className="input-container-login">
            <FaUser className="icon" />
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              onChange={handleChange}
              value={formData.usernameOrEmail}
              className="login-input"
            />
          </div>
          {errors.usernameOrEmail && <p className="error-message">{errors.usernameOrEmail}</p>}

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
            </button><br />
          </div>

          <div className="register-link">
            <Link to="/register">
              <p style={{color: 'white'}}>Don't have an account? Register</p>
            </Link>
          </div>



        </form>
        {errors.apiError && <p className="error-message">{errors.apiError}</p>}

        {/* Google Login Button */}
        <div className="google-login-btn">
          <GoogleLogin
            clientId={Client_ID}
            buttonText="Login with Google"
            onSuccess={handleGoogleLogin}
            onFailure={handleGoogleFailure}
            cookiePolicy="single_host_origin"
          />
        </div>

      </div>
    </div>
  );
};

export default Login;
