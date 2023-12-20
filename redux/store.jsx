'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import quizReducer from './features/quiz/quizSlice';
import socketReducer from './features/socket/socketSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        quizResult: quizReducer,
        socket: socketReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
    devTools: process.env.NODE_ENV !== 'production',
});
