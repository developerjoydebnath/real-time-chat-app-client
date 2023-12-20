import { axiosInstance } from '@/utils/axiosInstance';
import React from 'react';

export const useGetMessages = (chatId, newMsg, isModified) => {
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            try {
                if (chatId) {
                    const { data } = await axiosInstance.get(`/message/get/${chatId}`);
                    setMessages(data.data);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [chatId, newMsg, isModified]);
    return { messages, setMessages };
};
