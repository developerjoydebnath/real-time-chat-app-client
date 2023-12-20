import { getUsers } from '@/hooks/useGetUsers';
import { axiosInstance } from '@/utils/axiosInstance';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function AllUsers({ loggedInUserId }) {
    const [allUser, setAllUser] = React.useState([]);
    const users = getUsers(loggedInUserId);
    const router = useRouter();
    const { onlineUsers, socket } = useSelector((state) => state.socket);
    const dispatch = useDispatch();

    // console.log('allUsers', allUser);

    React.useEffect(() => {
        if (!socket) return;

        // socket event listener
        socket.on('added-new-user', (newAddedUser) => {
            // add the new user with the existing users
            allUser.push(newAddedUser);
        });

        return () => socket.off('added-new-user');
    }, [socket]);

    // initially set the users to the local state
    React.useEffect(() => {
        setAllUser(users);
    }, [users]);

    // handle adding conversation to database
    const addConversation = async (friendId, friendName) => {
        // make a new conversation object
        const body = {
            senderId: loggedInUserId,
            receiverId: friendId,
        };

        try {
            // create a new conversation and add it to the database
            const res = await axiosInstance.post('/conversation/add', body);
            if (res.data.isSuccess) {
                // get the conversation id
                const chatId = res.data.data._id;
                console.log(chatId);

                // redirect to the specific conversation page
                router.push(`/chat/${chatId}?fid=${friendId}`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex gap-2 mx-2 my-1 overflow-x-auto justify-start items-center pb-2">
            {allUser?.map((user) => (
                <div
                    key={user._id}
                    className="cursor-pointer flex-col flex justify-center items-center"
                    onClick={() => addConversation(user._id, user.username)}
                >
                    <div className="h-10 w-10 bg-gray-400 rounded-full relative">
                        {onlineUsers?.some((item) => item.userId === user._id) && (
                            <div className="absolute h-3 w-3 border-2 border-white bg-green-600 rounded-full bottom-0 right-0"></div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-xs pt-0.5">
                            {user.username.length > 5 ? user.username.slice(0, 5) + '...' : user.username}
                        </h4>
                    </div>
                </div>
            ))}
        </div>
    );
}
