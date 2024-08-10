import axios from "axios"

const API_URL= 'https://todoapp-8.onrender.com/api';

const api = axios.create({
    baseURL: API_URL
})


export default api;