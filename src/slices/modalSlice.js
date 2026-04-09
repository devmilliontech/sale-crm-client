import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    createAgreementOpen: false,
    addClientOpen: false,
    updateClientOpen: false,
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setCreateAgreementOpen: (state, action) => {
            state.createAgreementOpen = action.payload
        },
        setAddClientOpen: (state, action) => {
            state.addClientOpen = action.payload
        },
        setUpdateClientOpen: (state, action) => {
            state.updateClientOpen = action.payload
        }
    },
})

export const { setCreateAgreementOpen, setAddClientOpen, setUpdateClientOpen } = modalSlice.actions

export default modalSlice.reducer