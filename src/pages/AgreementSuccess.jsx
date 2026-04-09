import React from "react";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function AgreementSuccess() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                bgcolor: "#f9fafc",
            }}
        >
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
                {/* Animated Green Check */}
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
                        <strong>Client Name:</strong> John Anderson
                    </Typography>
                    <Typography>
                        <strong>Agreement Type:</strong> Service Contract
                    </Typography>
                    <Typography>
                        <strong>Date Signed:</strong> 
                    </Typography>
                    <Typography>
                        <strong>Contract Value:</strong> $15,000
                    </Typography>
                    <Typography>
                        <strong>Status:</strong>{" "}
                        <span style={{ color: "green", fontWeight: "bold" }}>Completed</span>
                    </Typography>
                </Paper>

                {/* Buttons */}
                <Box mt={4} display="flex" flexDirection="column" gap={2}>
                    <Button variant="contained" color="primary">
                        Close
                    </Button>
                </Box>

                {/* Footer Actions */}
                <Box mt={3} display="flex" justifyContent="center" gap={4}>
                    <Typography
                        variant="body2"
                        sx={{ cursor: "pointer", color: "gray" }}
                    >
                        📄 Download PDF
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ cursor: "pointer", color: "gray" }}
                    >
                        ✉️ Email Copy
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}
