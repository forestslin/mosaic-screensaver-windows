const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const urls = JSON.parse(fs.readFileSync('douban_urls.json', 'utf8'));
const coversDir = path.join(__dirname, 'covers');

if (!fs.existsSync(coversDir)){
    fs.mkdirSync(coversDir);
}

async function downloadAll() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({
        'Referer': 'https://book.douban.com/',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
    });

    console.log(`Starting download of ${urls.length} images...`);
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const filepath = path.join(coversDir, `${i}.jpg`);
        try {
            const viewSource = await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });
            if (viewSource.status() === 200) {
                const buffer = await viewSource.buffer();
                fs.writeFileSync(filepath, buffer);
                if (i % 10 === 0) console.log(`Downloaded ${i}`);
            } else {
                console.error(`Error downloading ${i}: Status ${viewSource.status()}`);
            }
        } catch(e) {
            console.error(`Error downloading ${i}: ${e.message}`);
        }
        await new Promise(r => setTimeout(r, 500)); // sleep 500ms
    }
    
    console.log('Finished downloading all images!');
    await browser.close();
}

downloadAll().catch(console.error);
