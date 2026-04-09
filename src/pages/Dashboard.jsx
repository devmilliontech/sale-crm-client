import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { ComposedChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import toast from "react-hot-toast";

import AppLayout from "../layout/AppLayout";
import MainTemplate from "../components/template/MainTemplate";
import CardComponent from "../components/common/CardComponent";
import ButtonComponent from "../components/common/ButtonComponet";
import UpdateClientModal from "../dialog/UpdateClientModal";
import { months } from "../constants/dummyData";
import { useNavigate } from "react-router-dom";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [users, setUsers] = useState([]);
  const [client, setClient] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  let toastId;

  const { token, _id } = JSON.parse(localStorage.getItem("auth"));
  const navigate = useNavigate()

  const statCards = [
    { title: "Total Prospects", value: dashboardData?.totalClients, color: "green", bgcolor: "#ffe5e8" },
    { title: "Total Agreements", value: dashboardData?.totalAgreement, color: "primary", bgcolor: "#fff5e5" },
    { title: "Pending Signatures", value: dashboardData?.totalPendingAgreement, color: "error", bgcolor: "#ebe5ff" },
    { title: "Total Sales", value: `${dashboardData?.totalSales}`, color: "red", bgcolor: "#e5ffea" },
  ];

  const handleClientModal = (client) => {
    setClient(client);
    setOpen(true);
  };

  const transformChartData = (data) => {
    const user = data.user?.fullName || "Admin";
    setUsers([user]);

    const stages = ["warmLead", "proposalSent", "agreementSent", "invoice", "paymentComplete"];
    const stageData = stages.map((stage) => ({
      stage,
      [user]: data.stageCounts?.[stage] || 0,
    }));

    setChartData(stageData);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    toastId = toast.loading("Loading dashboard...");
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-executive-dashboard/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(data);
      setMonth("");
      setYear("");
      transformChartData(data);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.message) {
        if (error?.response?.data?.message == "jwt expired") {
          navigate("/login")
        }
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed To Load Dashboard Data")
      }
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  const fetchDashboardByMonthYear = async () => {
    if (!year) return toast.error("Please select a year");

    setLoading(true);
    toastId = toast.loading("Loading...");
    try {
      let url = `${import.meta.env.VITE_BACKEND_URL}/admin/get-executivedata-by-month-year/${_id}?year=${year}`;
      if (month && month !== "All") {
        const monthIndex = months.findIndex((m) => m === month);
        url += `&month=${monthIndex}`;
      }

      const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      setDashboardData(data);
      transformChartData(data);
    } catch (error) {
      console.error(error);
      if (error?.response?.data?.message) {
        if (error?.response?.data?.message == "jwt expired") {
          navigate("/login")
        }
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed To Fetch Filterd Data")
      }
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    return () => {
      setLoading(false)
      toast.dismiss(toastId)
    }
  }, []);

  return (
    <AppLayout>
      <UpdateClientModal client={client} open={open} handleClose={() => setOpen(false)} />
      <MainTemplate>
        <Dialog open={loading} />

        <Box display="flex" gap={3}>
          <FormControl sx={{ width: 200, bgcolor: "white" }} size="small">
            <InputLabel id="select-month-label">Select Month</InputLabel>
            <Select
              labelId="select-month-label"
              label="Select Month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {months.map((m) => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: 150, bgcolor: "white" }} size="small">
            <InputLabel id="select-year-label">Select Year</InputLabel>
            <Select
              labelId="select-year-label"
              label="Select Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((yr) => (
                <MenuItem key={yr} value={yr}>{yr}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <ButtonComponent text="Search" action={fetchDashboardByMonthYear} />
        </Box>


        <Grid container spacing={3} mt={4} mb={4}>
          {statCards.map((item, idx) => (
            <Grid size={3} key={idx}>
              <CardComponent stat={item} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={12} bgcolor="white" px={6} py={4} borderRadius={4}>
            <Stack>
              <Typography mb={4} variant="h6">Performance Overview</Typography>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis domain={[0, 'dataMax + 5']} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  {users?.map((user) => <Bar key={user} dataKey={user} fill="#8884d8" />)}
                </ComposedChart>
              </ResponsiveContainer>
            </Stack>
          </Grid>
        </Grid>
      </MainTemplate>
    </AppLayout>
  );
};

export default Dashboard;
