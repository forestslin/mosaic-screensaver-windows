const https = require('https');

async function test() {
    return new Promise((resolve, reject) => {
        const url = 'https://itunes.apple.com/search?term=%E5%8A%89%E6%85%88%E6%AC%A3&entity=ebook&country=tw&limit=2';
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(data);
                resolve();
            });
        }).on('error', reject);
    });
}
test().catch(console.error);
