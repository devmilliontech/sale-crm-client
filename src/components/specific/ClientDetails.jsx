import { Box, Card, Typography } from '@mui/material'
import React from 'react'

const ClientDetails = ({ client }) => {

    console.log(client)

    const activeAdditional = client?.stages
        ? Object.keys(client.stages).find(k => client.stages[k]?.status)
        : null;

    return (
        <Card sx={{ height: 450, overflow: "auto", px: 6, py: 4 }}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
                {client?.fullName}
            </Typography>
            <Typography variant="body1" mb={1}>
                Business: {client?.businessName}
            </Typography>
            <Typography variant="body1" mb={1}>
                Email: {client?.email}
            </Typography>
            <Typography variant="body1" mb={1}>
                Phone: {client?.phone}
            </Typography>
            <Typography variant="body1" mb={1}>
                Price: ${client?.price}
            </Typography>
            <Typography variant="body1" mb={1}>
                Services: {client?.services?.map(s => s.Servicetype).join(", ")}
            </Typography>

            <Typography variant="body1" mb={1}>
                Notes: {client?.additionalNotes}
            </Typography>

            {activeAdditional ? (
                client?.additionalStagesHistory.map((i) => (
                    <Box mt={1}>
                        <Typography variant="subtitle2">
                            Stage : {i.stageKey}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">{new Date(i.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }).split(",")[0]} : {i.reason || "-"}</Typography>
                    </Box>
                ))
            ) : <Typography variant="body1">
                Stage: {client && Object.keys(client?.stages).filter(key => client?.stages[key] == true).join(", ")}
            </Typography>}
        </Card>
    )
}

export default ClientDetails