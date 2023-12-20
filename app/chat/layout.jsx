'use client';

import AllUsers from '@/components/AllUsers';
import ChatLists from '@/components/Chatlists';
import ConversationHeader from '@/components/ConversationHeader';
import Loading from '@/components/Loading';
import MessageHeader from '@/components/MessageHeader';
import { loading, userLoggedIn } from '@/redux/features/auth/authSlice';
import { addOnlineUsers } from '@/redux/features/socket/socketSlice';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ChatLayout({ children }) {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const router = useRouter();
    const { socket } = useSelector((state) => state.socket);

    // get online users
    React.useEffect(() => {
        if (!socket) return;

        // create add users event
        socket.emit('addUser', auth.uid);

        // listen online user event response
        socket.on('online-users', (activeUsers) => {
            dispatch(addOnlineUsers(activeUsers));
        });

        return () => socket.off('online-users');
    }, [socket]);

    // set the data to the store if user logged in
    React.useEffect(() => {
        // get the user data from local storage
        const data = JSON.parse(localStorage.getItem('chat-app-auth'));

        if (data?.isLoggedIn) {
            dispatch(userLoggedIn(data));
        }
        dispatch(loading(false));
    }, []);

    // redirect to the login page
    React.useEffect(() => {
        if (!auth?.isLoggedIn && !auth?.loading) {
            router.push('/login');
        }
    }, [auth]);

    if (auth?.loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className="flex justify-center items-center h-[600px] mt-20">
                {/* friends list */}
                <div className="border w-80 h-full">
                    <div>
                        {/* conversation header  */}
                        <ConversationHeader auth={auth} />
                        {/* all users  */}
                        <AllUsers loggedInUserId={auth.uid} />
                        {/* conversation list */}
                        <ChatLists loggedInUserId={auth.uid} />
                    </div>
                </div>

                {/* messages */}
                <div className="border border-l-0 w-[500px] h-full">
                    <div>
                        {/* message header  */}
                        <MessageHeader />
                        {/*  chats */}
                        <div>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
