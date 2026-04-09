import { Paper, Stack } from '@mui/material'
import React from 'react'

const HeaderTemplate = ({children}) => {
    // const {darkMode} = use
    return (
        <Stack sx={{ py: 2, px: 4,borderBottom:1,borderColor:"rgba(222, 222, 222)",bgcolor:"#ffff" }}>
            {children}
        </Stack>
    )
}

export default HeaderTemplate