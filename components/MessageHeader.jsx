import { useGetUser } from '@/hooks/useGerUser';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function MessageHeader() {
    const searchParams = useSearchParams();
    const receiverId = searchParams.get('fid');
    const user = useGetUser(receiverId);
    const { onlineUsers } = useSelector((state) => state.socket);

    return (
        <div className="border-b">
            <div className="flex items-center justify-start gap-3 py-2 px-2">
                <div className="h-12 w-12 bg-gray-400 rounded-full"></div>
                <div>
                    <h4 className="text-lg font-semibold text-gray-600">{user?.username}</h4>
                    <p className="text-sm -mt-1 text-gray-500">
                        {onlineUsers?.some((item) => item.userId === receiverId) ? 'Active' : 'Inactive'}
                    </p>
                </div>
            </div>
        </div>
    );
}
