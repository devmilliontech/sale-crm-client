import {
    Box,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Dialog,
    Stack,
} from "@mui/material";
import { Email, Password, Visibility, VisibilityOff } from "@mui/icons-material";
import React from 'react'
import { useState } from "react";
import ButtonComponent from "../components/common/ButtonComponet";
import toast from "react-hot-toast";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const AddExecutive = ({ open, handleOpen }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("")
    const [mail, setMail] = useState()
    const [pass, setPass] = useState()
    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const { token } = JSON.parse(localStorage.getItem("auth"))

    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {

            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/create-user`, { fullName, email: mail, password: pass },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            toast.success("Sale Executive Added Successfully")
            handleOpen()
            setFullName("")
            setMail("")
            setPass("")
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Add Sales Executive")
            }
        }
    };


    return (
        <Dialog open={open} onClose={handleOpen} maxWidth="xs" fullWidth>
            <Box px={6} py={4}>
                <Typography variant="h5" align="center" fontWeight="bold" color="primary" gutterBottom>
                    MillionHits Sales CRM
                </Typography>
                <Typography variant="body2" align="center" color="text.secondary" mb={3}>
                    Create New Sales Executive
                </Typography>

                <TextField
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    fullWidth
                    label="Full Name"
                    placeholder="Enter Full Name"
                    margin="normal"

                />
                {/* Email Field */}
                <TextField
                    type="email"
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    fullWidth
                    label="Email Address"
                    placeholder="Enter your email"
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Email />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Password Field */}
                <TextField
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowPassword} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <Stack onClick={handleSubmit} width={"100%"} mt={3}>
                    <ButtonComponent text={"Create Sales Executive"} />
                </Stack>
            </Box>
        </Dialog>
    )
}

export default AddExecutive