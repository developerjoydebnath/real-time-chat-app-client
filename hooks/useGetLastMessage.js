import { axiosInstance } from '@/utils/axiosInstance';
import React from 'react';

export const useGetLastMessages = (chatId, sentMsg, newMsg, isModified) => {
    const [message, setMessage] = React.useState({});
    // const msg = sentMessage?.message;

    React.useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get(`/message/lastMessage/${chatId}`);
                setMessage(res.data.data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [chatId, sentMsg, newMsg, isModified]);
    return { message, setMessage };
};
