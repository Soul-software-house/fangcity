const express = require('express');
const Transaction = require("../model/transaction");
const router = express.Router();
const mongoose = require("mongoose");

router.use(express.json());

router.post('/transaction', async (req, res) => {

    try {
        // Save to db 
        const transactionData =  req.body;
        console.log('body', transactionData);

        // Create a new Transaction instance and save it
        const transaction = new Transaction(transactionData);
        await transaction.save();

        // Return the output as a response
        res.status(200).json({ message: 'Transaction successful' });
    } catch (error) {
        // Handle any errors that occurred in the async function    
        console.log('error', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;