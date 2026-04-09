import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Stack } from "@mui/material";
import axios from "axios";
import ButtonComponent from "../../components/common/ButtonComponet";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AssignAdminPage = () => {
    const { token } = JSON.parse(localStorage.getItem("auth"))
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/assign-admin`, form,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage("✅ Admin assigned successfully!");
            setForm({ fullName: "", email: "", password: "" });
            navigate('/login')
            localStorage.clear()
            toast.success("Admin assigned successfully! Please login with new credentials.")

        } catch (error) {
            setMessage(error.response?.data?.message || "❌ Failed to assign admin");
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box bgcolor={"#f7f9ff"} height={"100vh"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Box bgcolor={"white"} borderRadius={4} sx={{ p: 4, width: 400 }} elevation={3}>
                <Typography variant="h5" mb={3} textAlign="center">
                    Assign Admin
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Full Name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <ButtonComponent text={loading ? "Assigning..." : "Assign Admin"} type="submit" />

                    </Stack>
                </form>
                {message && (
                    <Typography mt={2} textAlign="center" color={message.includes("✅") ? "green" : "red"}>
                        {message}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default AssignAdminPage;
