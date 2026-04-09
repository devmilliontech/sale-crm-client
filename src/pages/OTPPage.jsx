import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Link,
    IconButton,
    Grid,
    TextField,
    CircularProgress,
    Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoginData } from "../slices/authSlice";
import ButtonComponent from "../components/common/ButtonComponet";
import toast from "react-hot-toast";

export default function OTPPage() {
    const [otp, setOtp] = useState("")
    const [timer, setTimer] = useState(600); // 5 minutes (300 sec)
    const [loading, setLoading] = useState(false)
    const {loginData} = useSelector(state => state.auth)
    const {email} = loginData

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // Countdown logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/verify-otp`, { email, otp })
            dispatch(setLoginData({...loginData,role:data.role,token:data.token}))
            localStorage.setItem("auth",JSON.stringify({...loginData,role:data.role,token:data.token,_id:data._id}))
            navigate("/dashboard")
            
        } catch (error) {
            console.log(error)
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error("Failed to verify OTP")
            }
        }
        setLoading(false)
    };

    const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
    const seconds = String(timer % 60).padStart(2, "0");

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor= "#f7f9ff"
        >
            <Box sx={{ maxWidth: 420, width: "100%", borderRadius: 4,bgcolor:"white" }}>
                <CardContent sx={{ p: 4 }}>
                    {/* Back to Login */}
                    <Box onClick={() => navigate("/login")} display="flex" alignItems="center" mb={2}>
                        <IconButton size="small">
                            <ArrowBackIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" ml={1}>
                            Back to Login
                        </Typography>
                    </Box>

                    {/* Title */}
                    <Typography
                        variant="h6"
                        align="center"
                        fontWeight="bold"
                        color="primary"
                        gutterBottom
                    >
                        Enter OTP
                    </Typography>
                    <Typography
                        variant="body2"
                        align="center"
                        color="text.secondary"
                        mb={3}
                    >
                        Enter the 6-digit code
                    </Typography>

                    {/* OTP Inputs */}
                    <form>
                        <Grid container spacing={1} justifyContent="center" mb={2}>

                            <Grid size={12}>
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
                            </Grid>

                        </Grid>

                        {/* Verify Button */}
                        <Stack mt={4}>
                            <ButtonComponent text={"Verify"} action={handleSubmit}/>
                        </Stack>
    
                    </form>

                    {/* Resend + Timer */}
                    <Box textAlign="center" mt={2}>
                        <Typography variant="body2">
                            Didn’t receive the code?{" "}
                            <Link href="#" underline="hover" sx={{ color: "red" }}>
                                Resend OTP
                            </Link>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={1}>
                            Code expires in:{" "}
                            <span style={{ color: "red", fontWeight: "bold" }}>
                                {minutes}:{seconds}
                            </span>
                        </Typography>
                    </Box>
                </CardContent>
            </Box>
        </Box>
    );
}
