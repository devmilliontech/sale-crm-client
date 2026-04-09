import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
  Link,
  Divider,
  CircularProgress,
  Stack,
  Dialog,
} from "@mui/material";
import { Email, Visibility, VisibilityOff } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoginData } from "../slices/authSlice";
import ButtonComponent from "../components/common/ButtonComponet";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)
  const [mail, setMail] = useState()
  const [pass, setPass] = useState()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async () => {
    const toastID = toast.loading("Loading")
    setLoading(true)

    console.log(mail)
    try {
      const data = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, { email: mail, password: pass })
      dispatch(setLoginData({ email: mail, password: pass }))
      navigate("/verify-otp")
      toast.success("OTP Send")
    } catch (error) {
      console.log(error)
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message)
      } else {
        toast.error("Failed to Send OTP")
      }
    }
    setLoading(false)
    toast.dismiss(toastID)
  };


  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f7f9ff"

    >
      <Dialog open={loading}></Dialog>
      <Stack sx={{ maxWidth: 400,p:4, width: "100%", bgcolor: "white", borderRadius: 4 }}>
        <CardContent>
          {/* Title */}
          <Typography variant="h5" align="center" fontWeight="bold" color="primary" gutterBottom>
            MillionHits Sales CRM
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" mb={3}>
            Welcome back! Please sign in to your account
          </Typography>

          {/* Email Field */}
          <TextField
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

          <Typography variant="body2" align="end" color="text.secondary" >
            <Link href="/reset-link" underline="hover">
              Forget Password
            </Link>
          </Typography>

          <Stack mt={4}>
            <ButtonComponent text={"Login"} action={handleSubmit} />
          </Stack>
          
        </CardContent>
      </Stack>
    </Box>
  );
}

export default Login