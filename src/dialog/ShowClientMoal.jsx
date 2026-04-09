import { Card, Dialog, Typography } from '@mui/material'
import React from 'react'
import ClientDetails from '../components/specific/ClientDetails'

const ShowClientModal = ({ open,client,setOpen }) => {

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <ClientDetails client={client}/>
    </Dialog>
  )
}

export default ShowClientModal