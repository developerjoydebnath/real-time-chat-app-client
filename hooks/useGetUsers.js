import { axiosInstance } from '@/utils/axiosInstance';
import React from 'react';

export const getUsers = (loggedInUserId) => {
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get(`/user/${loggedInUserId}`);
                setUsers(res.data.data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [loggedInUserId]);
    return users;
};
