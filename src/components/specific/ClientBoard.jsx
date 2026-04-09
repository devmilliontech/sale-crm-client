import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, CardContent, Typography, Dialog, TextField, DialogTitle, DialogContent, DialogActions, Stack } from "@mui/material";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import ShowClientModal from "../../dialog/ShowClientMoal";
import AllClientsModal from "../../dialog/AllClientsModal";
import ButtonComponent, { SecondaryButton } from "../common/ButtonComponet";
import AppLayout from "../../layout/AppLayout";
import AdminLayout from "../../layout/AdminLayout";
import { getActiveStage, getStageLabel } from "../../../utils/utility";
import { useNavigate } from "react-router-dom";

export default function ClientBoard({ role }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState(null);
    const [cardData, setCardData] = useState(null);
    const [openAllClientsModal, setOpenAllClientsModal] = useState(false);
    const [reasonModalOpen, setReasonModalOpen] = useState(false);
    const [reasonText, setReasonText] = useState("");
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [activeItem, setActiveItem] = useState(null)
    const [activeColName, setActiveColName] = useState("")
    let toastId;

    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = auth?.token;
    const _id = auth._id
    const { addClientOpen } = useSelector(state => state.modal);

    const navigate = useNavigate()

    const notesKeys = ["noInterested", "onHold", "noResponse", "callBack", "clientLost"];

    // --- Auto-scroll refs/state ---
    const isDraggingRef = useRef(false);
    const pointerXRef = useRef(null);
    const pointerYRef = useRef(null);
    const rafRef = useRef(null);

    // Helper: find nearest scrollable ancestor (or return document.scrollingElement)
    const findScrollableParent = (el, axis = "y") => {
        while (el && el !== document.body && el !== document.documentElement) {
            try {
                const style = window.getComputedStyle(el);
                const overflowX = style.overflowX;
                const overflowY = style.overflowY;
                if (axis === "x") {
                    const isScrollableX =
                        (overflowX === "auto" || overflowX === "scroll" || overflowX === "overlay") &&
                        el.scrollWidth > el.clientWidth;
                    if (isScrollableX) return el;
                } else {
                    const isScrollableY =
                        (overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay") &&
                        el.scrollHeight > el.clientHeight;
                    if (isScrollableY) return el;
                }
            } catch (err) {
                // ignore cross-origin or computed-style errors
            }
            el = el.parentElement;
        }
        // fallback to document scrolling element
        return document.scrollingElement || document.documentElement;
    };

    // Auto-scroll loop (rAF)
    const autoScrollLoop = useCallback(() => {
        if (!isDraggingRef.current) {
            rafRef.current = null;
            return;
        }

        const x = pointerXRef.current;
        const y = pointerYRef.current;
        if (x == null || y == null) {
            rafRef.current = requestAnimationFrame(autoScrollLoop);
            return;
        }

        const elUnderPointer = document.elementFromPoint(x, y) || document.body;

        const scrollableX = findScrollableParent(elUnderPointer, "x") || (document.scrollingElement || document.documentElement);
        const scrollableY = findScrollableParent(elUnderPointer, "y") || (document.scrollingElement || document.documentElement);

        const isWindowX = (scrollableX === document.scrollingElement || scrollableX === document.documentElement || scrollableX === document.body);
        const isWindowY = (scrollableY === document.scrollingElement || scrollableY === document.documentElement || scrollableY === document.body);

        const rectX = isWindowX ? { left: 0, right: window.innerWidth, width: window.innerWidth } : scrollableX.getBoundingClientRect();
        const rectY = isWindowY ? { top: 0, bottom: window.innerHeight, height: window.innerHeight } : scrollableY.getBoundingClientRect();

        const threshold = 80; // px from edges to start scrolling

        const computeSpeed = (d) => {
            const ratio = Math.max(0, (threshold - d) / threshold); // 0..1
            return Math.ceil(6 + ratio * 24); // adjust min/max speed (6..30 px/frame)
        };

        // Horizontal distances
        const distToLeft = x - rectX.left;
        const distToRight = rectX.right - x;
        let scrollAmountX = 0;
        if (distToLeft < threshold) {
            scrollAmountX = -computeSpeed(distToLeft);
        } else if (distToRight < threshold) {
            scrollAmountX = computeSpeed(distToRight);
        }

        // Vertical distances
        const distToTop = y - rectY.top;
        const distToBottom = rectY.bottom - y;
        let scrollAmountY = 0;
        if (distToTop < threshold) {
            scrollAmountY = -computeSpeed(distToTop);
        } else if (distToBottom < threshold) {
            scrollAmountY = computeSpeed(distToBottom);
        }

        // Apply X scroll
        if (scrollAmountX !== 0) {
            if (isWindowX) {
                window.scrollBy({ left: scrollAmountX, top: 0, behavior: "auto" });
            } else {
                scrollableX.scrollLeft += scrollAmountX;
            }
        }

        // Apply Y scroll
        if (scrollAmountY !== 0) {
            if (isWindowY) {
                window.scrollBy({ top: scrollAmountY, left: 0, behavior: "auto" });
            } else {
                scrollableY.scrollTop += scrollAmountY;
            }
        }

        rafRef.current = requestAnimationFrame(autoScrollLoop);
    }, []);

    const startAutoScroll = useCallback(() => {
        if (!rafRef.current) {
            rafRef.current = requestAnimationFrame(autoScrollLoop);
        }
    }, [autoScrollLoop]);

    const stopAutoScroll = useCallback(() => {
        isDraggingRef.current = false;
        pointerXRef.current = null;
        pointerYRef.current = null;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    // Global dragover listener to capture pointer coords while dragging
    useEffect(() => {
        const onGlobalDragOver = (e) => {
            // we preventDefault to allow dropping
            e.preventDefault();
            if (!isDraggingRef.current) return;
            pointerXRef.current = e.clientX;
            pointerYRef.current = e.clientY;
            startAutoScroll();
        };

        const onGlobalDragEnd = () => {
            stopAutoScroll();
        };

        document.addEventListener("dragover", onGlobalDragOver);
        window.addEventListener("dragend", onGlobalDragEnd);
        window.addEventListener("drop", onGlobalDragEnd);

        return () => {
            document.removeEventListener("dragover", onGlobalDragOver);
            window.removeEventListener("dragend", onGlobalDragEnd);
            window.removeEventListener("drop", onGlobalDragEnd);
            stopAutoScroll();
        };
    }, [startAutoScroll, stopAutoScroll]);

    // --- Fetching clients (unchanged) ---
    const fetchClients = useCallback(async () => {
        setLoading(true);
        toastId = toast.loading("Loading...");
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/sales/get-clients/${_id}`);
            const clients = res?.data?.data ?? res?.data ?? [];

            const initialData = [
                {
                    warmLead: { name: "Warm Lead", items: clients.filter(d => d.stages?.warmLead), bgColor: "#ffffcc" },
                    proposalSent: { name: "Proposal Sent", items: clients.filter(d => d.stages?.proposalSent), bgColor: "#ffff66" },
                    meeting: { name: "Meeting", items: clients.filter(d => d.stages?.meeting), bgColor: "#ffd863" },
                    interestIn: { name: "Interest In", items: clients.filter(d => d.stages?.interestIn), bgColor: "#ccff66" },
                    agreementSent: { name: "Agreement Sent", items: clients.filter(d => d.stages?.agreementSent), bgColor: "#98ff46" },
                    invoice: { name: "Invoice", items: clients.filter(d => d.stages?.invoice), bgColor: "#66ffcc" },
                    paymentComplete: { name: "Payment Complete", items: clients.filter(d => d.stages?.paymentComplete), bgColor: "#00ffff" },
                },
                {
                    noInterested: { name: "Not Interested", items: clients.filter(d => d.stages?.noInterested?.status), bgColor: "#ffcccc" },
                    onHold: { name: "On Hold", items: clients.filter(d => d.stages?.onHold?.status), bgColor: "#ccccff" },
                    noResponse: { name: "No Response", items: clients.filter(d => d.stages?.noResponse?.status), bgColor: "#bddfdf" },
                    callBack: { name: "Call Back", items: clients.filter(d => d.stages?.callBack?.status), bgColor: "#ccffcc" },
                    clientLost: { name: "Client Lost", items: clients.filter(d => d.stages?.clientLost?.status), bgColor: "#777777ff" },
                },
            ]

            setData({ stages: initialData });
        } catch (error) {
            console.error("fetchClients error:", error);
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Failed to fetch clients");
            }
        } finally {
            setLoading(false);
            toast.dismiss(toastId);
        }
    }, [token]);

    useEffect(() => {
        fetchClients();
    }, [addClientOpen, fetchClients]);

    // --- Drag handlers ---
    const handleDragStart = (colName, item, e) => {
        // cross-browser: set some drag data so Firefox will start the drag
        try {
            if (e?.dataTransfer) {
                e.dataTransfer.setData('text/plain', (item._id ?? item.id ?? JSON.stringify(item)));
                e.dataTransfer.effectAllowed = 'move';
            }
        } catch (err) { /* ignore */ }

        setActiveDragItem({ colName, item });
        isDraggingRef.current = true;
        pointerXRef.current = e?.clientX ?? null;
        pointerYRef.current = e?.clientY ?? null;
        startAutoScroll();
    };

    const handleDragOver = (e) => {
        // keep target as valid drop target
        e.preventDefault();
    };

    const handleDrop = (e, colName) => {
        e.preventDefault();
        // stop autoscroll — we'll stop after performing drop logic
        stopAutoScroll();

        if (!activeDragItem) return;

        const { colName: sourceColumnId, item } = activeDragItem;

        if (sourceColumnId == colName) {
            setActiveDragItem(null);
            return;
        }

        if (notesKeys.includes(colName)) {
            setReasonText("");
            setReasonModalOpen(true);
            setActiveColName(colName);
            setActiveItem(item);
            return;
        }
        updateStage(colName, item);
    };

    const handleDragEnd = (e) => {
        // Happens when user releases drag (even if not dropped on a column)
        setActiveDragItem(null);
        stopAutoScroll();
    };

    const updateStage = async (colName, item) => {
        try {
            const { data: resData } = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/sales/update-client/${item._id}`,
                { stageKey: colName, reason: reasonText || "" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedClient = resData.data; // this is the updated client

            // Update local state
            setData((prevData) => {
                if (!prevData) return prevData;

                // Clone previous stages to mutate safely
                const newStages = prevData.stages.map(stageGroup => {
                    const updatedGroup = { ...stageGroup };

                    // Remove client from all stage items
                    Object.keys(updatedGroup).forEach(key => {
                        updatedGroup[key] = {
                            ...updatedGroup[key],
                            items: updatedGroup[key].items.filter(c => c._id !== updatedClient._id)
                        };
                    });

                    return updatedGroup;
                });

                // Determine which group the updated stage belongs to
                const targetGroupIndex = ["noInterested", "onHold", "noResponse", "callBack", "clientLost"].includes(colName) ? 1 : 0;
                const targetGroup = newStages[targetGroupIndex];

                // Push the updated client into the correct stage
                targetGroup[colName].items.push(updatedClient);

                return { stages: newStages };
            });

            toast.success("Status Changed");
        } catch (err) {
            console.error("updateStage error:", err);
            if (err?.response?.data?.message) {
                if (err?.response?.data?.message === "jwt expired") navigate("/login");
                toast.error(err.response.data.message);
            } else {
                toast.error("Failed To Update Stage");
            }
        } finally {
            setActiveDragItem(null);
        }
    };


    // --- reason submit logic unchanged (kept as-is) ---
    const submitReason = async () => {
        toastId = toast.loading("Saving...");

        await updateStage(activeColName, activeItem);

        toast.dismiss(toastId);
        setReasonModalOpen(false);
        setReasonText("");
        setActiveColName("")
        setActiveItem("")
    };

    const cancelReason = () => {
        setReasonModalOpen(false);
        setReasonText("");
        fetchClients();
    };

    const handleClientDetails = (item) => {
        setClient(item);
    };
    const handleAllClients = useCallback((stageId, stage) => {
        setCardData(stage);
        setOpenAllClientsModal(true);
    }, []);

    useEffect(() => {
        return () => {
            setLoading(false)
            toast.dismiss(toastId)
        }
    },[])

    const Layout = role === "admin" ? AdminLayout : AppLayout;

    if (loading && !data) {
        return (
            <Layout>
                <Box p={4} display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 12vh)">
                    <Typography variant="h6">Loading client data...</Typography>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Dialog open={loading}></Dialog>

            <Box p={4} bgcolor="#f9fafc" sx={{ height: "calc(100vh - 12vh)", overflow: "auto" }}>
                <Typography variant="h5" fontWeight="bold" mb={3}>Client Board</Typography>
                {data && (
                    <>
                        <Box sx={{ overflowX: "auto", overflowY: "hidden", pb: 2, "& > div": { minWidth: "fit-content" } }}>
                            <Box display={"flex"} flexWrap={"nowrap"} gap={4} p={4} sx={{ overflowX: "visible" }}>
                                {Object.entries(data.stages[0]).map(([stageId, stage]) => (
                                    <Box
                                        key={stageId}
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDrop={(e) => handleDrop(e, stageId)}
                                        sx={{ flexShrink: 0, width: "300px" }}
                                    >
                                        <Typography textAlign="center" variant="subtitle1" fontWeight="bold" mb={1}>
                                            {stage.name} ({stage.items.length})
                                        </Typography>
                                        <Box
                                            sx={{
                                                bgcolor: "white",
                                                height: "60vh",
                                                p: 2,
                                                boxShadow: "0.5px 0.5px 5px 0.5px rgb(0, 53, 129, 0.15)",
                                                borderRadius: 4,
                                                overflowY: "auto",
                                                "&::-webkit-scrollbar": { display: "none" },
                                                msOverflowStyle: "none",
                                                scrollbarWidth: "none",
                                            }}
                                            width="300px"
                                        >
                                            <Box>
                                                {stage?.items?.map((item, idx) => (
                                                    <Stack
                                                        onClick={() => handleClientDetails(item)}
                                                        key={item._id ?? item.id ?? `${stageId}-${idx}`}
                                                        item={item}
                                                        onDragStart={(e) => handleDragStart(stageId, item, e)}
                                                        onDragEnd={(e) => handleDragEnd(e)}
                                                        draggable={stageId == "paymentComplete" ? false : true}

                                                        sx={{
                                                            mb: 1.5,
                                                            borderRadius: 4,
                                                            bgcolor: stage.bgColor,
                                                            border: activeDragItem?.item?._id === (item._id ?? item.id) ? "2px dashed #3f51b5" : "1px solid transparent",
                                                            opacity: activeDragItem?.item?._id === (item._id ?? item.id) ? 0.7 : 1,
                                                            cursor: stageId == "paymentComplete" ? "not-allowed" : "grab",
                                                            "&:active": { cursor: "grabbing" }
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography fontWeight="bold">{item?.fullName}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {item?.businessName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                                                                Stage: {getStageLabel(getActiveStage(item))}
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="bold" mt={1}>
                                                                ${item.price}
                                                            </Typography>
                                                        </CardContent>
                                                    </Stack>
                                                ))}
                                            </Box>

                                            {stage?.items?.length >= 3 && (
                                                <Typography
                                                    textAlign="end"
                                                    sx={{ cursor: "pointer", mt: 1, color: "primary.main" }}
                                                    onClick={() => handleAllClients(stageId, stage)}
                                                >
                                                    View All ({stage?.items?.length})
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Box sx={{ overflowX: "auto", overflowY: "hidden", pb: 2, "& > div": { minWidth: "fit-content" } }}>
                            <Box spacing={2} display={"flex"} sx={{ overflowX: "visible" }} gap={4} p={4} mt={4}>
                                {Object.entries(data.stages[1]).map(([stageId, stage]) => (
                                    <Box

                                        key={stageId}
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDrop={(e) => handleDrop(e, stageId)}
                                        sx={{ flexShrink: 0, width: "300px" }}
                                    >
                                        <Typography textAlign="center" variant="subtitle1" fontWeight="bold" mb={1}>
                                            {stage.name} ({stage.items.length})
                                        </Typography>
                                        <Box
                                            sx={{
                                                bgcolor: "white",
                                                height: "60vh",
                                                p: 2,
                                                boxShadow: "0.5px 0.5px 5px 0.5px rgb(0, 53, 129, 0.15)",
                                                borderRadius: 4,
                                                overflowY: "auto",
                                                "&::-webkit-scrollbar": { display: "none" },
                                                msOverflowStyle: "none",
                                                scrollbarWidth: "none",
                                            }}
                                            width="300px"
                                        >
                                            <Box>
                                                {stage?.items?.map((item, idx) => (
                                                    <Stack
                                                        onClick={() => handleClientDetails(item)}
                                                        key={item._id ?? item.id ?? `${stageId}-${idx}`}
                                                        item={item}
                                                        onDragStart={(e) => handleDragStart(stageId, item, e)}
                                                        onDragEnd={(e) => handleDragEnd(e)}
                                                        draggable
                                                        sx={{
                                                            mb: 1.5,
                                                            borderRadius: 2,
                                                            bgcolor: stage.bgColor,
                                                            border: activeDragItem?.item?._id === (item._id ?? item.id) ? "2px dashed #3f51b5" : "1px solid transparent",
                                                            opacity: activeDragItem?.item?._id === (item._id ?? item.id) ? 0.7 : 1,
                                                            cursor: "grab",
                                                            "&:active": { cursor: "grabbing" }
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Typography fontWeight="bold">{item?.fullName}</Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {item?.businessName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                                                               {item.services.map((i,idx) => idx != item.services.length - 1 ? i.Servicetype+"," : i.Servicetype)} 
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="bold" mt={1}>
                                                                ${item.price}
                                                            </Typography>
                                                        </CardContent>
                                                    </Stack>
                                                ))}
                                            </Box>

                                            {stage?.items?.length >= 3 && (
                                                <Typography
                                                    textAlign="end"
                                                    sx={{ cursor: "pointer", mt: 1, color: "primary.main" }}
                                                    onClick={() => handleAllClients(stageId, stage)}
                                                >
                                                    View All ({stage?.items?.length})
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </>
                )}
            </Box>

            <ShowClientModal open={!!client} client={client} setOpen={() => setClient(null)} />
            <AllClientsModal open={openAllClientsModal} onClose={() => setOpenAllClientsModal(false)} cardData={cardData} />

            <Dialog open={reasonModalOpen} onClose={cancelReason} fullWidth maxWidth="sm">
                <DialogTitle>Provide reason</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" mb={1}>
                        You moved <strong>{activeItem?.fullName || "this client"}</strong> to <strong>{activeColName}</strong>. Please provide a reason.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        value={reasonText}
                        onChange={e => setReasonText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <SecondaryButton text={"Cancel"} handleChange={cancelReason} />
                    <ButtonComponent text={"Submit"} action={submitReason} />
                </DialogActions>
            </Dialog>
        </Layout>
    );
}



