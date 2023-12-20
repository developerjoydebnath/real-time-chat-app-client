'use client';

import ChatList from '@/components/ChatList';
import { getConversationList } from '@/hooks/useGetConversationList';
import { useParams } from 'next/navigation';

export default function ChatLists({ loggedInUserId }) {
    const { chatId } = useParams();
    const users = getConversationList(loggedInUserId, chatId);

    return (
        <div className="mx-3 mt-2">{users && users.map((user) => <ChatList conversation={user} key={user._id} />)}</div>
    );
}
