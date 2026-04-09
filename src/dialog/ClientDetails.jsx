import { Card, Dialog, Typography } from '@mui/material'
import React from 'react'

const ClientDetails = ({ open, client, setOpen }) => {

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
      <Card sx={{ px: 6, py: 4 }}>
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
        <Typography variant="body1">
          Stage: {client && (
            client.stage || Object.keys(client?.stages || {}).filter(key => {
              const v = client?.stages[key];
              // primary boolean or nested status
              return typeof v === 'boolean' ? v : v?.status;
            }).join(", ")
          )}
        </Typography>
        {/* show reason if any additional stage is active */}
        {client?.stages && (() => {
          const additionalKeys = ["noInterested", "onHold", "noResponse", "callBack"];
          const active = additionalKeys.find(k => client.stages[k]?.status);
          if (active) return (
            <Typography variant="body2" color="text.secondary" mt={1}>
              Reason: {client.stages[active]?.reason || "-"}
            </Typography>
          );
          return null;
        })()}
      </Card>
    </Dialog>

  )
}

export default ClientDetails