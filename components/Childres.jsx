'use client';

import { addSocket } from '@/redux/features/socket/socketSlice';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

export const Children = ({ children }) => {
    const { uid: userId } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // initialize socket connection
    React.useEffect(() => {
        const newSocket = io('http://localhost:8000', {
            withCredentials: true,
        });
        // const newSocket = io('https://real-time-chat-app-server-eta.vercel.app', {
        //     withCredentials: true,
        // });

        newSocket.on('connect', () => {
            // set the socket to the state
            dispatch(addSocket(newSocket));
        });

        // cleanup function
        return () => newSocket.disconnect();
    }, [userId]);
    return <React.Fragment>{children}</React.Fragment>;
};
