import { Stack } from '@mui/material'
import React from 'react'

const SidebarTemplate = ({children}) => {
    return (
        <Stack bgcolor={"#f7f9ff"} sx={{py:2}} height={"100vh"} width={"100%"} borderRight={1} borderColor={"rgba(222, 222, 222)"}>
            {children}
        </Stack>
    )
}

export default SidebarTemplate