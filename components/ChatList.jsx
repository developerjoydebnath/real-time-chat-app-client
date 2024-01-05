import { useGetUser } from '@/hooks/useGerUser';
import { useGetLastMessages } from '@/hooks/useGetLastMessage';
import Link from 'next/link';
import { useSelector } from 'react-redux';

export default function ChatList({ conversation }) {
    // get the logged in user id
    const userId = useSelector((state) => state.auth.uid);
    const { onlineUsers, newMsg, sentMsg, isModified } = useSelector((state) => state.socket);

    // get the friend id
    const friendId = conversation?.users?.filter((id) => id !== userId)[0];

    // get the friend information
    const friendInfo = useGetUser(friendId);

    // get the last message information
    const { message: lastMessageInfo } = useGetLastMessages(conversation._id, sentMsg, newMsg, isModified);

    return (
        <Link href={`/chat/${conversation._id}?fid=${friendId}`}>
            <div className="flex items-center justify-between hover:bg-slate-200 py-2 px-2 rounded-md">
                <div className="flex items-center justify-start gap-2">
                    <div className="h-12 w-12 bg-gray-400 rounded-full relative">
                        {onlineUsers?.some((item) => item.userId === friendId) && (
                            <div className="absolute h-3.5 w-3.5 border-2 border-white bg-green-600 rounded-full bottom-0.5 right-0.5"></div>
                        )}
                    </div>
                    <div>
                        <h4 className="text-base font-medium">{friendInfo.username}</h4>
                        <p className="text-sm italic text-gray-600">
                            {userId === lastMessageInfo?.senderId && 'You :'}{' '}
                            {lastMessageInfo?.isDeleted
                                ? 'Message deleted'
                                : lastMessageInfo?.message
                                ? lastMessageInfo.message.length > 10
                                    ? `${lastMessageInfo.message.slice(0, 15)}...`
                                    : lastMessageInfo.message
                                : lastMessageInfo?.image
                                ? 'Image'
                                : ''}
                        </p>
                    </div>
                </div>
                <div className="text-end">
                    <p className="text-xs">{lastMessageInfo?.sendTime}</p>
                    <p className="text-xs">
                        {lastMessageInfo?.conversationId === conversation._id &&
                        lastMessageInfo?.senderId === friendId ? (
                            lastMessageInfo?.isRead ? (
                                'Seen'
                            ) : (
                                <span className="h-2 w-2 block rounded-full bg-blue-600 mt-2"></span>
                            )
                        ) : (
                            ''
                        )}
                    </p>
                </div>
            </div>
        </Link>
    );
}
