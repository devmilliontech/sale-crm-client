import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Typography,
    Grid,
    InputAdornment,
} from "@mui/material";
import { CreditCard, CalendarMonth, Lock } from "@mui/icons-material";


export default function CardPaymentForm({ cardDetails, onCardDetailsChange, error, setError }) {

    const handleCardNumberChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); 
        value = value.match(/.{1,4}/g)?.join(" ") || ""; 
        onCardDetailsChange({ target: { name: "cardNumber", value } });
    };

    const handleExpiryChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Remove non-digit chars
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2, 4); // Add "/" after 2 digits
        }
        onCardDetailsChange({ target: { name: "expiryDate", value } });
    };

    function validateCard(cardNumber) {
        // Remove spaces/hyphens
        const sanitized = cardNumber.replace(/[\s-]/g, "");

        // Card type detection
        let type = "";
        if (/^4\d{12}(\d{3})?$/.test(sanitized)) type = "Visa";
        else if (/^5[1-5]\d{14}$/.test(sanitized) || /^2[2-7]\d{14}$/.test(sanitized)) type = "MasterCard"; // includes new 2-series
        else if (/^3[47]\d{13}$/.test(sanitized)) type = "American Express";
        else if (/^3(?:0[0-5]|[68]\d)\d{11}$/.test(sanitized)) type = "Diners Club";
        else if (/^35\d{14}$/.test(sanitized)) type = "JCB";
        else if (/^62\d{14,17}$/.test(sanitized)) type = "UnionPay";

        // Luhn check
        let sum = 0;
        let shouldDouble = false;
        for (let i = sanitized.length - 1; i >= 0; i--) {
            let digit = parseInt(sanitized[i], 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }

        const isValid = sum % 10 === 0;

        setError(() => isValid ? false : true)

    }

    useEffect(() => {
        if (cardDetails.cardNumber.length == 19) {
            validateCard(cardDetails.cardNumber)
        } else {
            setError(false)
        }
    }, [cardDetails.cardNumber])

    return (
        <Box>
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
                Payment Details
            </Typography>

            <form>
                {/* Cardholder Name */}
                <TextField
                    name="cardHolderName"
                    value={cardDetails.cardHolderName}
                    onChange={onCardDetailsChange}
                    fullWidth
                    label="Cardholder Name"
                    placeholder="John Doe"
                    margin="normal"
                />

                {/* Card Number */}
                {error && <Typography color="error" fontSize={"small"}>Invalid Card Number</Typography>}
                <TextField
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleCardNumberChange}
                    fullWidth
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    margin="normal"
                    InputProps={{

                        startAdornment: (
                            <>
                                <InputAdornment position="start">
                                    <CreditCard />
                                </InputAdornment>

                            </>

                        ),
                    }}
                    inputProps={{ maxLength: 19 }}
                />

                <TextField
                    name="expiryDate"
                    value={cardDetails.expiryDate}
                    onChange={handleExpiryChange}
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                    margin="normal"
                    maxLength={5}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <CalendarMonth />
                            </InputAdornment>
                        ),
                    }}
                />
                <TextField
                    inputProps={{ maxLength: 3 }}
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={onCardDetailsChange}
                    fullWidth
                    label="CVV"
                    placeholder="123"
                    margin="normal"
                    type="password"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock />
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
        </Box>
    );
}
