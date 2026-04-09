import React, { useRef, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
} from "@mui/material";
import { Download, FileOpen, ZoomIn, ZoomOut } from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "../layout/AdminLayout";
import html2pdf from "html2pdf.js";
import ButtonComponent from "../components/common/ButtonComponet";
import logo from "../assets/MillionHitsNewLogo.png"

export default function AgreementPage() {

  const pdfRef = useRef();
  const [agreement, setAgreement] = useState(null)
  const [agreements, setAgreements] = useState(null)
  const [client, setClient] = useState(null)
  const [takeCard, setTakeCard] = useState(false)
  const [loading, setLoading] = useState(false)

  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale(prev => prev + 0.2);
  };

  const handleZoomOut = () => {
    setScale(prev => prev - 0.2);
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cc: "",
    message: ""
  });

  const { id } = useParams()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDownload = () => {
    const element = pdfRef.current;
    const opt = {
      margin: 0.5,
      filename: `Agreement-${client.fullName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };


  const generatePdfBlob = async () => {
    const element = pdfRef.current;
    if (!element) return null;

    return new Promise((resolve) => {
      const opt = {
        margin: 0.5,
        filename: `Agreement-${client.fullName}.pdf`,
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



  const handleSendAgreement = async () => {
    setLoading(true);
    const toastID = toast.loading("Sending....");

    try {
      const pdfBlob = await generatePdfBlob();
      if (!pdfBlob) throw new Error("Failed to generate PDF");

      const file = new File([pdfBlob], "Agreement.pdf", { type: "application/pdf" });

      const formDataObj = new FormData();
      formDataObj.append("file", file);
      formDataObj.append("email", formData.email);
      formDataObj.append("password", formData.password);
      formDataObj.append("cc", formData.cc);
      formDataObj.append("message", formData.message);
      formDataObj.append("takeCardDetails", takeCard);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/send-agreement/${id}`,
        formDataObj, {
        headers: { "Content-Type": "multipart/form-data" }
      }
      );

      getAllagreement();
      toast.success("Agreement sent successfully!");
    } catch (error) {
      console.error("Error sending agreement:", error);
      if (error?.response?.data?.message) {
        if (error?.response?.data?.message == "jwt expired") {
          navigate("/login")
        }
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed To Send Agreement")
      }
    }

    toast.dismiss(toastID);
    setLoading(false);
  };


  const fetchAgreement = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-agreement/${id}`)
      setAgreement(data.agreement)
      setClient(data.agreement.client)
      setFormData({ ...formData, email: data.agreement.client.email })
    } catch (error) {
      if (error?.response?.data?.message) {
        if (error?.response?.data?.message == "jwt expired") {
          navigate("/login")
        }
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed To Fetch Agreement")
      }
    }
  }

  const getAllagreement = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/get-agreements`)
      setAgreements(data.agreements)
    } catch (error) {
      if (error?.response?.data?.message) {
        if (error?.response?.data?.message == "jwt expired") {
          navigate("/login")
        }
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed To Fetch Agreements")
      }
    }
  }


  useState(() => {
    fetchAgreement()
    getAllagreement()
  }, [])



  return (
    <AdminLayout>
      <Box sx={{ py: 4, bgcolor: "#f7f9ff", height: "calc(100vh - 15vh)", overflow: "auto" }}>
        {
          client && <Container>
            <Grid container spacing={3} mt={4}>
              {/* PDF Section */}
              <Grid sx={{ transform: `scale(${scale})` }} size={8}>
                <Box p={2} bgcolor={"#ffffffff"} borderRadius={2}>
                  <Typography variant="h6" my={1} fontWeight={"bold"}>Agreement Document</Typography>

                  <Box position={"relative"} borderRadius={2} mt={4} sx={{ border: "2px dashed #dededeff" }}>
                    <Box p={2} display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
                      <Box display={"flex"} gap={2} alignItems={"center"}>
                        <FileOpen />
                        <Typography>Service_Agreement_{client.fullName.split(" ").join("_")}.pdf</Typography>
                      </Box>
                      <Box display={"flex"} gap={2} alignItems={"center"}>
                        <IconButton onClick={handleZoomOut}>
                          <ZoomOut />
                        </IconButton>
                        <Typography >{Math.round(scale * 100)}%</Typography>
                        <IconButton onClick={handleZoomIn}>
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
                              <div style={{ width: "100%" }}>
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

                            <Typography>{client?.contractType}</Typography>

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


                            <Box mt={2} display={"flex"} justifyContent={"space-between"} >
                              <Typography variant="h6" fontWeight={"bold"}>Total</Typography>
                              <Typography variant="h6" fontWeight={"bold"}>${agreement?.totalAmount}/{agreement?.totalAmountTag}</Typography>
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
                                  <Typography>{agreement?.notes}</Typography>
                                </>

                              )
                            }

                          </Box>

                        </Stack>
                      </div>
                    </Box>

                  </Box>
                </Box>
              </Grid>

              {/* Right Section */}
              <Grid size={4}>
                <Stack display={"flex"} flexDirection={"column"} justifyContent={"space-between"} height={"100%"} bgcolor={"white"} borderRadius={2} sx={{ p: 3 }}>

                  <Box>
                    <Typography variant="h6" mb={8} gutterBottom>
                      Send Agreement
                    </Typography>
                    <TextField value={formData.email} label="Client Email" name="email" onChange={handleChange} fullWidth margin="dense" />

                    <TextField label="CC Emails" name="cc" onChange={handleChange} value={formData.cc} fullWidth margin="dense" />

                  </Box>

                  <Box>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={takeCard} // always boolean
                            onChange={(e) => setTakeCard(e.target.checked)}
                          />
                        }
                        label="Required Card Details"
                      />
                    </FormGroup>

                    <Stack>
                      <ButtonComponent text={loading ? "Sending..." : "Send Agreement"} action={handleSendAgreement} />
                    </Stack>


                  </Box>
                </Stack>
              </Grid>
            </Grid>

            <Dialog open={loading}></Dialog>
          </Container>
        }
      </Box >
    </AdminLayout>
  );
}
