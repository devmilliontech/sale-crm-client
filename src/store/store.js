import { configureStore } from '@reduxjs/toolkit'
import modalReducer from "../slices/modalSlice"
import authReducer from "../slices/authSlice"
import themeReducer from "../slices/themeSlice";
export const store = configureStore({
  reducer: {
    modal: modalReducer,
    auth:authReducer,
    theme: themeReducer,
  },
})