import { useGetTime } from '@/hooks/useGetTime';
import { addNewMessage, getNewMessage, modifiedMessage } from '@/redux/features/socket/socketSlice';
import { axiosInstance } from '@/utils/axiosInstance';
import { onOutsideClick } from '@/utils/onOutsideClick';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MessageInput = ({ chatId, messages, auth, setNewMessage }) => {
    const [messageText, setMessageText] = React.useState('');
    const [file, setFile] = React.useState(null);
    const dispatch = useDispatch();
    const { newMsg } = useSelector((state) => state.socket);
    const searchParams = useSearchParams();
    const receiverId = searchParams.get('fid');
    const { socket } = useSelector((state) => state.socket);
    const [emojiOpen, setEmojiOpen] = React.useState(false);
    const emojiRef = React.useRef(null);

    // close the emoji modal when clicked outside of the modal
    onOutsideClick(emojiRef, () => setEmojiOpen(false));

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

    // clear the sent message from input field
    const clearForm = () => setMessageText('');

    // send message handler
    const sendMessageHandler = async (e) => {
        e.preventDefault();

        // send message
        if (messageText.trim().length > 0 || file) {
            // get the sending time
            const sendingTime = useGetTime();

            // create the message body
            const formData = new FormData();
            formData.append('file', file);
            formData.append('message', messageText);
            formData.append('senderId', auth.uid);
            formData.append('conversationId', chatId);
            formData.append('receiverId', receiverId);
            formData.append('isRead', false);
            formData.append('sendTime', sendingTime);

            try {
                // add the message to the database
                const { data } = await axiosInstance.post('/message/add', formData);

                if (data?.isSuccess && auth?.uid !== receiverId) {
                    dispatch(addNewMessage(data.data));
                    setNewMessage(data.data);
                    setFile(null);
                    socket.emit('sendMessage', data.data);
                }
            } catch (err) {
                console.log(err);
            }

            // clear the input field after sending the message
            clearForm();
        }
    };

    // emoji handler
    const handleEmoji = (e) => {
        console.log(e?.native);
        setMessageText(messageText + e.native);
    };

    return (
        <React.Fragment>
            {chatId && receiverId ? (
                <div className="bg-white border-t border-b w-full z-30 cnx__message_input">
                    <form className="flex items-center px-2 py-3 relative" onSubmit={sendMessageHandler}>
                        {/* attach file icon  */}
                        <div className="p-1 cursor-pointer">
                            <label htmlFor="file">
                                <svg
                                    className="h-7 w-7 cursor-pointer fill-slate-500 hover:fill-green-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                >
                                    <path d="M460-80q-92 0-156-64t-64-156v-420q0-66 47-113t113-47q66 0 113 47t47 113v380q0 42-29 71t-71 29q-42 0-71-29t-29-71v-350q0-13 8.5-21.5T390-720q13 0 21.5 8.5T420-690v350q0 17 11.5 28.5T460-300q17 0 28.5-11.5T500-340v-380q0-42-29-71t-71-29q-42 0-71 29t-29 71v420q0 66 47 113t113 47q66 0 113-47t47-113v-390q0-13 8.5-21.5T650-720q13 0 21.5 8.5T680-690v390q0 92-64 156T460-80Z" />
                                </svg>
                            </label>

                            {/* file input  */}
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
                            className="border px-5 py-2 outline-none w-full rounded-full focus:border-gray-300 focus:ring-1 ring-green-300"
                            placeholder="Message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            autoComplete="off"
                        />

                        {/* emoji input */}
                        <div className="p-1 cursor-pointer ms-1">
                            <label htmlFor="emoji">
                                <svg
                                    className="h-7 w-7 cursor-pointer fill-slate-500 hover:fill-green-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                >
                                    <path d="M480-260q53 0 100.5-23t76.5-67q11-17 3-33.5T634-400q-8 0-14.5 3.5T609-386q-23 31-57 48.5T480-320q-38 0-72-17.5T351-386q-5-7-11.5-10.5T325-400q-18 0-26 16t3 32q29 45 76.5 68.5T480-260Zm140-260q25 0 42.5-17.5T680-580q0-25-17.5-42.5T620-640q-25 0-42.5 17.5T560-580q0 25 17.5 42.5T620-520Zm-280 0q25 0 42.5-17.5T400-580q0-25-17.5-42.5T340-640q-25 0-42.5 17.5T280-580q0 25 17.5 42.5T340-520ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                                </svg>
                            </label>

                            {/* emoji input  */}
                            <input
                                name="emoji"
                                className="hidden"
                                onClick={() => setEmojiOpen(!emojiOpen)}
                                type="text"
                                id="emoji"
                            />
                        </div>

                        {/* send button icon */}
                        <div className="p-1 cursor-pointer me-3">
                            <label htmlFor="submit">
                                <svg
                                    className="h-8 w-8 cursor-pointer fill-slate-500 hover:fill-green-500"
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

                        {/* image preview */}
                        {file && (
                            <div className="absolute h-20 left-0 bottom-full mb-1 ms-1 rounded-sm bg-white shadow-md">
                                <div className="relative h-full rounded-sm">
                                    <img className="h-full rounded-sm" src={URL.createObjectURL(file)} alt="img" />

                                    {/* remove image button  */}
                                    <button
                                        className="bg-gray-300 p-0.5 rounded-full absolute -right-1 -top-1"
                                        onClick={() => setFile(null)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="24"
                                            viewBox="0 -960 960 960"
                                            width="24"
                                            className="h-4 w-4"
                                        >
                                            <path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* show emoji modal  */}
                        {emojiOpen && (
                            <div ref={emojiRef} className="absolute bottom-full right-0 mb-2 me-2 shadow-lg">
                                <Picker data={data} onEmojiSelect={(e) => handleEmoji(e)} />
                            </div>
                        )}
                    </form>
                </div>
            ) : null}
        </React.Fragment>
    );
};

export default MessageInput;
