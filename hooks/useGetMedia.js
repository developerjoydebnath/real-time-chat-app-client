import { axiosInstance } from '@/utils/axiosInstance';
import React from 'react';

export const useGetMedia = (chatId, toggleValue) => {
    const [media, setMedia] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            try {
                if (chatId && toggleValue === 'media') {
                    const { data } = await axiosInstance.get(`/message/media/${chatId}`);
                    setMedia(data.data);
                } else {
                    setMedia([]);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [toggleValue]);
    return { media, setMedia };
};
