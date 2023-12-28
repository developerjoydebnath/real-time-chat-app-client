import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: 'https://realtime-chat-app-server-odpz.onrender.com/api/v1',
    // baseURL: 'https://real-time-chat-app-server-eta.vercel.app/api/v1/',
    timeout: 5000,
    withCredentials: true,
});
