'use client';
import Loading from '@/components/Loading';
import { loading, userLoggedIn } from '@/redux/features/auth/authSlice';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from '../../utils/axiosInstance';

export default function Login() {
    const auth = useSelector((state) => state.auth);
    const [emailOrUsername, setEmailOrUsername] = React.useState('admin@example.com');
    const [password, setPassword] = React.useState('admin');
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

    // render loading conditionally
    if (auth?.loading) {
        return <Loading />;
    }

    return (
        <div className="w-full h-screen">
            <div className="flex justify-center items-center h-full">
                <div className="border rounded-lg shadow-lg">
                    <form className="sm:m-10 m-6" onSubmit={handleLogin}>
                        <div className="flex justify-center">
                            <div className="p-2 rounded-full bg-slate-200">
                                {/* <Icon className="sm:h-8 h-6 sm:w-8 w-6" icon="lock" /> */}
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
                                type="email"
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
                            </label>{' '}
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
}
