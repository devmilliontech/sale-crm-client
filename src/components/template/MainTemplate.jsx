import { Box } from '@mui/material'
import React from 'react'

const MainTemplate = ({children}) => {
  return (
    <Box height={"90vh"} overflow={"auto"} px={8} py={6} sx={{ backgroundColor: "#f7f9ff"}}>
        {children}
    </Box>
  )
}

export default MainTemplate