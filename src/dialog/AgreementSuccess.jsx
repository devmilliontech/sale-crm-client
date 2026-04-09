import { Dialog } from '@mui/material'
import React from 'react'
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const AgreementSuccess = ({agreement,open,handleClose,handleDownload}) => {
    const client = agreement?.client
    return (
        <Dialog open={open} onClose={handleClose}>
            
                <Paper
                    elevation={3}
                    sx={{
                        p: 5,
                        borderRadius: 3,
                        textAlign: "center",
                        maxWidth: 450,
                        width: "100%",
                    }}
                >
                    
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 80, color: "green" }} />
                    </motion.div>

                    <Typography variant="h5" fontWeight="bold" mt={2}>
                        Congratulations!
                    </Typography>
                    <Typography color="text.secondary" mt={1}>
                        The client signed the agreement.
                    </Typography>

                    {/* Agreement Details */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            mt: 3,
                            textAlign: "left",
                            borderRadius: 2,
                            bgcolor: "#f5f7fa",
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                            AGREEMENT DETAILS
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Typography>
                            <strong>Client Name:</strong> {client?.fullName}
                        </Typography>
                        <Typography>
                            <strong>Agreement Type:</strong> Service Contract
                        </Typography>
                        <Typography>
                            <strong>Date Signed:</strong> {new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + (new Date().getFullYear())}
                        </Typography>
                        <Typography>
                            <strong>Contract Value:</strong> ${client?.price}
                        </Typography>
                        <Typography>
                            <strong>Status:</strong>{" "}
                            <span style={{ color: "green", fontWeight: "bold" }}>Completed</span>
                        </Typography>
                    </Paper>

                    {/* Buttons */}
                    <Box mt={4} display="flex" flexDirection="column" gap={2}>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Close
                        </Button>
                    </Box>

                    {/* Footer Actions */}
                    <Box mt={3} display="flex" justifyContent="center" gap={4}>
                        <Button onClick={handleDownload}>
                            📄 Download PDF
                        </Button>
                    </Box>
                </Paper>
        </Dialog>
    )
}

export default AgreementSuccess