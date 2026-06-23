const fs = require('fs');

async function scrapeBooks() {
    const url = 'https://www.books.com.tw/web/sys_saletopb/books/';
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    
    const regex = /https:\/\/im[12]\.book\.com\.tw\/image\/getImage\?i=([^&"']+)&v=([^&"']+)/g;
    const urls = new Set();
    let match;
    while ((match = regex.exec(html)) !== null) {
        if (match[0].includes('image/getImage')) {
            urls.add(match[0].replace(/&amp;/g, '&') + '&w=400&h=600');
        }
    }
    
    const finalUrls = Array.from(urls).slice(0, 100);
    fs.writeFileSync('urls_books_tw.json', JSON.stringify(finalUrls, null, 2));
    console.log(`Saved ${finalUrls.length} urls`);
}

scrapeBooks().catch(console.error);
