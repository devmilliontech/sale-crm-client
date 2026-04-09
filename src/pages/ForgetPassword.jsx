import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Link,
    Stack,
    InputAdornment,
    IconButton,
    Dialog,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ButtonComponent from "../components/common/ButtonComponet";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";



export function SendResetLink() {
    const [email,setEmail] = useState("")
    const [loading,setLoading] = useState(false)

    const sendResetLink = async() => {
        setLoading(true)
        const toastId = toast.loading("Loading....")
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/reset-link`, { email });
            toast.success("Reset link sent!");

        } catch (error) {
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error("Faild to Send Reset Link")
            }
        }
        setLoading(false)
        toast.dismiss(toastId)
    }

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f7f9ff"
            }}
        >
            <Dialog open={loading} />
            <Box
                sx={{
                    width: 400,
                    borderRadius: 3,
                    p: 4,
                    bgcolor: "white",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ fontWeight: "bold", mb: 2 }}
                    >
                        Forgot Password?
                    </Typography>

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "text.secondary", mb: 3 }}
                    >
                        Enter your registered email address and we’ll send you instructions
                        to reset your password.
                    </Typography>

                    <TextField
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 3 }}
                    />

                    <Stack>
                        <ButtonComponent  text={loading? "Sending...":"Send Reset Link"} action={sendResetLink} />
                    </Stack>


                    <Box mt={3} textAlign="center">
                        <Link href="/login" underline="hover" sx={{ fontSize: "14px" }}>
                            Back to Login
                        </Link>
                    </Box>
                </CardContent>
            </Box>
        </Box>
    );
}



export function ResetPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [password,setPassword] = useState("")
    const [confirmPass,setConfimPass] = useState("")
    const [loading,setLoading] = useState(false)

    const {token} = useParams()
    const naviagate = useNavigate()

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirm = () => setShowConfirm(!showConfirm);

    const handleReset = async() => {
        setLoading(true)
        const toastId = toast.loading("Loading...")
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/reset-password`,{token,password,confirmPass})
            toast.success("Password Reset Successfully")
            naviagate('/login')
            setPassword("")
            setConfimPass("")
        } catch (error) {
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            
            }else{
                toast.error("Failed To Reset Password")
            }
        }
        setLoading(false)
        toast.dismiss(toastId)
    };

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Dialog open={loading}/>
            <Box
                sx={{
                    width: 400,
                    borderRadius: 4,
                    bgcolor:"white",
                    p:4
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ fontWeight: "bold", mb: 2 }}
                    >
                        Set New Password
                    </Typography>

                    <Typography
                        variant="body2"
                        align="center"
                        sx={{ color: "text.secondary", mb: 3 }}
                    >
                        Enter your new password below and confirm it to reset your password.
                    </Typography>

                    <TextField
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        label="New Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        sx={{ mb: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        value={confirmPass}
                        onChange={(e) => setConfimPass(e.target.value)}
                        label="Confirm Password"
                        type={showConfirm ? "text" : "password"}
                        fullWidth
                        sx={{ mb: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleClickShowConfirm} edge="end">
                                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Stack>
                        <ButtonComponent text={loading?"Updating...":"Reset Password"} action={handleReset} />
                    </Stack>
                </CardContent>
            </Box>
        </Box>
    );
}
