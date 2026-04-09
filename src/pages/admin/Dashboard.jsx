import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Typography,
    Stack,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Dialog,
} from "@mui/material";
import {
    ResponsiveContainer,
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Bar
} from "recharts";


import MainTemplate from "../../components/template/MainTemplate";
import CardComponent from "../../components/common/CardComponent";
import AdminLayout from "../../layout/AdminLayout";
import ButtonComponent from "../../components/common/ButtonComponet";

import axios from "axios";
import toast from "react-hot-toast";
import { months } from "../../constants/dummyData";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#00C49F", "#FF8042"];
const stages = ["warmLead", "proposalSent", "agreementSent", "invoice", "paymentComplete"];

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [users, setUsers] = useState([]);
    const [sales, setSales] = useState([]);
    const [val, setVal] = useState("All");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [revenue, setRevenue] = useState([])

    let toastId;

    const { addClientOpen } = useSelector(state => state.modal)

    const { token } = JSON.parse(localStorage.getItem("auth"));

    const navigate = useNavigate()

    const cardStats = [
        { title: "Total Prospects", value: dashboardData?.totalClients, color: "green", bgcolor: "#ffe5e8" },
        { title: "Total Agreements", value: dashboardData?.totalAgreement, color: "primary", bgcolor: "#fff5e5" },
        { title: "Pending Signatures", value: dashboardData?.totalPendingAgreement, color: "error", bgcolor: "#ebe5ff" },
        { title: "Total Sales", value: `${dashboardData?.totalSales}`, color: "red", bgcolor: "#e5ffea" },
    ];

    const transformGraphData = (graphData) => {
        const transformed = graphData.map((item) => ({
            name: item.user.fullName || "Admin",
            warmLead: item.stageCounts?.warmLead || 0,
            proposalSent: item.stageCounts?.proposalSent || 0,
            agreementSent: item.stageCounts?.agreementSent || 0,
            invoice: item.stageCounts?.invoice || 0,
            paymentComplete: item.stageCounts?.paymentComplete || 0,
        }));

        setUsers(transformed.map((u) => u.name));

        const stageData = stages.map((stage) => {
            const stageObj = { stage };
            transformed.forEach((u) => {
                stageObj[u.name] = u[stage];
            });
            stageObj.total = transformed.reduce((acc, u) => acc + u[stage], 0);
            return stageObj;
        });

        setChartData(stageData);
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        toastId = toast.loading("Loading...");
        setVal("All");
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-dashboard-data`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDashboardData(data);
            setSales(data.users);
            setMonth("");
            setYear("");
            transformGraphData(data.graphData);
            // setChartData(data?.chartData);
            console.log(data)
        } catch (error) {
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Dashboard Data")
            }
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    const getFilteredUserData = async (selectedUser) => {
        setVal(selectedUser?.fullName || "Admin");
        setLoading(true);
        const toastId = toast.loading("Loading...");
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/admin/get-executive-dashboard/${selectedUser._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDashboardData(data);
            setUser(selectedUser);
            setMonth("");
            setYear("");

            const transformed = {
                name: data.user.fullName || "Admin",
                warmLead: data.stageCounts?.warmLead || 0,
                proposalSent: data.stageCounts?.proposalSent || 0,
                agreementSent: data.stageCounts?.agreementSent || 0,
                invoice: data.stageCounts?.invoice || 0,
                paymentComplete: data.stageCounts?.paymentComplete || 0,
            };

            setUsers([transformed.name]);

            const stageData = stages.map((stage) => ({
                stage,
                [transformed.name]: transformed[stage],
                total: transformed[stage],
            }));

            setChartData(stageData);
        } catch (error) {
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Data")
            }
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    

    const getDashboardDataByMonthYear = async () => {
        if (!month || !year) return toast.error("Please Select Month & Year");

        setLoading(true);
        toastId = toast.loading("Loading...");

        try {
            let url =
                val === "All"
                    ? `${import.meta.env.VITE_BACKEND_URL}/admin/get-dashboard-data-by-month-year`
                    : `${import.meta.env.VITE_BACKEND_URL}/admin/get-executivedata-by-month-year/${user._id}`;

            if (month !== "All") {
                const monthIndex = months.findIndex((m) => m === month);
                url += `?month=${monthIndex}&year=${year}`;
            } else {
                url += `?year=${year}`;
            }

            const { data } = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setDashboardData(data);

            const graphData =
                val === "All"
                    ? data.graphData
                    : [
                        {
                            user: data.user,
                            stageCounts: data.stageCounts,
                        },
                    ];

            transformGraphData(graphData);
        } catch (error) {
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Data")
            }
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    };

    const getMonthlyRevenueData = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/getMonthlyRevenueData`);
            setRevenue(data?.chartData)
        } catch (error) {
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Data")
            }
        }
    }

    useEffect(() => {
        fetchDashboardData();
        getMonthlyRevenueData();

        return () => {
            setLoading(false)
            toast.dismiss(toastId)
        }
    }, [addClientOpen]);

    return (
        <AdminLayout>
            <MainTemplate>
                <Dialog open={loading} />

                {/* Filters */}
                <Box display="flex" gap={3}>
                    <FormControl>
                        <InputLabel sx={{ fontSize: "14px" }}>Select Sales Executive</InputLabel>
                        <Select
                            size="small"
                            value={val}
                            sx={{ width: 200, bgcolor: "white" }}
                            label="Select Sales Executive"
                        >
                            <MenuItem onClick={fetchDashboardData} value="All">
                                All
                            </MenuItem>
                            {sales?.map((d) => (
                                <MenuItem key={d._id} onClick={() => getFilteredUserData(d)} value={d.fullName || "Admin"}>
                                    {d.fullName || "Admin"}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: 200, bgcolor: "white" }} size="small">
                        <InputLabel id="select-month-label">Select Month</InputLabel>
                        <Select
                            label="Select Month"
                            labelId="select-month-label"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        >
                            {months.map((m) => (
                                <MenuItem key={m} value={m}>
                                    {m}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ width: 150, bgcolor: "white" }} size="small">
                        <InputLabel id="select-year-label">Select Year</InputLabel>
                        <Select label="Select Year" labelId="select-year-label" value={year} onChange={(e) => setYear(e.target.value)}>
                            {years.map((yr) => (
                                <MenuItem key={yr} value={yr}>
                                    {yr}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <ButtonComponent text="Search" action={getDashboardDataByMonthYear} />
                </Box>

                {/* Stats Cards */}
                <Grid mt={4} container spacing={3} mb={3}>
                    {cardStats.map((item, idx) => (
                        <Grid key={idx} size={3}>
                            <CardComponent stat={item} />
                        </Grid>
                    ))}
                </Grid>

                {/* Performance Chart */}
                <Grid mt={8} container spacing={3}>
                    <Grid size={12} bgcolor="#fff" px={6} py={4} borderRadius={4}>
                        <Stack>
                            <Typography mb={4} variant="h6" gutterBottom>
                                Performance Overview
                            </Typography>
                            <ResponsiveContainer width="100%" height={400}>
                                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="stage" />
                                    <YAxis domain={[10, "dataMax + 5"]} allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    {users.map((user, index) => (
                                        <Bar key={user} dataKey={user} fill={colors[index % colors.length]} />
                                    ))}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Stack>
                    </Grid>
                </Grid>

                <Grid mt={8} container spacing={3}>
                    <Grid size={12} bgcolor="#fff" px={6} py={4} borderRadius={4}>
                        <Typography mb={4} variant="h6" gutterBottom>
                            Sales Overview
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={revenue}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={3} />
                                <Line type="monotone" dataKey="lost" stroke="#F44336" strokeWidth={3} />
                            </ComposedChart>
                        </ResponsiveContainer>

                    </Grid>
                </Grid>

            </MainTemplate>
        </AdminLayout>
    );
}
