const express = require('express');
const router = express.Router();
const generate_png = require('../lib/generate_image/generate_png');

router.use(express.json());

router.post('/upload', async (req, res) => {
    console.log("Sending metadata to backend");

    if (typeof req.body.metaData === "undefined" || Object.keys(req.body.metaData).length === 0) {
        return res.status(400).json({ error: 'Invalid metadata' });
    }

    try {
        console.log(req.body.metaData);
        const result = await generate_png(req.body.metaData);
        if (result) { return res.json({ message: 'Image uploaded' }); }
        else { return res.status(404).send("Error uploading to S3"); }
    } catch (error) {
        // Handle any errors that occurred in the async function
        return res.status(500).json({ error: 'An error occurred' });

    }
});

module.exports = router;