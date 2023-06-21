const sharp = require("sharp");
const axios = require("axios");
const path = require("path");

const check_trait = require('./check_trait');
const downloadImage = require('./downloadImage');
const parseTrait = require('./parseTrait');

const S3 = require("aws-sdk/clients/s3");

const fs = require("fs");

const bucketName = process.env.AWS_BUCKET_NAME;

const region = process.env.AWS_BUCKET_REGION;

const accessKeyId = process.env.AWS_ACCESS_KEY;

const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

async function generate_image(metaData) {
    console.log("generation begin");

    const name = metaData["name"].replace("PxlFangster ", '');
    console.log(name);

    //parsing Image URL for each layer
    const layers = parseTrait(metaData, []);

    try {
        // Fetch images from list of URLs
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

        const imageParams = {
            Bucket: bucketName,
            Body: compositeImage,
            Key: `pixelfangs/${name}.png`,
            ContentType: 'image/png',
            //ACL: "public-read",
        };

        const params = {
            Bucket: bucketName,
            Key: `pixelfangs/${name}`,
            Body: JSON.stringify(metaData),
            ContentType: "application/json; charset=utf-8",
            //ACL: "public-read",
        };

        console.log("upload");
        try {
            await s3.upload(imageParams).promise();
            console.log("image uploaded");
            await s3.upload(params).promise();
            console.log("metadata uploaded");
            return true;
        } catch {
            console.log("error uploading");
            return false;
        }


    } catch (error) {
        console.log(`An error occurred during processing: ${error}`);
    }

}


module.exports = generate_image;