import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack } from '@mui/material'
import React from 'react'
import LogoutBtn from './LogoutBtn'
import { Link, useLocation } from 'react-router-dom'

const SidebarList = ({ menuItems }) => {
    const { pathname } = useLocation()
    const activeItem = pathname.split("/")[1].split("-").join("")


    return (
        <Stack display={"flex"} flexDirection={"column"} height={"100%"}>
            <List>
                {menuItems.map((item) => {
                    const listItem = (
                        <ListItem
                            key={item.text}
                            disablePadding
                            sx={{
                                backgroundColor:
                                    pathname.split("/")[1].split("-").join("").toLowerCase() ===
                                        item.text.toLowerCase().split(" ").join("")
                                        ? "rgba(204, 216, 252)"
                                        : "transparent",
                            }}
                        >
                            <ListItemButton
                                
                                onClick={() => {
                                    if (item.onClick) item.onClick(); // Calendar button
                                }}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText sx={{color:"blue"}} primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    );

                    // Wrap in Link only if path exists
                    return item.path ? <Link key={item.text} to={item.path} style={{ textDecoration: "none" }}>{listItem}</Link> : listItem;
                })}
            </List>


            <Box flex={1} />

            <LogoutBtn />
        </Stack>

    )
}

export default SidebarList