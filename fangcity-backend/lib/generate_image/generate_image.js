const sharp = require("sharp");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const check_trait = require('./check_trait');
const downloadImage = require('./downloadImage');
const parseTrait = require('./parseTrait');

require("dotenv").config();

async function generate_image(token, trait_list = []) {
    let result = await axios.get(process.env.META_URL + token);
    let metaData = result.data;

    //parsing Image URL for each layer
    const layers = parseTrait(metaData, trait_list);

    try {
        //fetch image from list of URL
        const images = await Promise.all(layers.map(url => downloadImage(url)));

        // Wait for all promises to resolve and then composite the images using Sharp

        const bufferArray = await Promise.all(images);
        const compositeImage = await sharp({
            create: {
                width: 480,
                height: 480,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            }
        })
            .composite(bufferArray.map(buffer => ({ input: buffer })))
            .png()
            .toBuffer();

        // Convert the image buffer to base64
        const base64Image = compositeImage.toString('base64');
        // Return the base64-encoded image data
        return { base64Image, metaData };

    } catch (error) {
        console.log(`An error occurred during processing: ${error}`);
    }
}


module.exports = generate_image;