import { Paper, Stack, Typography } from '@mui/material'
import React from 'react'

const CardComponent = ({stat}) => {
    return (
        <Stack  sx={{ px: 6, py: 4 }} bgcolor={stat.bgcolor} borderRadius={5}>
            <Typography variant="subtitle2" color="textSecondary">
                {stat.title}
            </Typography>
            <Typography variant="h5" fontWeight="bold">
                {stat.value}
            </Typography>
            <Typography color={stat.color}>{stat.change}</Typography>
        </Stack>
    )
}

export default CardComponent