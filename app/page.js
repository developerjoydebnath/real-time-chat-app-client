'use client';
import Loading from '@/components/Loading';
import { loading, userLoggedIn } from '@/redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

export default function Home() {
    const dispatch = useDispatch();
    const router = useRouter();

    // redirect to the chat page
    React.useEffect(() => {
        router.push('/chat');
    }, []);

    // set the data to the store if user logged in
    React.useEffect(() => {
        // get the user data from local storage
        const data = JSON.parse(localStorage.getItem('chat-app-auth'));

        if (data?.isLoggedIn) {
            dispatch(userLoggedIn(data));
        }
        dispatch(loading(false));
    }, []);

    return <Loading />;
}
