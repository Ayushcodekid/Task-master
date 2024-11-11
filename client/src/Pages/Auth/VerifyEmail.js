import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from "../../api";
import toast, { Toaster } from 'react-hot-toast';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract the token from the query parameters
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    
    if (token) {
      // Send the token to the backend for verification
      api.get(`/verify-email?token=${token}`)
        .then(response => {
          setMessage(response.data.message);
          toast.success(response.data.message);
          navigate('/'); // Redirect user to login page after successful verification
        })
        .catch(error => {
          setMessage(error.response?.data?.message || 'Verification failed');
          toast.error(error.response?.data?.message || 'Verification failed');
        })
        .finally(() => setLoading(false));
    } else {
      setMessage('Verification token is missing');
      setLoading(false);
    }
  }, [location, navigate]);

  return (
    <div className="verify-email-container">
      <Toaster position="top-center" />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="message">
          <h2>{message}</h2>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
