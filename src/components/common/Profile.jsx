import { Notifications } from '@mui/icons-material'
import { Avatar, Badge, Box, IconButton, Switch } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toggleMode } from '../../slices/themeSlice';

const Profile = ({ darkMode, setDarkMode }) => {

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Switch/>
            <Avatar src="" />
        </Box>
    )
}

export default Profile