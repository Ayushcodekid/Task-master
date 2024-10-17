import axios from "axios";

const API_URL= 'https://todo-pgsql-4.onrender.com/api';

const api = axios.create({
    baseURL: API_URL
})


export default api;