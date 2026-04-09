import { ExitToApp as ExitToAppIcon } from '@mui/icons-material'
import { List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Cookies from "js-cookie";
import toast from 'react-hot-toast';


const LogoutBtn = () => {
    const navigate = useNavigate()
    const handleLogout = ()  => {
        localStorage.clear()
        Cookies.remove("sales-crm")
        navigate("/login")
        toast.success("Logout Successfully")
    }
    return (
        <List>
            <ListItemButton onClick={handleLogout}>
                <ListItemIcon >
                    <ExitToAppIcon color='primary'/>
                </ListItemIcon>
                <ListItemText >
                    <Typography color='primary'>Logout</Typography>
                </ListItemText>
            </ListItemButton>
        </List>
    )
}
export default LogoutBtn