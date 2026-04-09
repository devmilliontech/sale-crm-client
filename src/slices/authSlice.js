import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginData: JSON.parse(localStorage.getItem("auth")) || null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoginData: (state, action) => {
            state.loginData = action.payload
        }
    },
})

export const { setLoginData } = authSlice.actions

export default authSlice.reducer