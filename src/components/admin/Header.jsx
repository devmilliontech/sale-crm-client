import { Box, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import HeaderTemplate from '../template/HeaderTemplate'
import ButtonComponent from '../common/ButtonComponet'
import { useDispatch, useSelector } from 'react-redux'
import AddClientModal from '../../dialog/AddClientModal'
import { setAddClientOpen, setCreateAgreementOpen } from '../../slices/modalSlice'



const Header = () => {
    const { addClientOpen } = useSelector(state => state.modal)
   
    const dispatch = useDispatch()

    const handleOpen = () => {
        dispatch(setCreateAgreementOpen(true))
    }
    return (
        <HeaderTemplate>
            <Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"} padding={"1rem 2rem"}>
                <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                    <Typography variant="h5" fontWeight="bold" mr={2}>
                        Admin Dashboard
                    </Typography>
                    
                    <Stack display={"flex"} flexDirection={"row"} gap={2}> 
                        <ButtonComponent text={"+ Create Agreement"} action={handleOpen} />
                        <ButtonComponent text={"Add Prospect"} action={() => dispatch(setAddClientOpen(true))} />
                    </Stack>    
                </Box>

                <AddClientModal open={addClientOpen} onClose={() => dispatch(setAddClientOpen(false))} />
            </Stack>
        </HeaderTemplate>
    )
}

export default Header