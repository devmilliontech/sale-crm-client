import React, { useState } from "react";
import {
    Box,
    Toolbar,
    Typography,
    Grid,
    Divider,
    InputBase,
    List,
    ListItem,
} from "@mui/material";
import {

    Dashboard as DashboardIcon,
    People as PeopleIcon,
    BarChart as BarChartIcon,
    Search as SearchIcon,
    People,
    Person,
} from "@mui/icons-material";

import AddClientModal from "../dialog/AddClientModal";
import SidebarList from "../components/common/SidebarList";
import SidebarTemplate from "../components/template/SidebarTemplate";
import { useDispatch, useSelector } from "react-redux";
import { setAddClientOpen } from "../slices/modalSlice";
import HeaderTemplate from "../components/template/HeaderTemplate";
import ButtonComponent from "../components/common/ButtonComponet";
import Profile from "../components/common/Profile";
import { useLocation } from "react-router-dom";


const AppLayout = ({ children }) => {
    const { addClientOpen } = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const handleOpen = () => {
        dispatch(setAddClientOpen(true))
    }

    const { pathname } = useLocation()
    const path = pathname.split("/")[1]

    const menuItem = [
        { text: "Dashboard", icon: <DashboardIcon color="primary" />, path: '/dashboard' },
        { text: "My Prospects", icon: <Person color="primary" />, path: "/my-prospects" },
        { text: "List View", icon: <People color="primary" />, path: "/list-view" },
    ]
    return (
        <Grid container height={"100vh"} overflow={"hidden"}>
            {/* Sidebar */}
            <Grid size={2}>
                <SidebarTemplate>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Sales CRM
                        </Typography>
                    </Toolbar>
                    <Divider sx={{ mt: 2 }} />
                    <SidebarList menuItems={menuItem} />
                    <Box flex={1} />
                    <Divider />
                </SidebarTemplate>
            </Grid>

            <AddClientModal open={addClientOpen } onClose={() => dispatch(setAddClientOpen(false))} />

            {/* Main Content */}

            <Grid size={10}>
                <HeaderTemplate>
                    <Toolbar sx={{ justifyContent: "space-between" }}>
                        {

                                <Typography variant="h5" sx={{ color: "#333", fontWeight: "bold" }}>
                                    Dashboard
                                </Typography>
                        
                        }

                        {/* Search bar */}


                        {/* Actions */}
                        <Box sx={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "end", gap: 2 }}>
                            <ButtonComponent text={"Add Prospect"} action={handleOpen} />
                            
                        </Box>
                    </Toolbar>
                </HeaderTemplate>
                {children}
            </Grid>

        </Grid>
    );
}

export default AppLayout