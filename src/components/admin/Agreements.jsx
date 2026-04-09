import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    IconButton,
    Tooltip,
    Modal,
    Dialog,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import SimCardDownloadIcon from "@mui/icons-material/SimCardDownload";
import PaymentIcon from "@mui/icons-material/Payment";
import AdminLayout from "../../layout/AdminLayout";
import MainTemplate from "../template/MainTemplate";
import Agreement_Icon from '../../assets/Agreement_Icon.png';
import UpdateAgreement from "../../dialog/updateAgreement";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import AdminOTPModal from "./AdminOTPModal";
import Edit from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../common/ButtonComponet";

const icons = [
    { icon: Edit, color: "#ffe600ff", title: "Update" },
    { icon: SimCardDownloadIcon, color: "#fe8300ff", title: "Download" },
    { icon: PaymentIcon, color: "#7b00e7ff", title: "Card Details" },
];

const Agreements = () => {
    const [agreements, setAgreements] = useState([]);
    const [agreement, setAgreement] = useState(null);
    const [openCard, setOpenCard] = useState(false);
    const [update, setUpdate] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(true);

    const [reqModalOpen, setReqModalOpen] = useState(true)

    const { createAgreementOpen } = useSelector(state => state.modal);

    const navigate = useNavigate()

    const getAllAgreements = async () => {
        setLoading(true);
        const toastID = toast.loading("Loading...");
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-agreements`);
            setAgreements(data.agreements || []);
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Agreements")
            }
        }
        setLoading(false);
        toast.dismiss(toastID);
    };

    useEffect(() => {
        getAllAgreements();
    }, [createAgreementOpen]);

    const handleView = (agreement) => {
        window.open(agreement?.pdf, "_blank");
    };

    const handleUpdate = (agreement) => {
        setAgreement(agreement);
        setUpdate(true);
    }

    const handleDownload = async (agreement) => {
        try {
            const response = await fetch(agreement.pdf, { mode: "cors" });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `Agreement-${agreement?.client?.fullName}.pdf`;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            toast.error("Download failed");
        }
    };

    const handleCardDetails = (agreement) => {
        setSelectedCard(agreement.cardDetails);
        setOpenCard(true);
    };

    if (reqModalOpen) {
        return <Dialog open={reqModalOpen}>
            <Box sx={{ px: 6, py: 4 }}>
                <Typography>An OTP will be sent to your <br /> Email Address alizahid11@gmail.com</Typography>

                <Box display={"flex"} justifyContent={"center"} mt={4}><ButtonComponent text={"Send OTP"} action={() => setReqModalOpen(false)} /></Box>
            </Box>
        </Dialog>
    }

    if (!authenticated) {
        return (<AdminOTPModal open={otpModalOpen} onClose={() => setOtpModalOpen(false)} onAuthenticated={() => setAuthenticated(true)} />);
    }

    return (
        <AdminLayout>
            <Dialog open={loading}></Dialog>
            <MainTemplate>
                {agreements.length === 0 ? (
                    <Typography fontSize="24px" textAlign="center">
                        No Agreements
                    </Typography>
                ) : (
                    <Grid container spacing={8} rowSpacing={12}>
                        {agreements.map((item, idx) => (
                            <Grid size={3} sx={{ textAlign: "center" }}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        boxShadow: "0.5px 0.5px 2px rgba(0,0,0,0.1)",
                                        mx: "auto",
                                        position: "relative",
                                        bgcolor: "white",
                                        borderRadius: 3,
                                        "&:hover": { transform: "scale(.98)", transition: "all ease 0.5s", cursor: "pointer" },
                                        transition: "all ease 0.5s",
                                    }}
                                >
                                    {item.status === "signed" && (
                                        <CheckCircleIcon
                                            sx={{
                                                color: "green",
                                                position: "absolute",
                                                top: -10,
                                                right: -10,
                                                fontSize: 36,
                                            }}
                                        />
                                    )}

                                    <Tooltip title="View Agreement">
                                        <Box
                                            onClick={() => handleView(item)}
                                            component="img"
                                            sx={{ height: "100%", width: "100%", borderRadius: 2, objectFit: "cover" }}
                                            alt="Agreement"
                                            src={Agreement_Icon}
                                        />
                                    </Tooltip>
                                </Box>

                                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: "bold" }}>
                                    {item?.client?.businessName}
                                </Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", mt: 1, gap: 3 }}>
                                    {icons.map((i, idx) => (
                                        <Tooltip key={idx} title={i.title}>
                                            <IconButton
                                                onClick={() => {
                                                    if (i.title === "Update") handleUpdate(item);
                                                    if (i.title === "Download") handleDownload(item);
                                                    if (i.title === "Card Details") handleCardDetails(item);
                                                }}
                                                disabled={
                                                    (i.title === "Card Details" && !(item?.requiredCardDetails && item?.status == "signed")) ||
                                                    (i.title === "Update" && item.status === "signed")
                                                }
                                                sx={{ borderRadius: "8px", px: 1, py: 0.5 }}
                                            >
                                                <i.icon
                                                    sx={{
                                                        color:
                                                            i.title === "Card Details"
                                                                ? (item?.requiredCardDetails && item?.status == "signed")
                                                                    ? i.color
                                                                    : "gray"
                                                                : i.title === "Update"
                                                                    ? item.status === "signed"
                                                                        ? "gray"
                                                                        : i.color
                                                                    : i.color,
                                                    }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Modal open={openCard} onClose={() => setOpenCard(false)}>
                    <Box sx={{ width: 400, bgcolor: "white", mx: "auto", my: "15%", p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" mb={2}>
                            Card Details
                        </Typography>
                        <Typography>Card Holder: {selectedCard?.cardHolderName || "N/A"}</Typography>
                        <Typography>Card Number: {selectedCard?.cardNumber || "N/A"}</Typography>
                        <Typography>Card Expiry: {selectedCard?.expiryDate || "N/A"}</Typography>
                        <Typography>Card CVV: {selectedCard?.CVV || "N/A"}</Typography>
                    </Box>
                </Modal>

                <UpdateAgreement agreement={agreement} open={update} onClose={() => setUpdate(false)} />
            </MainTemplate>
        </AdminLayout>
    );
};

export default Agreements;
