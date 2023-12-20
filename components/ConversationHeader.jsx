export default function ConversationHeader({ auth }) {
    return (
        <div className="border-b">
            <div className="flex items-center justify-start gap-3 py-2 px-2">
                <div className="h-12 w-12 bg-gray-400 rounded-full"></div>
                <div>
                    <h4 className="text-lg font-semibold text-gray-600">{auth.username}</h4>
                    <p className="text-sm -mt-1 text-gray-500">{auth.email}</p>
                </div>
            </div>
        </div>
    );
}
