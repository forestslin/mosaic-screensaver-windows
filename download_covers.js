const fs = require('fs');
const https = require('https');
const path = require('path');

const urls = JSON.parse(fs.readFileSync('douban_urls.json', 'utf8'));
const coversDir = path.join(__dirname, 'covers');

if (!fs.existsSync(coversDir)){
    fs.mkdirSync(coversDir);
}

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        };
        https.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
                return;
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
            file.on('error', (err) => {
                fs.unlink(filepath, () => reject(err));
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function downloadAll() {
    console.log(`Starting download of ${urls.length} images...`);
    for (let i = 0; i < urls.length; i++) {
        const filepath = path.join(coversDir, `${i}.jpg`);
        try {
            await downloadImage(urls[i], filepath);
            if (i % 10 === 0) console.log(`Downloaded ${i}`);
        } catch(e) {
            console.error(`Error downloading ${i}: ${e.message}`);
        }
        await new Promise(r => setTimeout(r, 200)); // sleep 200ms
    }
    console.log('Finished downloading all images!');
}

downloadAll();
