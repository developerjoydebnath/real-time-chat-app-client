import { axiosInstance } from '@/utils/axiosInstance';
import React from 'react';

export const useGetUser = (userId) => {
    const [user, setUser] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            try {
                if (userId) {
                    const res = await axiosInstance.get(`/user/get/${userId}`);
                    setUser(res.data.data);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }, [userId]);
    return user;
};
