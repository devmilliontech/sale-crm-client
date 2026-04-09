import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Modal, CircularProgress, Stack } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import ButtonComponent from "../common/ButtonComponet";

const AdminOTPModal = ({ open, onClose, onAuthenticated }) => {
    const { email } = JSON.parse(localStorage.getItem("auth"))
    const [otp, setOtp] = useState("");

    const sendOtp = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/send-otp`, { email });
        } catch (err) {
            console.error(err);
            toast.error("Failed to send OTP");
        }
    };

    const verifyOtp = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/verify-otp`, { email, otp }); // backend endpoint
            onAuthenticated();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Invalid OTP");
        }
    };

    useEffect(() => {
        sendOtp()
    }, [])

    return (
        <Modal open={open}>
            <Box sx={{ width: 400, bgcolor: "white", mx: "auto", my: "15%", p: 3, borderRadius: 2 }}>
                <Typography
                    variant="h6"
                    align="center"
                    fontWeight="bold"
                    color="primary"
                    gutterBottom
                >
                    Enter OTP
                </Typography>
                <TextField
                    fullWidth
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    size="small"
                    inputProps={{
                        maxLength: 6,
                        style: { textAlign: "center", fontSize: "1.5rem", },
                    }}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "50px",   // 👈 makes it rounded
                        },
                    }}

                />
                <Stack sx={{ mt: 3 }} >
                    <ButtonComponent text={"Verify OTP"} action={verifyOtp} />
                </Stack>
            </Box>
        </Modal>
    );
};

export default AdminOTPModal;
