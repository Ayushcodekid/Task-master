import React, { useState } from "react";
import { login } from "../../auth";
import api from "../../api";
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';



const Login =() =>{

const [formData, setformData]= useState({
    username: '',
    password:''
})

const navigate = useNavigate();



const handleChange= (e)=>{
    setformData({
        ...formData, 
        [e.target.name]: e.target.value
    })
}


const handleSubmit = async(e) =>{

    e.preventDefault();

    console.log("Form Data:", formData);

    try{
        const response= await api.post('/login', formData);
        console.log("API Response:", response); // Log API response for debugging

        login(response.data.token)
        // alert(response.data.message || "Login successfull")
        navigate('/todo'); 

    }

    catch(err){
        console.log("Error:", err); // Log the error for debugging

        alert(err.response.data.message || "Login failed")
    }
}




  return (
  
    <div className="login-container">
    <h2 className="login-title">Login</h2>
    <form className="login-form" onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="username" 
        placeholder="Username" 
        onChange={handleChange} 
        value={formData.username} 
        required 
        className="login-input"
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Password" 
        onChange={handleChange} 
        value={formData.password} 
        required 
        className="login-input"
      />
      <button type="submit" className="login-button">Login</button><br></br>
      <Link to ="/register"><button type="submit" className="register-button-1">Register</button></Link>

    </form>
  </div>
);
};


export default Login;