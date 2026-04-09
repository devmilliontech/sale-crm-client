import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Box, Typography, FormControl, Select, MenuItem, InputLabel, Dialog, Divider, IconButton, Stack } from "@mui/material";
import AdminLayout from "../../layout/AdminLayout";
import MainTemplate from "../template/MainTemplate";
import axios from "axios";
import ButtonComponent from "../common/ButtonComponet";
import { months } from "../../constants/dummyData";
import toast from "react-hot-toast";
import { Edit } from "@mui/icons-material";
import UpdateClientModal from "../../dialog/UpdateClientModal";
import { useSelector } from "react-redux";
import AppLayout from "../../layout/AppLayout";
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar";


const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

export default function ClientList() {
    const [clients, setClients] = useState([]);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [users, setUsers] = useState(null)
    const [user, setUser] = useState("")
    const [query, setQuery] = useState("")
    const [name, setName] = useState("")

    let toastId;

    const { addClientOpen } = useSelector(state => state.modal)

    const navigate = useNavigate()

    const token = JSON.parse(localStorage.getItem("auth"))?.token;
    const { role, _id } = JSON.parse(localStorage.getItem("auth"))

    const fetchClientsByExecutive = async (user) => {
        setLoading(true);
        setUser(user)
        const toastId = toast.loading("Loading...");
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sales/get-clients/${user?._id}`);
            setClients(data || []);
            setMonth("")
            setYear("")
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Clients")
            }
        }
        setLoading(false);
        toast.dismiss(toastId);
    };

    const fetchClients = async () => {
        setLoading(true);
        toastId = toast.loading("Loading...");
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-clients`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setClients(data.clients || []);

            setUser("")
            setMonth("")
            setYear("")
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Clients")
            }
        }
        setLoading(false);
        toast.dismiss(toastId);
    };

    const getSalesExecutive = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-users`)
            setUsers(data)
        } catch (error) {
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch User")
            }
        }
    }

    const getClientsByMonth = async () => {
        if (!month || !year) return toast.error("Please select both month and year");
        setLoading(true);
        toastId = toast.loading("Loading...");
        
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-clients/${month} ${year}`,
                {
                    params: { owner: user?._id },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setClients(data.clients || []);
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Clients")
            }
        }
        setLoading(false);
        toast.dismiss(toastId);
    };

    const handleOpen = (client) => {
        setOpen(true);
        setSelectedClient(client);
    }

    const searchByNameOrBusiness = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sales/search?query=${query}`)
            setClients(data?.data)
            console.log(data)
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            }
        }
    }

    useEffect(() => {
        if (role == "admin") {
            fetchClients();
            getSalesExecutive();
        } else {
            fetchClientsByExecutive({ _id });
        }

        return () => {
            setLoading(false)
            toast.dismiss(toastId)
        }
    }, [open, addClientOpen, _id]);

    console.log(clients)

    const Layout = role == "admin" ? AdminLayout : AppLayout;

    return (
        <Layout>
            <Box height={"100vh"} overflow={"hidden"} px={8} py={6} sx={{ backgroundColor: "#f7f9ff" }}>

                <Dialog open={loading}></Dialog>

                <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h5" fontWeight="bold">
                        Client List
                    </Typography>
                    <Box display="flex" gap={2}>

                        {
                            role == "admin" && <FormControl size="small" sx={{ width: 200, bgcolor: "white" }}>
                                <InputLabel>Sales </InputLabel>
                                <Select value={name} onChange={(e) => setName(e.target.value)} label="Sales">
                                    <MenuItem onClick={fetchClients} value={"All"}>All</MenuItem>
                                    {users?.map((user) => (
                                        <MenuItem onClick={() => fetchClientsByExecutive(user)} key={user?.fullName} value={user?.fullName}>
                                            {user?.fullName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        }

                        <FormControl size="small" sx={{ width: 200, bgcolor: "white" }}>
                            <InputLabel>Select Month</InputLabel>
                            <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Select Month">
                                {months.map((m) => (
                                    <MenuItem key={m} value={m}>
                                        {m}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ width: 150, bgcolor: "white" }}>
                            <InputLabel>Select Year</InputLabel>
                            <Select value={year} onChange={(e) => setYear(e.target.value)} label="Select Year">
                                {years.map((y) => (
                                    <MenuItem key={y} value={y}>
                                        {y}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <ButtonComponent action={getClientsByMonth} text="Search" sx={{ height: "100%" }} />
                    </Box>
                </Box>

                <Box mt={4} display={"flex"} justifyContent={"flex-end"}>
                    <SearchBar query={query} setQuery={setQuery} handleClick={searchByNameOrBusiness} />
                </Box>

                <Box mt={2} height={"60vh"} overflow="auto" position={"relative"}>
                    <Table sx={{ bgcolor: "white", borderRadius: 4, my: 4, width: "180%", overflowX: "auto" }}>
                        <TableHead>
                            <TableRow sx={{ height: 60, display: "flex", width: "fit-content" }}>
                                {["Business", "Stage", "Date", "Name", "Phone", "Email", "Service Interested", "Sales Person", "Initial Date", "Price", "Edit"].map((head) => (
                                    <>
                                        {
                                            role != "admin" && head == "Sales Person" ? "" : <Box width={head === "Business" ? 300 : head == "Date" ? 100 : head == "Initial Date" ? 150 : head == "Price" ? 150 : head == "Service Interested" ? 400 : head == "Sales Person" ? 150 : head == "Edit" ? 50 : 300} key={head} align="center" sx={{ fontWeight: 700, fontSize: "16px", py: 2, position: head === "Business" ? "sticky" : "static", left: head === "Business" ? 0 : "auto", bgcolor: head === "Business" && "white", zIndex: head === "Business" ? 2 : 1, borderRight: head === "Business" && "1px solid #dfdfdfff", borderBottom: "1px solid #dfdfdfff" }}>
                                                {head}
                                            </Box>
                                        }

                                    </>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {clients.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        No Data Found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                clients.map((client, idx) => {
                                    // compute active stage: prefer top-level `stage`, else check `stages` booleans/nested statuses
                                    const activeFromStages = client?.stages
                                        ? Object.keys(client.stages).find(k => {
                                            const v = client.stages[k];
                                            if (typeof v === 'boolean') return v === true;
                                            if (v && typeof v === 'object' && 'status' in v) return v.status === true;
                                            return false;
                                        })
                                        : null;

                                    const activeStage = client?.stage || activeFromStages || "";

                                    console.log(activeStage)

                                    const stageLabelMap = {
                                        warmLead: "Warm Lead",
                                        proposalSent: "Proposal Sent",
                                        meeting: "Meeting",
                                        interestIn: "Interest In",
                                        agreementSent: "Agreement Sent",
                                        invoice: "Invoice",
                                        paymentComplete: "Payment Complete",
                                        noInterested: "Not Interested",
                                        onHold: "On Hold",
                                        noResponse: "No Response",
                                        callBack: "Call Back",
                                    };

                                    const friendlyStage = stageLabelMap[activeStage] || activeStage || "-";

                                    const isPaymentComplete = (client?.stage === 'paymentComplete') || (client?.stages && (client.stages.paymentComplete === true));
                                    const isLost = (client?.stage === 'clientLost') || (client?.stages && (client?.stages?.clientLost?.status === true));

                                    const rowBg = isPaymentComplete ? '#00ffff' : isLost ? "#9e9e9eff" : (idx % 2 === 0 ? 'white' : '#fffaf2');

                                    return (
                                        <TableRow key={client._id || client.id || idx} sx={{ height: 70, bgcolor: rowBg, display: "flex" }}>
                                            <Box display="flex" textAlign={"center"} justifyContent={"center"} alignItems={"center"} sx={{ width: "300px", borderRight: "1px solid #dfdfdfff", borderBottom: "1px solid #dfdfdfff", bgcolor: isPaymentComplete ? "#00ffff" : isLost ? rowBg : idx % 2 != 0 ? "#fffaf2" : rowBg, position: "sticky", top: 0, left: 0, zIndex: 50 }}>{client.businessName}</Box>
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "300px", py: 4, borderBottom: "1px solid #dfdfdfff", zIndex: 0 }}>{friendlyStage}</Box>
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "100px", py: 4, borderBottom: "1px solid #dfdfdfff", zIndex: 0 }}>{new Date(client.updatedAt).toLocaleDateString("en-GB")}</Box>
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "300px", py: 4, borderBottom: "1px solid #dfdfdfff", zIndex: 0 }}>{client.fullName}</Box>
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "300px", py: 4, borderBottom: "1px solid #dfdfdfff", zIndex: 0 }}>{client.phone}</Box>
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "300px", py: 4, borderBottom: "1px solid #dfdfdfff", zIndex: 0 }}>{client.email}</Box>
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "400px", py: 4, borderBottom: "1px solid #dfdfdfff", textAlign: "center", zIndex: 0 }}>
                                                {Array.isArray(client.services) ? client.services.map((s, i) => s.Servicetype + (i < client.services.length - 1 ? ", " : "")) : "-"}
                                            </Box>
                                            {
                                                role == "admin" && <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "150px", py: 2, textAlign: "center", borderBottom: "1px solid #dfdfdfff", zIndex: 0 }} >{client.owner?.fullName || "-"}</Box>
                                            }
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "150px", py: 4, borderBottom: "1px solid #dfdfdfff", zIndex: 0 }}>{new Date(client.createdAt).toLocaleDateString("en-GB")}</Box>
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "150px", py: 2, textAlign: "center", borderBottom: "1px solid #dfdfdfff", zIndex: 0 }}>${Number(client.price || 0).toLocaleString()}</Box>
                                            <Box display="flex" justifyContent={"center"} alignItems={"center"} sx={{ width: "50px", py: 2, textAlign: "center", borderBottom: "1px solid #dfdfdfff", zIndex: 0 }}>
                                                <IconButton onClick={() => handleOpen(client)}>
                                                    <Edit />
                                                </IconButton>
                                            </Box>
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </Box>

                <UpdateClientModal open={open} handleClose={() => setOpen(false)} client={selectedClient} />

            </Box>
        </Layout>
    );
}
