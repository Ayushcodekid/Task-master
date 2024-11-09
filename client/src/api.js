import axios from "axios";

const API_URL= 'https://task-master-1-ei2r.onrender.com/api';

const api = axios.create({
    baseURL: API_URL
})


export default api;