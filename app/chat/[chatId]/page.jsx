'use client';

import { useGetMessages } from '@/hooks/useGetMessages';
import { useGetTime } from '@/hooks/useGetTime';
import { addNewMessage, getNewMessage, modifiedMessage } from '@/redux/features/socket/socketSlice';
import { axiosInstance } from '@/utils/axiosInstance';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Conversation({ params }) {
    const { chatId } = params;
    const auth = useSelector((state) => state.auth);
    const lastElRef = React.useRef(null);
    const [messageText, setMessageText] = React.useState('');
    const [file, setFile] = React.useState(null);
    const searchParams = useSearchParams();
    const receiverId = searchParams.get('fid');
    const { socket } = useSelector((state) => state.socket);
    const [newMessage, setNewMessage] = React.useState({});
    const { messages } = useGetMessages(chatId, newMessage);
    const dispatch = useDispatch();
    const { newMsg } = useSelector((state) => state.socket);

    console.log(file);

    // update messages status to database and locally when user read the message
    React.useEffect(() => {
        // check conversation id for updating specific messages
        if (newMsg?.conversationId === chatId || chatId) {
            (async () => {
                try {
                    // update the message if it is read by receiver
                    const { data } = await axiosInstance.put('/message/update/status', { chatId, userId: receiverId });

                    // update is modified state to rerender the last message to update the notification status for unread message
                    if (data?.acknowledged && data?.modifiedCount > 0) {
                        dispatch(modifiedMessage(true));
                    } else {
                        dispatch(modifiedMessage(false));
                    }
                } catch (err) {
                    // do nothing
                }
            })();
        }
    }, [newMsg, chatId]);

    // receive the message text and set it to redux store and also update the receiver local state
    React.useEffect(() => {
        if (!socket) return;

        // get the incoming message and update the ui instantly
        socket.on('get-message', (newMessage) => {
            dispatch(getNewMessage(newMessage));
            setNewMessage(newMessage);
        });
        return () => socket.off('get-message');
    }, [socket, messages]);

    // always scroll to the last message
    React.useEffect(() => {
        lastElRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, [messages?.length]);

    // clear the sent message from input field
    const clearForm = () => setMessageText('');

    // send message handler
    const sendMessageHandler = async (e) => {
        e.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const { data } = await axiosInstance.post('/message/file-upload', formData);
                console.log(data);
            } catch (e) {
                console.log(e);
            }

            console.log(formData);
        }

        if (messageText.trim().length > 0) {
            // get the sending time
            const sendingTime = useGetTime();

            // create the message body
            const messageBody = {
                conversationId: chatId,
                senderId: auth.uid,
                receiverId,
                message: messageText,
                isRead: false,
                sendTime: sendingTime,
            };

            try {
                // add the message to the database
                const { data } = await axiosInstance.post('/message/add', messageBody);

                if (data?.isSuccess && auth?.uid !== receiverId) {
                    dispatch(addNewMessage(data.data));
                    setNewMessage(data.data);
                    socket.emit('sendMessage', data.data);
                }
            } catch (err) {
                console.log(err);
            }

            // clear the input field after sending the message
            clearForm();
        }
    };

    return (
        <div className="w-[500px] h-[534px] relative">
            {messages.length <= 0 ? (
                <div>
                    <h1>Say hello!</h1>
                </div>
            ) : (
                <div className="w-[500px] h-[475px] border-b overflow-y-auto">
                    <div className="h-[475px]">
                        {messages?.map((msg) => (
                            <div key={msg._id} className="text-left my-1 px-3">
                                <div
                                    className={`flex items-start gap-2 ${
                                        msg.senderId === auth.uid ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div className={`${msg.senderId === auth.uid ? 'order-1' : 'order-2'}`}>
                                        <div
                                            className={`border inline-block px-4 py-1.5 rounded-xl max-w-[350px] ${
                                                msg.senderId === auth.uid
                                                    ? 'bg-gradient-to-br from-pink-500 to bg-purple-500'
                                                    : 'bg-gradient-to-br from-cyan-500 to bg-teal-400'
                                            }`}
                                        >
                                            <p className="text-base me-10 text-white">{msg.message}</p>
                                            <p className="text-[10px] text-end text-white">{msg.sendTime}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={lastElRef}></div>
                    </div>
                </div>
            )}
            {/* message sending section  */}
            {chatId && receiverId ? (
                <div className="absolute w-full bottom-0 left-0">
                    <form className="flex items-center px-2 py-2" onSubmit={sendMessageHandler}>
                        {/* attach file icon  */}
                        <div className="p-1 cursor-pointer">
                            <label htmlFor="file">
                                <svg
                                    className="h-7 w-7 cursor-pointer fill-slate-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                >
                                    <path d="M460-80q-92 0-156-64t-64-156v-420q0-66 47-113t113-47q66 0 113 47t47 113v380q0 42-29 71t-71 29q-42 0-71-29t-29-71v-350q0-13 8.5-21.5T390-720q13 0 21.5 8.5T420-690v350q0 17 11.5 28.5T460-300q17 0 28.5-11.5T500-340v-380q0-42-29-71t-71-29q-42 0-71 29t-29 71v420q0 66 47 113t113 47q66 0 113-47t47-113v-390q0-13 8.5-21.5T650-720q13 0 21.5 8.5T680-690v390q0 92-64 156T460-80Z" />
                                </svg>
                            </label>
                            <input
                                name="file"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files[0])}
                                type="file"
                                id="file"
                                value=""
                            />
                        </div>

                        {/* message input  */}
                        <input
                            name="message"
                            type="text"
                            className="border px-5 py-2 outline-none w-full rounded-full"
                            placeholder="Message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                        />

                        {/* send button icon */}
                        <div className="p-1 cursor-pointer">
                            <label htmlFor="submit">
                                <svg
                                    className="h-7 w-7 cursor-pointer fill-slate-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                >
                                    <path d="M792-443 176-183q-20 8-38-3.5T120-220v-520q0-22 18-33.5t38-3.5l616 260q25 11 25 37t-25 37ZM200-280l474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
                                </svg>
                            </label>
                            <input className="hidden" type="submit" id="submit" value="" />
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
}
