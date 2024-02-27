import axios from 'axios';

const API_URL = `${ import.meta.env.VITE_APP_ROOT_API}`

export const axiosInstance = axios.create({
    baseURL: API_URL
});

export const axiosPrivate = axios.create({
    baseURL: API_URL,
    headers: {'Content-Type': 'application/json'},
    // withCredentials: true
});