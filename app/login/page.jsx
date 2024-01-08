'use client';
import Loading from '@/components/Loading';
import { loading, userLoggedIn } from '@/redux/features/auth/authSlice';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../utils/axiosInstance';

export default function Login() {
    const auth = useSelector((state) => state.auth);
    const [emailOrUsername, setEmailOrUsername] = React.useState(''); //admin@example.com
    const [password, setPassword] = React.useState(''); // admin
    const [error, setError] = React.useState('');
    const router = useRouter();
    const path = usePathname();
    const dispatch = useDispatch();

    // redirect to chat page if user is logged in
    React.useEffect(() => {
        if (auth?.isLoggedIn && !auth.loading) {
            router.push('/chat');
        }
    }, [auth]);

    // remove the error from ui after 3 second
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            setError('');
        }, 3000);
        return () => clearTimeout(timeoutId);
    }, [error]);

    // set the data to the store if user logged in
    React.useEffect(() => {
        // get the user data from local storage
        const data = JSON.parse(localStorage.getItem('chat-app-auth'));

        if (data?.isLoggedIn) {
            dispatch(userLoggedIn(data));
        }
        dispatch(loading(false));
    }, []);

    // handle login
    const handleLogin = async (e) => {
        e.preventDefault();

        // validation
        if (emailOrUsername && password) {
            const submittedData = { emailOrUsername, password };
            try {
                const res = await axiosInstance.post('/user/get', submittedData);

                if (res.data.isSuccess) {
                    const data = {
                        uid: res.data.data._id,
                        username: res.data.data.username,
                        email: res.data.data.email,
                        isLoggedIn: true,
                        loading: false,
                    };

                    // set data to the local storage
                    localStorage.setItem('chat-app-auth', JSON.stringify(data));

                    // dispatch logged in action
                    dispatch(userLoggedIn(data));
                    router.push('/chat');
                }
            } catch (err) {
                console.log(err);
                if (err.response?.data?.message) {
                    setError(err.response.data.message);
                    dispatch(loading(false));
                }
            }
        }
    };

    if (!auth.uid && !auth?.isLoggedIn && !auth.loading) {
        return (
            <div className="w-full h-screen">
                <div className="flex justify-center items-center h-full">
                    <div className="border rounded-lg shadow-lg">
                        <form className="sm:m-10 m-6" onSubmit={handleLogin}>
                            <div className="flex justify-center">
                                <div className="p-2 rounded-full bg-slate-200">
                                    <svg
                                        className="h-8 w-8 fill-gray-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="24"
                                        viewBox="0 -960 960 960"
                                        width="24"
                                    >
                                        <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
                                    </svg>
                                </div>
                            </div>
                            <h4 className="sm:text-2xl text-xl font-bold text-center text-slate-600">Login</h4>

                            {/* username or email  */}
                            <div className="my-3">
                                <label htmlFor="email" className="text-sm text-slate-500">
                                    Email or Username
                                </label>
                                <br />
                                <input
                                    required
                                    className="border outline-none sm:w-80 w-60 sm:h-10 h-8 rounded px-2"
                                    placeholder=""
                                    type="text"
                                    name="email"
                                    id="email"
                                    onChange={(e) => {
                                        setEmailOrUsername(e.target.value);
                                    }}
                                    value={emailOrUsername}
                                />
                            </div>
                            <div className="my-3">
                                <label htmlFor="password" className="text-sm text-slate-500">
                                    Password
                                </label>
                                <br />
                                <input
                                    required
                                    className="border outline-none sm:w-80 w-60 sm:h-10 h-8 rounded px-2"
                                    placeholder=""
                                    type="password"
                                    name="password"
                                    id="password"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    value={password}
                                />
                            </div>
                            <div className="text-sm">
                                <span>Don't have an account?</span>{' '}
                                <Link href="/signup" className="text-blue-600">
                                    Signup
                                </Link>
                            </div>

                            {/* error component */}
                            {error && (
                                <div>
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <div className="my-5">
                                <input
                                    className="cursor-pointer sm:w-80 w-60 sm:h-10 h-8 bg-slate-300 rounded font-bold"
                                    type="submit"
                                    value="Login"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    } else {
        return <Loading />;
    }
}
