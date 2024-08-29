// import React, { useState } from "react";
// import { login } from "../../auth";
// import api from "../../api";
// import { useNavigate, Link } from 'react-router-dom';
// import './Login.css';



// const Login =() =>{

// const [formData, setformData]= useState({
//     username: '',
//     password:''
// })

// const navigate = useNavigate();



// const handleChange= (e)=>{
//     setformData({
//         ...formData, 
//         [e.target.name]: e.target.value
//     })
// }


// const handleSubmit = async(e) =>{

//     e.preventDefault();

//     console.log("Form Data:", formData);

//     try{
//         const response= await api.post('/login', formData);
//         console.log("API Response:", response); // Log API response for debugging

//         login(response.data.token)
//         // alert(response.data.message || "Login successfull")
//         navigate('/todo'); 

//     }

//     catch(err){
//         console.log("Error:", err); // Log the error for debugging

//         alert(err.response.data.message || "Login failed")
//     }
// }




//   return (

//     <div className="login-container">
//     <h2 className="login-title">Login</h2>
//     <form className="login-form" onSubmit={handleSubmit}>
//       <input 
//         type="text" 
//         name="username" 
//         placeholder="Username" 
//         onChange={handleChange} 
//         value={formData.username} 
//         required 
//         className="login-input"
//       />
//       <input 
//         type="password" 
//         name="password" 
//         placeholder="Password" 
//         onChange={handleChange} 
//         value={formData.password} 
//         required 
//         className="login-input"
//       />
//       <button type="submit" className="login-button">Login</button><br></br>
//       <Link to ="/register"><button type="submit" className="register-button-1">Register</button></Link>

//     </form>
//   </div>
// );
// };


// export default Login;



















import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import api from "../../api";
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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

      localStorage.setItem('userId', userId)
      localStorage.setItem('token', token)


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

  <div className="user-form">
      <FaUser className="user-icon"/>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
          className="login-input"
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
        </div>


        <div className="password-form">

        <FaLock className="lock-icon"/>

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className="login-input"
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
      </div>
      <div className="login-btn-form">
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button><br></br>
        </div>
        <Link to="/register">
          <div className="register-link">
            <p>Dont have an account? Register</p>

          </div>        </Link>

      </form>
      {errors.apiError && <p className="error-message">{errors.apiError}</p>}

    </div>
    </div>
  );
};


export default Login;


