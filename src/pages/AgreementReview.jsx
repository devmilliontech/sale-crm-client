import { Box, Typography, Paper, Button, TextField, AppBar, Toolbar, Stepper, Step, StepLabel, Stack, FormControl, InputLabel, Select, MenuItem, Dialog, Grid, Container, IconButton } from "@mui/material";
import SignaturePad from "react-signature-canvas";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIcon from "@mui/icons-material/Phone";
import axios from "axios";
import CardPaymentForm from "./admin/CardDetails";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast"
import AgreementSuccess from "../dialog/AgreementSuccess";
import html2pdf from "html2pdf.js";
import Logo from "../assets/MillionHIts_Logo.png"
import HeaderTemplate from "../components/template/HeaderTemplate";
import { Download, FileOpen, ZoomIn, ZoomOut } from "@mui/icons-material";
import logo from "../assets/MillionHitsNewLogo.png"
import Sign from "../assets/sign-zahid.png"
import DavidSign from "../assets/david_signature.png"

const AgreementReview = () => {
    const [error, setError] = useState(false)

    const [open, setOpen] = useState(false)
    const [agreement, setAgreement] = useState(null);
    const [agreements, setAgreements] = useState([]);
    const [client, setClient] = useState(null)
    const [activeStage, setActiveStage] = useState(1);
    const [isSigned, setIsSigned] = useState(false);
    const [loading, setLoading] = useState(false)
    const [cardDetails, setCardDetails] = useState({
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
    });
    const sigPad = useRef(null);
    const [signatureImage, setSignatureImage] = useState(null);

    const [title, setTitle] = useState("Project Manager");

    const handleInput = (e) => {
        setTitle(e.target.innerText); // update state with new text
    };


    const [steps, setSteps] = useState(["Review Agreement", "Digital Signature"]);

    const { id } = useParams();


    const pdfRef = useRef()

    const checkSignature = () => {
        if (sigPad.current) {
            const isEmpty = sigPad.current.isEmpty();
            setIsSigned(!isEmpty);

            if (!isEmpty) {
                const dataUrl = sigPad.current.toDataURL();
                setSignatureImage(dataUrl);
            }
        }
    };


    const handleCardDetails = (e) => {
        const { name, value } = e.target;

        let formattedValue = value;

        if (name === "cardNumber") {
            formattedValue = value.replace(/\D/g, "");
            formattedValue = formattedValue.match(/.{1,4}/g)?.join(" ") || "";
        }

        if (name === "expiryDate") {
            formattedValue = value.replace(/\D/g, "");

            if (formattedValue.length > 2) {
                if (formattedValue.slice(0, 2) > 12) {
                    formattedValue = 12 + "/" + formattedValue.slice(2, 4);
                }
                else {
                    formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
                }
            }
        }

        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    };


    const handleDownload = () => {
        const element = pdfRef.current;
        const opt = {
            margin: 0.5,
            filename: `Agreement-${client.fullName}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: {
                unit: 'in',
                orientation: 'portrait'
            }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handleClose = () => {
        setOpen(prev => !prev)
    }

    const generatePdfBlob = async () => {
        const element = pdfRef.current;
        if (!element) return null;

        return new Promise((resolve) => {
            const opt = {
                margin: 0.5,
                filename: `Agreement-${client?.fullName}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            html2pdf()
                .set(opt)
                .from(element)
                .toPdf()
                .get('pdf')
                .then((pdf) => {
                    const blob = pdf.output('blob');
                    resolve(blob);
                });
        });
    };


    const handleSubmit = async () => {
        if (!isSigned) {
            toast.error("Please provide a signature before submitting.");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Submitting...");

        try {
            const pdfBlob = await generatePdfBlob();
            if (!pdfBlob) {
                toast.error("Failed to generate PDF");
                setLoading(false);
                toast.dismiss(toastId);
                return;
            }

            const file = new File([pdfBlob], "Agreement.pdf", { type: "application/pdf" });

            const formDataObj = new FormData();
            formDataObj.append("agreementId", id);
            formDataObj.append("file", file);
            formDataObj.append("cardDetails", JSON.stringify(cardDetails));

            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/submit-agreement/${id}`,
                formDataObj
            );

            setActiveStage(activeStage + 1);
            setOpen(true);
            toast.success("Agreement submitted successfully!");
        } catch (error) {
            console.error("Error submitting agreement:", error);
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to submit agreement. Please try again.");
            }
        } finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    };



    const fetchAgreement = async () => {
        setLoading(true)
        const toastID = toast.loading("Loading")
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-agreement/${id}`);

            setAgreement(data.agreement);
            setClient(data.agreement.client)

        } catch (error) {
            console.error("Error fetching agreement:", error);
        }
        setLoading(false)
        toast.dismiss(toastID)
    };

    const getAllagreement = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-agreements`)
            setAgreements(data.agreements)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAgreement();
        getAllagreement()
    }, []);


    return (
        <Box sx={{ backgroundColor: "#f7f9ff", height: "100vh", overflow: "hidden" }}>
            <Header />

            <Dialog open={loading}></Dialog>
            <AgreementSuccess agreement={agreement} open={open} handleClose={handleClose} handleDownload={handleDownload} />

            <Box sx={{ height: "calc(100vh - 10vh)", overflow: "auto" }}>
                <Container component={"main"} maxWidth="md" sx={{ p: 2, maxWidth: "900px", mx: "auto" }}>

                    <AgreementStepper steps={steps} activeStep={activeStage} />

                    <Grid size={8}>
                        <Box p={2} bgcolor={"#ffffffff"} borderRadius={2}>
                            <Typography variant="h6" my={1} fontWeight={"bold"}>Agreement Document</Typography>

                            <Box position={"relative"} borderRadius={2} mt={4} sx={{ border: "2px dashed #dededeff" }}>
                                <Box p={2} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                                    <Box display={"flex"} gap={2} alignItems={"center"}>
                                        <FileOpen />
                                        <Typography >Service_Agreement_{client?.fullName.split(" ").join("_")}.pdf</Typography>
                                    </Box>
                                    <Box display={"flex"} gap={2} alignItems={"center"}>
                                        <IconButton >
                                            <ZoomOut />
                                        </IconButton>
                                        <Typography >%</Typography>
                                        <IconButton >
                                            <ZoomIn />
                                        </IconButton>
                                        <Download sx={{ cursor: "pointer" }} onClick={handleDownload} />
                                    </Box>
                                </Box>

                                <Box p={2} height={"700px"} overflow={"auto"}>
                                    <div ref={pdfRef}>
                                        <Stack
                                            id="agreement-content"
                                            sx={{
                                                p: 0,
                                                width: "100%",
                                                mx: "auto",
                                            }}
                                            elevation={3}

                                        >
                                            <Box display={"flex"} justifyContent={"space-between"}>
                                                <Box>
                                                    <Typography

                                                        variant="h6"
                                                        sx={{ fontWeight: "bold" }}
                                                    >
                                                        SERVICE AGREEMENT
                                                    </Typography>
                                                    <Typography className="custom-font" mb={4}>
                                                        Agreement No: {`MH${new Date().getFullYear()}${new Date().getMonth() + 1}${agreements?.length + 1}`} <br />
                                                    </Typography>
                                                </Box>
                                                <Box component={"img"} src={logo} height={50} >
                                                </Box>
                                            </Box>

                                            <Box mb={3} sx={{ border: "1px solid rgba(0, 0, 0, 0.08)", px: 4, py: 3, borderRadius: 5 }} display={"flex"} justifyContent={"space-between"}>
                                                <Box>
                                                    <Typography className="custom-font" mb={2} variant="h6" fontWeight={"bold"}>
                                                        Client Information
                                                    </Typography>
                                                    <div className="custom-font">
                                                        Name : {client?.fullName} <br />
                                                        Company Name : {client?.businessName} <br />
                                                        Email : {client?.email} <br />
                                                        Phone : {client?.phone} <br />
                                                        ABN : {client?.abn}
                                                    </div>
                                                </Box>

                                                <Box>
                                                    <Typography className="custom-font" variant="h6" fontWeight={"bold"} mb={2}>
                                                        Service Provider
                                                    </Typography>
                                                    <div style={{ width: "100%" }} >
                                                        Company Name : Million Hits <br />
                                                        Email : info@millionhits.com.au <br />
                                                        Contact : 0401 403 576 <br />
                                                        ABN : 81 652 463 299 <br />
                                                        Website : www.millionhits.com.au
                                                    </div>
                                                </Box>
                                            </Box>

                                            <Box mb={3} sx={{ border: "1px solid rgba(0, 0, 0, 0.08)", px: 4, py: 3, borderRadius: 5 }}>
                                                <Typography mb={2} variant="h6" fontWeight={"bold"}>
                                                    Deliverable
                                                </Typography>


                                                {
                                                    client?.services?.map(({ Servicetype, value }, idx) => (
                                                        <Box key={idx} width={"45%"}>
                                                            <Box mt={0.5} display={"flex"} justifyContent={"space-between"} width={"calc(200% + 64px)"}>
                                                                <Typography>
                                                                    {Servicetype}
                                                                </Typography>
                                                                {["WordPress Website", "Shopify Website", "Web App Development", "Social Media Optimization", "SEO", "Mobile App Development", "SquareSpace Website", "WooCommerce Website", "Custom Website"].includes(Servicetype) && <Typography >{value} {["WordPress Website", "SquareSpace Website", "Custom Website"].includes(Servicetype) ? "(Pages)" : ["Shopify Website", "WooCommerce Website"].includes(Servicetype) ? "(products)" : Servicetype == "Web App Development" ? "(websites)" : Servicetype == "Mobile App Development" ? "(apps)" : Servicetype == "SEO" ? "(keywords)" : Servicetype == "Social Media Optimization" ? "(posts)" : ""}</Typography>}
                                                            </Box>
                                                        </Box>
                                                    ))
                                                }
                                            </Box>



                                            <Box mb={3} sx={{ border: "1px solid rgba(0, 0, 0, 0.08)", px: 4, py: 3, borderRadius: 5 }}>
                                                <Typography mb={2} variant="h6" fontWeight={"bold"}>
                                                    Contract Term
                                                </Typography>

                                                <Typography >{client?.contractType}</Typography>

                                            </Box>

                                            <Box mb={3} sx={{ border: "1px solid rgba(0, 0, 0, 0.08)", px: 4, py: 3, borderRadius: 5 }}>
                                                <Typography mb={2} variant="h6" fontWeight={"bold"}>
                                                    Plan
                                                </Typography>

                                                <Typography>Business Plan</Typography>

                                                <Box>
                                                    <Box style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <Typography > - setup cost</Typography>
                                                        <Typography>${agreement?.setUpCost} {agreement?.setUpCostTag}</Typography>
                                                    </Box>
                                                </Box>

                                                <Box mt={4} display={"flex"} justifyContent={"space-between"}>
                                                    <Typography variant="h6" fontWeight={"bold"}>Total</Typography>
                                                    <Typography variant="h6" fontWeight={"bold"}>${client?.price}/month</Typography>
                                                </Box>
                                            </Box>
                                        </Stack>

                                        <div className="page-break"></div>


                                        <Stack
                                            id="terms-content"
                                            sx={{

                                                p: 4,
                                                width: "100%",
                                                mx: "auto",
                                            }}
                                        >
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: "bold" }}
                                                >
                                                    Terms and Conditions
                                                </Typography>
                                                <Typography mt={2} lineHeight={"150%"} fontSize={"16px"}>
                                                    This Agreement relates to the provision of Social Media Management (SMM) services (“the Services”) by Million Technologies Group Pty Ltd (ACN 652 463 299), trading as Million Hits, to the client (“The Client”) for their website (“the Client’s Website”). By signing this Agreement, the Client agrees to be bound by the following:
                                                </Typography>
                                            </Box>

                                            <Box my={3}>
                                                {
                                                    agreement && agreement.termsAndConditions.general.map(({ heading, points }, idx) => (
                                                        <div key={idx}>
                                                            <Typography variant="h6"
                                                                sx={{ fontWeight: "bold" }}>{idx + 1}. {heading}</Typography>
                                                            <Box>
                                                                {
                                                                    points.map((point, i) => <Typography key={point} style={{ lineHeight: "150%", marginBottom: "10px" }} >
                                                                        {i + 1}: {point}
                                                                    </Typography>)
                                                                }
                                                            </Box>
                                                        </div>
                                                    ))
                                                }
                                                <div className="page-break"></div>
                                                {
                                                    agreement && agreement.termsAndConditions.services.map(({ heading, points }, idx) => (
                                                        <div key={idx}>
                                                            <Typography variant="h6"
                                                                sx={{ fontWeight: "bold" }}>{6 + idx}. {heading}</Typography>
                                                            <Box>
                                                                {
                                                                    points.map((point, i) => <Typography key={point} style={{ lineHeight: "150%", marginBottom: "10px" }} >
                                                                        {i + 1}: {point}
                                                                    </Typography>)
                                                                }
                                                            </Box>
                                                        </div>
                                                    ))
                                                }
                                                {
                                                    agreement?.notes && (
                                                        <>
                                                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Notes </Typography>
                                                            <Typography>{agreement.notes}</Typography>
                                                        </>

                                                    )
                                                }
                                            </Box>

                                        </Stack>
                                        {agreement?.termsAndConditions?.services?.length > 2 && <div className="page-break"></div>}

                                        <Box mb={4} px={4} mt={3} display={"flex"} alignItems={"flex-end"} justifyContent={"space-between"}>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" mb={2}>
                                                    Client Signature
                                                </Typography>
                                                {signatureImage ? (
                                                    <img
                                                        src={signatureImage}
                                                        alt="User Signature"
                                                        style={{ width: "200px", height: "80px" }}
                                                    />
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Signature will appear here after signing
                                                    </Typography>
                                                )}
                                                <Typography fontWeight={"bold"}>{client?.businessName}</Typography>
                                                <Typography>Name : {client?.fullName}</Typography>
                                                <Typography>{title}</Typography>
                                                <Typography>Date : {new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + (new Date().getFullYear())}</Typography>
                                            </Box>

                                            <Box>
                                                <img src={agreement?.createdBy == "alizahid11@gmail.com" ? Sign : DavidSign} width={150} />
                                                <Typography>For Million Hits</Typography>
                                                <Typography>{agreement?.createdBy == "alizahid11@gmail.com" ? "Zahid Ali" : "David Ali"}</Typography>
                                                <Typography>Business Analyst</Typography>
                                            </Box>
                                        </Box>
                                    </div>
                                </Box>

                            </Box>
                        </Box>
                    </Grid>

                    <Box sx={{ px: 6, py: 4, mb: 3, bgcolor: "white", borderRadius: 3 }}>
                        <Grid container>
                            <Grid size={{ sm: 6, xs: 12 }}>
                                <Typography variant="h5" textAlign={"center"} fontWeight="bold" mb={3} gutterBottom>
                                    Digital Signature
                                </Typography>
                                <SignaturePad
                                    ref={sigPad}
                                    canvasProps={{
                                        width: 350,
                                        height: 150,
                                        className: "sigCanvas",
                                        style: { border: "1px solid #ccc" }
                                    }}
                                    onEnd={checkSignature}
                                />
                                <Typography fontWeight={"bold"}> {client?.businessName}</Typography>
                                <Typography>Name : {client?.fullName}</Typography>
                                <Box display={"flex"} alignItems={"center"}>
                                    <Typography onInput={handleInput} onBlur={handleInput}>Title : </Typography>
                                    <Typography >{title}</Typography>
                                </Box>
                                <Typography>Date : {new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + (new Date().getFullYear())}</Typography>
                            </Grid>
                            <Grid size={{ sm: 6, xs: 12 }}>
                                {agreement?.requiredCardDetails && (
                                    <CardPaymentForm cardDetails={cardDetails} onCardDetailsChange={handleCardDetails} error={error} setError={setError} />
                                )}
                            </Grid>
                        </Grid>


                        <Button
                            disabled={loading || error}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 3 }}
                            onClick={handleSubmit}
                        >
                            Submit Agreement
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

// components/Header.jsx
const Header = () => {
    return (
        <HeaderTemplate>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <img src={Logo} alt="Logo" height={48} />
                </Box>

                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LockIcon fontSize="small" color="success" />
                        <Typography variant="body2" color="success.main">
                            Secure Connection
                        </Typography>
                    </Box>
                </Box>
            </Toolbar>
        </HeaderTemplate>
    );
};

// components/AgreementStepper.jsx
const AgreementStepper = ({ steps, activeStep }) => {
    return (
        <Box sx={{ width: "100%", mt: 2, mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Box>
    );
};

export default AgreementReview;

