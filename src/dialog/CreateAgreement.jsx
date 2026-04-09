import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
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
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ButtonComponent, { SecondaryButton } from '../components/common/ButtonComponet';
import { formatABN, formatPhone } from '../../utils/utility';


const CreateAgreement = ({ open, onClose }) => {
    const { loginData } = useSelector(state => state.auth)

    const [customservice, setCustomService] = useState("")
    const [setUpCost, setSetupCost] = useState("")
    const [includeAds, setIncludeAds] = useState(false)
    const [checkedSetupCost, setCheckedSetupCost] = useState(false)
    const [priceTage, setPriceTag] = useState("")
    const [toggleContract, setToggleContract] = useState(false);
    const [loading, setLoading] = useState(false);
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
        paymentTerm: '',
        contractType: '',
        notes: '',
        cardRequired: false,
    });

    const { token } = useSelector((state) => state.auth.loginData);
    const navigate = useNavigate();

    const handleContractChange = (e) => setFormData((prev) => ({ ...prev, contractType: e.target.value }));
    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "abn") {
            value = formatABN(value);
        }

        if (name === "phone") {
            value = formatPhone(value);
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleServiceToggle = (serviceType) => {
        setFormData((prev) => {
            const exists = prev.services.some((s) => s.Servicetype === serviceType);
            const updatedServices = exists
                ? prev.services.filter((s) => s.Servicetype !== serviceType)
                : [...prev.services, { Servicetype: serviceType, value: 0 }];
            return { ...prev, services: updatedServices };
        });
    };

    const handleServiceValueChange = (serviceTypes, value) => {
        setFormData((prev) => ({
            ...prev,
            services: prev.services.map((s) =>
                serviceTypes.includes(s.Servicetype) ? { ...s, value } : s
            ),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading('Creating...');
        const services = customservice ? [...formData.services, { Servicetype: customservice, value: 0 }] : [...formData.services]
        const payload = {
            ...formData,
            createdBy: loginData?.email,
            services: services,
            setUpCost: setUpCost,
            setUpCostTag: checkedSetupCost ? "One Time" : "",
            totalAmount: formData.price,
            totalAmountTag: priceTage,
            adsIncluded: includeAds
        }

        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/admin/create-agreement`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate(`/send-agreement/${data.agreement._id}`);
            onClose();
            setFormData({
                fullName: '',
                businessName: '',
                abn: '',
                phone: '',
                email: '',
                webUrl: '',
                address: '',
                state: '',
                postCode: '',
                price: '',
                setUpCost: "",
                services: [],
                paymentTerm: '',
                contractType: '',
                notes: '',
            })
        } catch (error) {
            console.error(error);
            if (error?.response?.data?.message) {
                if (error?.response?.data?.message == "jwt expired") {
                    navigate("/login")
                }
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed To Create Agreement")
            }
        }
        toast.dismiss(toastId);
        setLoading(false);
    };

    useEffect(() => {
        if (!formData.businessName) return;
        const timer = setTimeout(async () => {
            const toastId = toast.loading('Fetching...');
            try {
                const [firstName] = formData.businessName.split(' ');
                const { data } = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/admin/get-clientByName/${formData.businessName}`
                );
                const client = data.client || {};
                setFormData((prev) => ({ ...prev, ...client }));
            } catch (error) {
                console.error(error);
            }
            toast.dismiss(toastId);
        }, 2000);
        return () => clearTimeout(timer);
    }, [formData.businessName]);

    const serviceValueFields = [
        { types: ['WordPress Website', 'SquareSpace Website', 'Custom Website'], label: 'Number of Pages' },
        { types: ['Shopify Website', 'WooCommerce Website'], label: 'Number of Products' },
        { types: ['SEO'], label: 'Number of Keywords' },
        { types: ['Social Media Optimization'], label: 'Number of Posts' },
        { types: ['Web App Development'], label: 'Number of Websites' },
        { types: ['Mobile App Development'], label: 'Number of Apps' },
    ];
    console.log(formData)
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Create New Agreement</DialogTitle>
            <DialogContent dividers>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    {/* Personal Information */}
                    <Box my={2} px={6} py={4} bgcolor="#f7f9ff" borderRadius={2}>
                        <Typography variant="h5" mb={2}>
                            Personal Information
                        </Typography>
                        <Grid container spacing={4}>
                            {[
                                { label: 'Full Name', name: 'fullName', required: true },
                                { label: 'Business Name', name: 'businessName', required: true },
                                { label: 'ABN', name: 'abn', maxLength: 14 },
                                { label: 'Phone Number', name: 'phone', required: true, maxLength: 12 },
                                { label: 'Email ID', name: 'email', required: true },
                                { label: 'Website URL', name: 'webUrl' },
                                { label: 'Address', name: 'address', required: true },

                            ].map((field, idx) => (
                                <Grid key={idx} size={6}>
                                    <TextField
                                        fullWidth
                                        required={field.required}
                                        inputProps={{ maxLength: field.maxLength }}
                                        sx={{ bgcolor: 'white' }}
                                        label={field.label}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                    />
                                </Grid>
                            ))}

                            {/* State Selection */}
                            <Grid size={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>State</InputLabel>
                                    <Select
                                        label="State"
                                        sx={{ bgcolor: 'white' }}
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    >
                                        {['VIC', 'NSW', 'QLD', 'WA', 'SA', 'TAS'].map((st) => (
                                            <MenuItem key={st} value={st}>
                                                {st}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid container size={12} spacing={4}>
                                {[
                                    { label: 'Post Code', name: 'postCode', required: true, maxLength: 4 },
                                    { label: 'Quoted Price ($)', name: 'price', required: true },
                                ].map((field, idx) => (
                                    <Grid key={idx} size={6}>
                                        <TextField
                                            fullWidth
                                            required={field.required}
                                            inputProps={{ maxLength: field.maxLength }}
                                            sx={{ bgcolor: 'white' }}
                                            label={field.label}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Services */}
                    <Box px={6} py={4} bgcolor="#f7f9ff" borderRadius={2} my={4}>
                        <Typography variant="h5" mb={2}>
                            Services Interested In *
                        </Typography>
                        <FormGroup row sx={{ display: 'flex', gap: 1 }}>
                            {services.map((service) => (
                                <FormControlLabel
                                    key={service}
                                    control={
                                        <Checkbox
                                            checked={formData.services.some((s) => s.Servicetype === service)}
                                            onChange={() => handleServiceToggle(service)}
                                        />
                                    }
                                    label={service}
                                    sx={{
                                        bgcolor: 'white',
                                        border: 1,
                                        borderRadius: 2,
                                        borderColor: '#ededed',
                                        pl: 1,
                                        ml: 0,
                                        pr: 3,
                                    }}
                                />
                            ))}
                        </FormGroup>
                        <TextField value={customservice} onChange={(e) => setCustomService(e.target.value)} label="Custom Service" sx={{ mt: 4, bgcolor: "white" }} />

                        <Box mt={4} display="flex" gap={4} flexWrap="wrap">
                            {serviceValueFields.map(
                                ({ types, label }) =>
                                    types.some((t) => formData.services.some((s) => s.Servicetype === t)) && (
                                        <TextField
                                            key={label}
                                            size="small"
                                            type="text"
                                            label={label}
                                            value={
                                                formData.services.find((s) => types.includes(s.Servicetype))?.value || ''
                                            }
                                            onChange={(e) => {
                                                const selectedTypes = types.filter((t) =>
                                                    formData.services.some((s) => s.Servicetype === t)
                                                );
                                                handleServiceValueChange(selectedTypes, e.target.value);
                                            }}
                                            sx={{ bgcolor: 'white' }}
                                        />
                                    )
                            )}
                        </Box>
                    </Box>

                    {/* Plan */}
                    <Box px={6} py={4} bgcolor="#f7f9ff" borderRadius={2} my={4}>
                        <Typography variant="h5">Plan</Typography>
                        <Grid container spacing={4}>
                            <Grid size={12} mt={2}>
                                <FormGroup row sx={{ gap: 1, display: "flex" }}>
                                    {formData.services.map((s) => (
                                        <FormControlLabel
                                            key={s}
                                            control={
                                                <Checkbox
                                                    checked={true}
                                                    onChange={() => handleServiceToggle(s.Servicetype)}
                                                />
                                            }
                                            label={s.Servicetype}
                                            sx={{
                                                bgcolor: 'white',
                                                border: 1,
                                                borderRadius: 2,
                                                borderColor: '#ededed',
                                                pl: 1,
                                                ml: 0,
                                                pr: 3,
                                            }}
                                        />
                                    ))}
                                </FormGroup>
                            </Grid>
                            <Grid size={12}>
                                <Typography mb={2} variant="h5">Pricing</Typography>

                                <Box display={"flex"} gap={4}>
                                    <TextField value={formData.price} name='price' onChange={handleChange} size="medium" label="Total Amount" sx={{ bgcolor: "white" }} />
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={priceTage == "One Time"}
                                                    onChange={() => {
                                                        if (priceTage == "One Time") {
                                                            setPriceTag("")
                                                        } else {

                                                            setPriceTag("One Time")
                                                        }
                                                    }}
                                                />
                                            }
                                            label="One Time"
                                        />
                                    </FormGroup>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={priceTage == "Per Month"}
                                                    onChange={() => {
                                                        if (priceTage == "Per Month") {
                                                            setPriceTag("")

                                                        } else {
                                                            setPriceTag("Per Month")
                                                        }
                                                    }}
                                                />
                                            }
                                            label="Per Month"
                                        />
                                    </FormGroup>
                                </Box>

                                <Box mt={4} display={"flex"} gap={4}>
                                    <TextField value={setUpCost} onChange={(e) => setSetupCost(e.target.value)} size="medium" label="Setup Cost" sx={{ bgcolor: "white" }} />
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={checkedSetupCost}
                                                    onChange={() => setCheckedSetupCost(!checkedSetupCost)}
                                                />
                                            }
                                            label="One Time"
                                        />
                                    </FormGroup>
                                </Box>

                                <Box mt={4}>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={includeAds}
                                                    onChange={() => setIncludeAds(!includeAds)}
                                                />
                                            }
                                            label="Ads Amount is not included in this plan"
                                        />
                                    </FormGroup>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Contract Type */}
                    <Box px={6} py={4} bgcolor="#f7f9ff" borderRadius={2} my={4}>
                        <Typography variant="h5">Contract Type *</Typography>
                        <Grid container spacing={4}>
                            <Grid size={12} mt={2} display="flex" justifyContent="space-between">
                                <FormControl sx={{ width: '50%' }}>
                                    {toggleContract ? (
                                        <TextField label="Enter Month for Contract" sx={{ bgcolor: 'white' }} />
                                    ) : (
                                        <>
                                            <InputLabel>Select</InputLabel>
                                            <Select
                                                value={formData.contractType}
                                                onChange={handleContractChange}
                                                sx={{ bgcolor: 'white' }}
                                            >
                                                {['No Contract', 'One Time', '3 Month', '6 Month', '9 Month', '12 Month', '18 Month'].map(
                                                    (month) => (
                                                        <MenuItem key={month} value={month}>
                                                            {month}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </>
                                    )}
                                </FormControl>

                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={toggleContract}
                                                onChange={() => setToggleContract(!toggleContract)}
                                            />
                                        }
                                        label="Custom Contract"
                                    />
                                </FormGroup>
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Additional Notes"
                                    name="notes"
                                    sx={{ bgcolor: 'white' }}
                                    value={formData.notes}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                </Box>
            </DialogContent>

            <DialogActions sx={{ my: 1, px: 4, display: 'flex', gap: 4 }}>
                <SecondaryButton text="Cancel" handleChange={onClose} />
                <ButtonComponent text={loading ? 'Creating...' : 'Create Agreement'} action={handleSubmit} />
            </DialogActions>
        </Dialog>
    );
};

export default CreateAgreement;
