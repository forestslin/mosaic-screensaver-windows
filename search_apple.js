const https = require('https');
const fs = require('fs');

async function searchAppleBooks(term) {
    return new Promise((resolve, reject) => {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=ebook&country=tw&limit=200`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.results);
                } catch(e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function run() {
    const terms = ['小说', '文学', '历史', '科幻', '悬疑', '刘慈欣', '金庸', '余华', '东野圭吾'];
    let allBooks = [];
    
    for (const term of terms) {
        console.log(`Searching for ${term}...`);
        try {
            const results = await searchAppleBooks(term);
            allBooks = allBooks.concat(results);
        } catch(e) {
            console.error(`Failed on ${term}: ${e.message}`);
        }
    }
    
    // Filter and map
    const uniqueUrls = new Set();
    const finalUrls = [];
    
    for (const book of allBooks) {
        // filter out spam public domain or cheap stuff
        if (!book.artworkUrl100) continue;
        if (book.price === 0) continue; // often public domain spam
        
        let url = book.artworkUrl100.replace('100x100bb', '400x600bb');
        if (!uniqueUrls.has(url)) {
            uniqueUrls.add(url);
            finalUrls.push(url);
        }
    }
    
    console.log(`Found ${finalUrls.length} unique book covers.`);
    fs.writeFileSync('apple_books_urls.json', JSON.stringify(finalUrls.slice(0, 250), null, 4));
}

run().catch(console.error);
