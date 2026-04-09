import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ClientInputDetails from '../components/common/ClientInputDetails'
import ButtonComponent, { DeleteButton, SecondaryButton } from '../components/common/ButtonComponet'
import { useNavigate } from 'react-router-dom'

const UpdateClientModal = ({ client, open, handleClose }) => {

    const [loading, setLoading] = useState(false)
    const { token,role } = JSON.parse(localStorage.getItem("auth"))
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        const toastId = toast.loading("Updating...")
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/sales/update-basicDetails/${client._id}`, formData)

            toast.success("Client Updated Successfully")
            handleClose()
        } catch (error) {
            console.log(error)
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Update Clients")
            }
        }
        setLoading(false)
        toast.dismiss(toastId)
    }

    const handleDelete = async() => {
        const toastId = toast.loading("Deleting...")
        try {
            const {data} = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/admin/delete-client/${client._id}`)
            toast.success("Client Deleted Successfully");
            handleClose()
        } catch (error) {
            if(error?.response?.data?.message){
                toast.error(error?.response?.data?.message)
            }else{
                toast.error("Failed To Delete Client")
            }
        }
        toast.dismiss(toastId)
    }

    useEffect(() => {
        setFormData({
            fullName: client?.fullName || '',
            businessName: client?.businessName || '',
            abn: client?.abn || '',
            phone: client?.phone || '',
            email: client?.email || '',
            webUrl: client?.webUrl || '',
            address: client?.address || '',
            state: client?.state || 'VIC',
            postCode: client?.postCode || '',
            price: client?.price || '',
            services: client?.services || [],
            paymentTerm: client?.paymentTerm || '',
            contractType: client?.contractType || '',
            notes: client?.notes || ''
        })
    }, [client]);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>Update Client</DialogTitle>
            <DialogContent dividers>
                <ClientInputDetails formData={formData} handleSubmit={handleSubmit} handleChange={handleChange} handleServiceToggle={handleServiceToggle} handleServiceValueChange={handleServiceValueChange} />
            </DialogContent>
            <DialogActions sx={{ my: 1, px: 4, display: "flex", gap: 4 }}>
                <SecondaryButton text={"Cancel"} handleChange={handleClose} />
                <ButtonComponent action={handleSubmit} text={loading ? "Updating" : "Update"} />
                {role == "admin" && <DeleteButton text={"Delete"} handleChange={handleDelete}/>}
            </DialogActions>
        </Dialog>
    )
}

export default UpdateClientModal