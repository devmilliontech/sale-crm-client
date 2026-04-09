import React, { useState } from 'react';
import {
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
import { services } from '../../constants/dummyData';



const ClientInputDetails = ({ formData, handleSubmit, handleServiceValueChange, handleServiceToggle, handleChange }) => {
    const [toggleContract, setToggleContract] = useState(false)

    // Utility function to format ABN
    const formatABN = (value) => {
        const digits = value.replace(/\D/g, ""); // remove non-digits
        return digits
            .replace(/^(\d{2})(\d{0,3})(\d{0,3})(\d{0,3})$/, (_, g1, g2, g3, g4) =>
                [g1, g2, g3, g4].filter(Boolean).join(" ")
            )
            .trim();
    };

    // Utility function to format Phone Number
    const formatPhone = (value) => {
        const digits = value.replace(/\D/g, ""); // remove non-digits
        return digits
            .replace(/^(\d{4})(\d{0,3})(\d{0,3})$/, (_, g1, g2, g3) =>
                [g1, g2, g3].filter(Boolean).join(" ")
            )
            .trim();
    };

    // Format date to YYYY-MM-DD for input[type=date]
    const formatToInputDate = (value) => {
        if (!value) return '';
        const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
        if (!(d instanceof Date) || isNaN(d)) return '';
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Box my={2} px={6} py={4} bgcolor={"#f7f9ff"} borderRadius={2}>
                <Typography variant='h5' mb={2}>Personal Information</Typography>
                <Grid container spacing={4}>
                    {/* Full Name & Business Name */}
                    <Grid size={6}>
                        <TextField sx={{ bgcolor: "white" }} fullWidth required label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <TextField required sx={{ bgcolor: "white" }} fullWidth label="Business Name" name="businessName" value={formData.businessName} onChange={handleChange} />
                    </Grid>

                    {/* ABN & Phone Number */}
                    <Grid size={6}>
                        <TextField onChange={(e) => {
                            const formatted = formatABN(e.target.value);
                            handleChange({
                                target: { name: "abn", value: formatted },
                            });
                        }} inputProps={{ maxLength: 14 }} sx={{ bgcolor: "white" }} fullWidth label="ABN" name="abn" value={formData.abn} />
                    </Grid>
                    <Grid size={6}>
                        <TextField onChange={(e) => {
                            const formatted = formatPhone(e.target.value);
                            handleChange({
                                target: { name: "phone", value: formatted },
                            });
                        }} inputProps={{maxLength:12}} required sx={{ bgcolor: "white" }} fullWidth label="Phone Number" name="phone" value={formData.phone} />
                    </Grid>

                    {/* Email & Website */}
                    <Grid size={6}>
                        <TextField required sx={{ bgcolor: "white" }} fullWidth label="Email ID" name="email" value={formData.email} onChange={handleChange} />
                    </Grid>
                    <Grid size={6}>
                        <TextField value={formData.webUrl} type='text' label="Website URL" sx={{ bgcolor: "white" }} fullWidth name="webUrl" onChange={handleChange} />
                    </Grid>

                    {/* Address */}
                    <Grid size={6}>
                        <TextField sx={{ bgcolor: "white" }} fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
                    </Grid>

                    {/* State and Post Code */}
                    <Grid size={6}>
                        <FormControl fullWidth required>
                            <InputLabel>State</InputLabel>
                            <Select label="State" sx={{ bgcolor: "white" }} name='state' value={formData.state} onChange={handleChange}>
                                <MenuItem value="VIC">VIC</MenuItem>
                                <MenuItem value="NSW">NSW</MenuItem>
                                <MenuItem value="QLD">QLD</MenuItem>
                                <MenuItem value="WA">WA</MenuItem>
                                <MenuItem value="SA">SA</MenuItem>
                                <MenuItem value="TAS">TAS</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={6}>
                        <TextField sx={{ bgcolor: "white" }} inputProps={{ maxLength: 4 }} fullWidth label="Post Code" name="postCode" value={formData.postCode} onChange={handleChange} />
                    </Grid>

                    {/* Quoted Price */}
                    <Grid size={6}>
                        <TextField sx={{ bgcolor: "white" }} fullWidth required label="Quoted Price ($)" name="price" type="text" value={formData.price} onChange={handleChange} />
                    </Grid>
                    <Grid />
                </Grid>
            </Box>

            <Box px={6} py={4} bgcolor={"#f7f9ff"} borderRadius={2} my={4}>
                <Grid container spacing={2}>
                    {/* Services */}
                    <Grid size={12} >
                        <Typography variant="h5" mb={2}>Services Interested In *</Typography>
                        <FormGroup row sx={{ display: "flex", gap: 1 }}>
                            {services.map(service => (
                                <FormControlLabel
                                    sx={{
                                        bgcolor: "white",
                                        border: 1,
                                        borderRadius: 2,
                                        borderColor: "#ededed",
                                        pl: 1,
                                        ml: 0,
                                        pr: 3
                                    }}
                                    key={service}
                                    control={
                                        <Checkbox
                                            checked={formData.services.some(s => s.Servicetype === service)}
                                            onChange={() => handleServiceToggle(service)}
                                        />
                                    }
                                    label={service}
                                />
                            ))}
                        </FormGroup>

                        <Box mt={4} display={"flex"} gap={4} flexWrap={"wrap"}>
                            {/* Number of Pages */}
                            {["WordPress Website", "SquareSpace Website", "Custom Website"]
                                .some(serviceType => formData.services.some(s => s.Servicetype === serviceType)) && (
                                    <TextField
                                        size="small"
                                        type="text"
                                        label="Number of Pages"
                                        value={
                                            formData.services.find(s =>
                                                ["WordPress Website", "SquareSpace Website", "Custom Website"]
                                                    .includes(s.Servicetype)
                                            )?.value || ""
                                        }
                                        onChange={(e) => {
                                            const serviceTypes = ["WordPress Website", "SquareSpace Website", "Custom Website"]
                                                .filter(s => formData.services.some(service => service.Servicetype === s));
                                            handleServiceValueChange(serviceTypes, e.target.value);
                                        }}
                                        sx={{ bgcolor: "white" }}
                                    />
                                )}

                            {["Shopify Website", "WooCommerce Website"]
                                .some(serviceType => formData.services.some(s => s.Servicetype === serviceType)) && (
                                    <TextField
                                        size="small"
                                        type="text"
                                        label="Number of Products"
                                        value={
                                            formData.services.find(s =>
                                                ["Shopify Website", "WooCommerce Website"]
                                                    .includes(s.Servicetype)
                                            )?.value || ""
                                        }
                                        onChange={(e) => {
                                            const serviceType = ["Shopify Website", "WooCommerce Website"]
                                                .filter(s => formData.services.some(service => service.Servicetype === s));
                                            handleServiceValueChange(serviceType, e.target.value);
                                        }}
                                        sx={{ bgcolor: "white" }}
                                    />
                                )}

                            {formData.services.some(s => s.Servicetype === "SEO") && (
                                <TextField
                                    size="small"
                                    type="text"
                                    label="Number of Keywords"
                                    value={formData.services.find(s => s.Servicetype === "SEO")?.value || ""}
                                    onChange={(e) => handleServiceValueChange("SEO", e.target.value)}
                                    sx={{ bgcolor: "white" }}
                                />
                            )}

                            {formData.services.some(s => s.Servicetype === "Social Media Optimization") && (
                                <TextField
                                    size="small"
                                    type="text"
                                    label="Number of Posts"
                                    value={formData.services.find(s => s.Servicetype === "Social Media Optimization")?.value || ""}
                                    onChange={(e) => handleServiceValueChange("Social Media Optimization", e.target.value)}
                                    sx={{ bgcolor: "white" }}
                                />
                            )}
                            {[]}

                            {formData.services.some(s => s.Servicetype === "Web App Development") && (
                                <TextField
                                    size="small"
                                    type="text"
                                    label="Number of websites"
                                    value={formData.services.find(s => s.Servicetype === "Web App Development")?.value || ""}
                                    onChange={(e) => handleServiceValueChange("Web App Development", e.target.value)}
                                    sx={{ bgcolor: "white" }}
                                />
                            )}

                            {formData.services.some(s => s.Servicetype === "Mobile App Development") && (
                                <TextField
                                    size="small"
                                    type="text"
                                    label="Number of apps"
                                    value={formData.services.find(s => s.Servicetype === "Mobile App Development")?.value || ""}
                                    onChange={(e) => handleServiceValueChange("Mobile App Development", e.target.value)}
                                    sx={{ bgcolor: "white" }}
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box px={6} py={4} bgcolor={"#f7f9ff"} borderRadius={2} my={4}>
                <Typography variant="h5">Contract Type *</Typography>
                <Grid container spacing={4}>
                    <Grid size={12} mt={2} display={"flex"} justifyContent={"space-between"}>
                        <FormControl sx={{ width: "50%" }}>
                            {
                                toggleContract ? (
                                    <TextField label="Enter Month for Contract" sx={{ bgcolor: "white" }} />
                                ) : <>
                                    <InputLabel>Select</InputLabel>
                                    <Select
                                        name='contractType'
                                        value={formData.contractType}
                                        label="Age"
                                        onChange={handleChange}
                                        sx={{ bgcolor: "white" }}
                                    >
                                        {
                                            ["No Contract", "One Time", "3 Month", "6 Month", "9 Month", "12 Month", "18 Month"].map((month, idx) => <MenuItem value={month}>{month}</MenuItem>)
                                        }
                                    </Select>
                                </>
                            }

                        </FormControl>

                        <FormGroup>
                            <FormControlLabel control={<Checkbox checked={toggleContract} onChange={() => setToggleContract(!toggleContract)} />} label="Custom Contract" />
                        </FormGroup>

                    </Grid>

                    <Grid size={12}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label="Additional Notes"
                            name="additionalNotes"
                            sx={{
                                bgcolor: "white",
                            }}
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            value={formatToInputDate(formData.createdAt) || formatToInputDate(new Date())}
                            name='createdAt'
                            onChange={handleChange}
                            sx={{ bgcolor: "white" }}
                            type='date'
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default ClientInputDetails