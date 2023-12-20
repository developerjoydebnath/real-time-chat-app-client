'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    uid: null,
    username: undefined,
    isLoggedIn: false,
    loading: true,
    email: undefined,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.uid = action.payload.uid;
            state.username = action.payload.username;
            state.loading = action.payload.loading;
            state.isLoggedIn = action.payload.isLoggedIn;
            state.email = action.payload.email;
        },
        userLogOut: (state) => {
            state.username = undefined;
            state.loading = false;
            state.isLoggedIn = false;
            state.email = undefined;
        },
        loading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export default authSlice.reducer;
export const { userLogOut, userLoggedIn, loading } = authSlice.actions;
