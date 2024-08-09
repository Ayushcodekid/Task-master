import React, { useState } from "react";
import api from "../../api";
import { useNavigate,Link } from 'react-router-dom';
import './Register.css';



const Register = () => {

const [formData, setformData]= useState({
  firstName: '',
    lastName: '',
    username: '',
    password: ''
})

const navigate = useNavigate();



const handleChange= (e)=>{
  setformData({
    ...formData,
    [e.target.name]: e.target.value
  })
}


const handleSubmit= async (e)=>{
  e.preventDefault();

  try{
    const response = await api.post('/register', formData)
    alert(response.data.message)
    navigate('/'); // Redirect to the login page after successful registration

  }

  catch(err){
    alert(err.response.data.message)
  }
}










  return (
    <div className="register-container">
      <h2 className="register-title">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="firstName" 
          placeholder="First Name" 
          onChange={handleChange} 
          value={formData.firstName} 
          required 
          className="register-input"
        />
        <input 
          type="text" 
          name="lastName" 
          placeholder="Last Name" 
          onChange={handleChange} 
          value={formData.lastName} 
          required 
          className="register-input"
        />
        <input 
          type="text" 
          name="username" 
          placeholder="Username" 
          onChange={handleChange} 
          value={formData.username} 
          required 
          className="register-input"
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          value={formData.password} 
          required 
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button><br></br>
       <Link to ="/"><button type="submit" className="login-button-1">Login</button></Link> 

      </form>
    </div>
  );
};


export default Register;