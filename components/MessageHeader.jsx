import { useGetUser } from '@/hooks/useGerUser';
import { useGetMedia } from '@/hooks/useGetMedia';
import { onOutsideClick } from '@/utils/onOutsideClick';
import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';

export default function MessageHeader() {
    const { chatId } = useParams();
    const searchParams = useSearchParams();
    const receiverId = searchParams.get('fid');
    const user = useGetUser(receiverId);
    const { onlineUsers } = useSelector((state) => state.socket);
    const [isOpen, setIsOpen] = React.useState(false);
    const accountRef = React.useRef(null);
    const [toggleValue, setToggleValue] = React.useState('about');
    const { media } = useGetMedia(chatId, toggleValue);

    // close the modal when clicked outside
    onOutsideClick(accountRef, () => setIsOpen(false));

    return (
        <div className="border-b sticky top-0 z-40 bg-white">
            <div className="flex justify-between items-center ">
                <div className="flex items-center justify-start gap-3 py-2 px-2">
                    <div className="h-12 w-12 bg-gray-400 rounded-full"></div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-600">{user?.username}</h4>
                        <p className="text-sm -mt-1 text-gray-500">
                            {onlineUsers?.some((item) => item.userId === receiverId) ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                </div>
                <div
                    className="me-2 border rounded-full hover:ring-1 cursor-pointer ring-green-300 relative"
                    onClick={() => setIsOpen(true)}
                >
                    <svg
                        className="h-7 w-7 fill-gray-600"
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 -960 960 960"
                        width="24"
                    >
                        <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                    </svg>

                    {/* three dot modal  */}
                    {isOpen && (
                        <div
                            ref={accountRef}
                            className={`absolute w-[400px] mt-2 bg-white shadow-lg border z-30 rounded top-full right-1 cursor-default`}
                        >
                            <div className="m-2 text-center text-sm px-5">
                                <div className="mt-5">
                                    {/* <img src="" alt="img" /> */}
                                    <span className="w-28 h-28 rounded-full bg-red-200 inline-block"></span>
                                </div>
                                <div className="flex justify-around items-center divide-x my-5">
                                    <div
                                        className="w-full cursor-pointer hover:bg-gray-200 rounded-sm py-1"
                                        onClick={() => setToggleValue('about')}
                                    >
                                        About
                                    </div>
                                    <div
                                        className="w-full cursor-pointer hover:bg-gray-200 rounded-sm py-1"
                                        onClick={() => setToggleValue('media')}
                                    >
                                        Media
                                    </div>
                                </div>
                                <div>
                                    {toggleValue === 'media' ? (
                                        <div className="grid grid-cols-12 max-h-[400px] overflow-auto gap-2 mb-5">
                                            {media.length > 0 &&
                                                media.map((m) => (
                                                    <div
                                                        className="col-span-4 hover:border-gray-200 border border-white shadow rounded"
                                                        key={m._id}
                                                    >
                                                        <img
                                                            src={`https://realtime-chat-app-server-odpz.onrender.com/${m.image}`}
                                                            alt={m.image}
                                                        />
                                                        {/* <img src={`http://localhost:8000/${m.image}`} alt={m.image} /> */}
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="mb-5">
                                            <ul className="">
                                                <li className="rounded-sm px-2 py-1 cursor-pointer hover:bg-gray-200">
                                                    Mute
                                                </li>
                                                <li className="rounded-sm px-2 py-1 cursor-pointer hover:bg-gray-200">
                                                    Nickname
                                                </li>
                                                <li className="rounded-sm px-2 py-1 cursor-pointer hover:bg-gray-200">
                                                    Theme
                                                </li>
                                                <li className="rounded-sm px-2 py-1 cursor-pointer hover:bg-gray-200">
                                                    Emoji
                                                </li>
                                                <li className="rounded-sm px-2 py-1 cursor-pointer hover:bg-gray-200">
                                                    Block
                                                </li>
                                                <li className="rounded-sm px-2 py-1 cursor-pointer hover:bg-gray-200">
                                                    Report
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
