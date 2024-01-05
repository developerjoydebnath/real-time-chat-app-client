'use client';

import MessageInput from '@/components/MessageInput';
import Messages from '@/components/Messages';
import { useGetMessages } from '@/hooks/useGetMessages';
import React from 'react';
import { useSelector } from 'react-redux';

export default function Conversation({ params }) {
    const { chatId } = params;
    const auth = useSelector((state) => state.auth);
    const [newMessage, setNewMessage] = React.useState({});
    const { messages, setMessages } = useGetMessages(chatId, newMessage);

    return (
        <div className="h-full relative">
            <Messages messages={messages} setMessages={setMessages} auth={auth} chatId={chatId} />

            {/* message sending section  */}
            <MessageInput chatId={chatId} messages={messages} auth={auth} setNewMessage={setNewMessage} />
        </div>
    );
}
