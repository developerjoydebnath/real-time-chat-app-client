'use client';

const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
    socket: null,
    onlineUsers: [],
    sentMsg: null,
    newMsg: null,
    isModified: false,
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        addSocket: (state, action) => {
            state.socket = action.payload;
        },
        addOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        addNewMessage: (state, action) => {
            state.sentMsg = action.payload;
        },
        getNewMessage: (state, action) => {
            state.newMsg = action.payload;
        },
        modifiedMessage: (state, action) => {
            state.isModified = action.payload;
        },
    },
});

export default socketSlice.reducer;
export const { addSocket, addOnlineUsers, addNewMessage, getNewMessage, modifiedMessage } = socketSlice.actions;
