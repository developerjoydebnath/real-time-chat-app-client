import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://real-time-chat-app-server-iaxl.onrender.com/api/v1',
    // baseURL: 'http://localhost:8000/api/v1',
    timeout: 5000,
    withCredentials: true,
});
