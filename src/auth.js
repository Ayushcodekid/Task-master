// import axios from 'axios';

// export const login = async (username, password) => {
//   try {
//     const response = await axios.post('/api/login', { username, password });
//     const { token } = response.data;
//     localStorage.setItem('token', token);
//     return response.data;
//   } catch (error) {
//     throw new Error('Login failed');
//   }
// };

// export const isLoggedIn = () => {
//   return !!localStorage.getItem('token');
// };







export const login = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };
  