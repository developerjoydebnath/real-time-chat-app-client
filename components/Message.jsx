import { axiosInstance } from '@/utils/axiosInstance';
import { contextMenuList } from '@/utils/contextMenu';
import { onOutsideClick } from '@/utils/onOutsideClick';
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// initial context
const initialContext = {
    open: false,
    selectedId: null,
};

const Message = ({ msg, auth, setMessages, messages }) => {
    const [contextMenu, setContextMenu] = React.useState(initialContext);
    const contextRef = React.useRef(null);
    const { socket } = useSelector((state) => state.socket);

    // initially update the messages on friend's browser
    React.useEffect(() => {
        if (!socket) return;

        socket.on('deleted-message', (messageInfo) => {
            const deletedMessage = messages.find((m) => m._id === messageInfo._id);
            const index = messages.indexOf(deletedMessage);
            let clonedMessages = [...messages];
            if (index !== -1) {
                clonedMessages[index] = messageInfo;
                setMessages(clonedMessages);
            }
        });

        return () => socket.off('deleted-message');
    }, [socket]);

    // handle mouse right click to open context menu
    const handleClose = () => {
        setContextMenu(initialContext);
    };

    // close the context menu when clicked outside of the context menu
    onOutsideClick(contextRef, handleClose);

    // mouse right click handler
    const handleContextMenuOpen = (e, id) => {
        e.preventDefault();

        // set the context menu
        setContextMenu({
            open: true,
            selectedId: id,
        });
    };

    // copy to clipboard handler
    const clickToCopy = async (textToCopy) => {
        try {
            // save the text to clipboard
            await navigator.clipboard.writeText(textToCopy);

            // show success message
            toast.success('Copied to clipboard', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        } catch (e) {
            // show error message
            toast.error('Copying Failed', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        }
    };

    // message deletion handler
    const handleMessageDelete = async (messageInfo) => {
        const confirm = window.confirm('Are you sure you want to delete? Deleted message cannot be restored!');

        if (!confirm) return;

        if (messageInfo.senderId === auth.uid) {
            try {
                const { data } = await axiosInstance.put(`/message/delete/${messageInfo._id}`);

                if (data.isSuccess) {
                    socket.emit('deleteMessage', data.data);
                    const deletedMessage = messages.find((m) => m._id === data.data._id);
                    const index = messages.indexOf(deletedMessage);
                    let clonedMessages = [...messages];
                    if (index !== -1) {
                        clonedMessages[index] = data.data;
                        setMessages(clonedMessages);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            // show warning message
            toast.warn('Received message deletion is not allowed!', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            });
        }
    };

    // handle context menu click
    const handleContextMenuClick = (value) => {
        switch (value) {
            case 'copy':
                const textToCopy = msg.message;
                clickToCopy(textToCopy);
                setContextMenu(initialContext);
                return;
            case 'forward':
                setContextMenu(initialContext);
                return;
            case 'reply':
                setContextMenu(initialContext);
                return;
            case 'delete':
                handleMessageDelete(msg);
                setContextMenu(initialContext);
                return;
            case 'close':
                return setContextMenu(initialContext);
            default:
                setContextMenu(initialContext);
                return;
        }
    };
    return (
        <div key={msg._id} className="text-left my-1 px-3">
            <div className={`flex items-start gap-2 ${msg.senderId === auth.uid ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative ${msg.senderId === auth.uid ? 'order-1' : 'order-2'}`}>
                    {msg?.isDeleted ? (
                        <div
                            className={`border inline-block px-4 py-1.5 rounded-xl max-w-[350px] ${
                                msg.senderId === auth.uid
                                    ? 'bg-gradient-to-br from-pink-300 to bg-purple-300'
                                    : 'bg-gradient-to-br from-cyan-300 to bg-teal-300'
                            }`}
                        >
                            <p className="text-base me-10 text-white italic">Message deleted</p>
                            <p className="text-[10px] text-end text-white">{msg.sendTime}</p>
                        </div>
                    ) : (
                        <div
                            className={`border inline-block px-4 py-1.5 rounded-xl max-w-[350px] ${
                                msg.senderId === auth.uid
                                    ? 'bg-gradient-to-br from-pink-500 to bg-purple-500'
                                    : 'bg-gradient-to-br from-cyan-500 to bg-teal-400'
                            }`}
                            onContextMenu={(e) => handleContextMenuOpen(e, msg._id)}
                        >
                            {msg?.image && (
                                <img
                                    // src={`http://localhost:8000/${msg.image}`}
                                    src={`https://realtime-chat-app-server-odpz.onrender.com/${msg.image}`}
                                    className="mt-2 mb-1 rounded bg-white"
                                    alt="img"
                                />
                            )}
                            {msg?.message && <p className="text-base me-10 text-white">{msg.message}</p>}
                            <p className="text-[10px] text-end text-white">{msg.sendTime}</p>
                        </div>
                    )}

                    {/* context menu  */}
                    {contextMenu.open && contextMenu.selectedId === msg._id && (
                        <div
                            ref={contextRef}
                            className={`absolute mt-2 w-40 bg-gray-200 shadow-md z-30 rounded ${
                                msg.senderId === auth.uid ? 'right-full bottom-0 me-2' : 'left-full bottom-0 ms-2'
                            }`}
                        >
                            <div className="m-2 text-center text-sm">
                                {contextMenuList.map((menu) => (
                                    <div
                                        key={menu.value}
                                        className="px-2 py-1 cursor-pointer hover:bg-white rounded"
                                        onClick={() => handleContextMenuClick(menu.value)}
                                    >
                                        <span>{menu.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Message;
