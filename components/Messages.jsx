import { axiosInstance } from '@/utils/axiosInstance';
import React from 'react';
import Message from './Message';

const Messages = ({ messages, setMessages, auth, chatId }) => {
    const [page, setPage] = React.useState(1);

    const lastElRef = React.useRef(null);

    // always scroll to the last message
    React.useEffect(() => {
        lastElRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
        });
    }, [messages]);

    // load more data handler
    const handleLoadMore = () => {
        setPage((prev) => prev + 1);

        (async () => {
            try {
                if (chatId) {
                    const { data } = await axiosInstance.get(`/message/get/${chatId}?limit=50&page=${page}`);
                    console.log(data.data);
                    data.isSuccess && setMessages([...data.data, ...messages]);
                }
            } catch (err) {
                console.log(err);
            }
        })();
    };

    return (
        <div className="cnx__messages_container">
            {messages.length <= 0 ? (
                <div>
                    <h1>Say hello!</h1>
                </div>
            ) : (
                <div className="w-full h-full">
                    <div className="h-full">
                        {messages.length >= 50 && (
                            <div className="text-center">
                                <button className="bg-green-200 px-3 py-0.5 rounded-sm mt-2" onClick={handleLoadMore}>
                                    Load more
                                </button>
                            </div>
                        )}
                        {messages?.map((msg) => (
                            // single message
                            <Message
                                key={msg._id}
                                msg={msg}
                                auth={auth}
                                setMessages={setMessages}
                                messages={messages}
                            />
                        ))}
                        <div className="h-20" ref={lastElRef}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
