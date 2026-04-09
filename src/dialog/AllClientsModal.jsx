import { Box, Card, CardContent, Dialog, Grid, IconButton, Typography } from '@mui/material'
import React from 'react'
import { getActiveStage, getStageLabel } from '../../utils/utility'
import { Close } from '@mui/icons-material'
import { useState } from 'react'
import ClientDetails from '../components/specific/ClientDetails'
import ShowClientModal from './ShowClientMoal'

const AllClientsModal = ({ open, onClose, cardData }) => {
    const [openClientDetails, setOpenClientDetails] = useState(false)
    const [selectedClient,setSelectedClient] = useState(null)
    const handleClientClick = (client) => {
        setOpenClientDetails(true)
        setSelectedClient(client)
    }
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <IconButton onClick={onClose} sx={{ position: "absolute", top: 8, right: 8 }}>
                <Close/>
            </IconButton>
            <Grid display={"flex"} alignItems={"flex-start"} spacing={4} container height={"80vh"} sx={{p:6}}>
            {
                cardData?.items?.map((item, idx) => (
                    <Grid sx={{cursor:"pointer"}} onClick={() => handleClientClick(item)} size={3} bgcolor={cardData.bgColor} borderRadius={2} key={item._id}>
                        <CardContent>
                            <Typography fontWeight="bold">{item.fullName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.businessName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                                Stage: {getStageLabel(getActiveStage(item))}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" mt={1}>
                                ${item.price}
                            </Typography>
                        </CardContent>
                    </Grid>
                ))
            }
            </Grid>
            <ShowClientModal open={openClientDetails} client={selectedClient} setOpen={setOpenClientDetails}/>
        </Dialog>
    )
}

export default AllClientsModal