const https = require('https');
const fs = require('fs');

function downloadImage(url) {
    //get image from github
    return new Promise((resolve, reject) => {
        const headers = {
            'Authorization': `token ${process.env.PAT}`,
            'User-Agent': 'MyApp'
        };

        https.get(url, { headers }, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download image: ${response.statusCode}\n${url}`));
                return;
            }

            const chunks = [];
            response.on('data', chunk => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
        })
            .on('error', reject);
    });
}

module.exports = downloadImage;