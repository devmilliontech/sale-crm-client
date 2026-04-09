import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

import ButtonComponent, { SecondaryButton } from '../components/common/ButtonComponet';
import ClientInputDetails from '../components/common/ClientInputDetails';
import { useNavigate } from 'react-router-dom';

const AddClientModal = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false)
    const { token } = JSON.parse(localStorage.getItem("auth"))

    const navigate = useNavigate()
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
        createdAt: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceToggle = (serviceType) => {
        setFormData(prev => {
            const existingIndex = prev.services.findIndex(s => s.Servicetype === serviceType);
            let updatedServices = [];

            if (existingIndex > -1) {

                updatedServices = prev.services.filter(s => s.Servicetype !== serviceType);
            } else {

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

    const handleSubmit = async (e) => {

        setLoading(true)
        const toastId = toast.loading("Creating....")
        e.preventDefault();
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/sales/create-client`, formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            toast.success("Client Added Successfully")
            onClose();
            setFormData({
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
                createdAt: ''
            })
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Fetch Clients")
            }
        }
        toast.dismiss(toastId)
        setLoading(false)
    };


    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Dialog open={loading}></Dialog>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogContent dividers>
                
                <ClientInputDetails formData={formData} handleSubmit={handleSubmit} handleServiceValueChange={handleServiceValueChange} handleServiceToggle={handleServiceToggle} handleChange={handleChange} />

            </DialogContent>
            <DialogActions sx={{ my: 1, px: 4, display: "flex", gap: 4 }}>
                <SecondaryButton text={"Cancel"} handleChange={onClose} />
                <ButtonComponent disabled={loading} action={handleSubmit} text={"Add Prospect"} />
            </DialogActions>
        </Dialog>
    );
};

export default AddClientModal;
