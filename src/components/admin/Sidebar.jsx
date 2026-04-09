import { Box, Typography } from '@mui/material'
import React from 'react'
import SidebarTemplate from '../template/SidebarTemplate'
import SidebarList from '../common/SidebarList'
import Logo from "../../assets/MillionHIts_Logo.png"
import { Link } from 'react-router-dom'


const Sidebar = ({ menuItems, darkMode }) => {

    return (
        <SidebarTemplate>
            <Box component={"a"} href='/dashboard' width={"100%"} p={2} to={"/dashboard"} sx={{ borderBottom: 1, borderColor: "rgba(222, 222, 222)" }}>

                <img src={Logo} alt="Logo" height={48} />

            </Box>

            <SidebarList menuItems={menuItems} />

        </SidebarTemplate>
    )
}

export default Sidebar