import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLogin: false,
        isAdmin: undefined
    },
    reducers: {
        logInUser: (state, action) => {
            state.isLogin = true;
            state.isAdmin = action.payload;
        },
        logOutUser: (state) => {
            state.isLogin = false;
            state.isAdmin = undefined;
        },
    }
})
export const authActions = authSlice.actions;

export default authSlice.reducer;