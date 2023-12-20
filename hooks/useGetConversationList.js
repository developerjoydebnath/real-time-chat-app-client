import { axiosInstance } from '@/utils/axiosInstance';
import React from 'react';

export const getConversationList = (loggedInUserId, chatId) => {
    const [conversationList, setConversationList] = React.useState([]);
    React.useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get(`/conversation/get/${loggedInUserId}`);
                setConversationList(res.data.data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [loggedInUserId, chatId]);
    return conversationList;
};
