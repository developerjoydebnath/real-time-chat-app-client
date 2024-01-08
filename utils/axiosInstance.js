import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://realtime-chat-app-server-odpz.onrender.com/api/v1',
    // baseURL: 'http://localhost:8000/api/v1',
    timeout: 5000,
    withCredentials: true,
});
