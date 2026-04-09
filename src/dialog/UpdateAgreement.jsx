import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';
import { services } from '../constants/dummyData';
import { NumericFormat } from "react-number-format";
import ButtonComponent, { SecondaryButton } from '../components/common/ButtonComponet';
import ClientInputDetails from '../components/common/ClientInputDetails';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UpdateAgreement = ({ agreement, open, onClose }) => {
    const [loading, setLoading] = useState(false)
    const { token } = JSON.parse(localStorage.getItem("auth"))
    const [formData, setFormData] = useState({
        fullName: '',
        businessName: '',
        abn: '',
        phone: '',
        email: '',
        webUrl: '',
        address: '',
        state: 'VIC',
        postCode: '',
        price: '',
        services: [],
        contractType: '',
        additionalNotes: '',
    });

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceToggle = (serviceType) => {
        setFormData(prev => {
            const existingIndex = prev.services.findIndex(s => s.Servicetype === serviceType);
            let updatedServices = [];

            if (existingIndex > -1) {
                // Remove service if unchecked
                updatedServices = prev.services.filter(s => s.Servicetype !== serviceType);
            } else {
                // Add service with default value
                updatedServices = [...prev.services, { Servicetype: serviceType, value: 0 }];
            }

            return { ...prev, services: updatedServices };
        });
    };

    const handleServiceValueChange = (serviceType, newValue) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.map(s =>
                serviceType.includes(s.Servicetype) ? { ...s, value: newValue } : s
            )
        }));
    };

    const handleUpdate = async (e) => {
        setLoading(true)
        const toastId = toast.loading("Updating....")
        e.preventDefault();
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/create-agreement`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            navigate(`/agreement/${data.agreement._id}`);
            onClose();
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message)
            } else {
                toast.error("Failed To Update Client")
            }
        }
        toast.dismiss(toastId)
        setLoading(false)
    };

    useEffect(() => {
        if (agreement) {
            setFormData({
                fullName: agreement.client.fullName,
                businessName: agreement.client.businessName,
                abn: agreement.client.abn,
                phone: agreement.client.phone,
                email: agreement.client.email,
                webUrl: agreement.client.webUrl,
                address: agreement.client.address,
                state: agreement.client.state,
                postCode: agreement.client.postCode,
                price: agreement.client.price,
                services: agreement.client.services,
                contractType: agreement.client.contractType,
                additionalNotes: agreement.client.additionalNotes,
            });
        }
    }, [agreement]);


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Dialog open={loading}></Dialog>
            <DialogTitle>Update Agreement</DialogTitle>
            <DialogContent dividers>
                <ClientInputDetails formData={formData} handleSubmit={handleUpdate} handleServiceValueChange={handleServiceValueChange} handleServiceToggle={handleServiceToggle} handleChange={handleChange} />
            </DialogContent>
            <DialogActions sx={{ my: 1, px: 4, display: "flex", gap: 4 }}>
                <SecondaryButton text={"Cancel"} handleChange={onClose} />
                <ButtonComponent disabled={loading} action={handleUpdate} text={"Update Agreement"} />
            </DialogActions>
        </Dialog>
    );
};

export default UpdateAgreement;
