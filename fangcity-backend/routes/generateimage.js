const express = require('express');
const router = express.Router();
const generate_image = require('../lib/generate_image/generate_image');

router.use(express.json());

router.post('/token', async (req, res) => {
    const integerInput = parseInt(req.body.integerInput, 10);

    // Validate the integer input
    if (typeof integerInput !== 'number' || typeof integerInput === "undefined" || Number.isNaN(integerInput)) {
        return res.status(400).json({ error: 'Invalid integer input' });
    }

    console.log(`Fetching image for ${integerInput}`);

    try {
        let output;
        // Check if objectList exists
        if (req.body.objectList) {
            // If objectList format is invalid, return an error
            if (!Array.isArray(req.body.objectList)) {
                return res.status(400).json({ error: 'Invalid objectList input' });
            }

            output = await generate_image(integerInput, req.body.objectList);
        } else {
            // Call function without objectList if objectList not inputted
            output = await generate_image(integerInput);
        }

        // Return the output as a response
        res.json(output);
    } catch (error) {
        // Handle any errors that occurred in the async function
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;