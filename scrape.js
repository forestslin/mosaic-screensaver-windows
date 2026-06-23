const https = require('https');

const options = {
  hostname: 'www.books.com.tw',
  path: '/web/sys_saletopb/books',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const regex = /https:\/\/im[12]\.book\.com\.tw\/image\/getImage\?i=([^&"']+)&v=([^&"']+)/g;
    const urls = new Set();
    let match;
    while ((match = regex.exec(data)) !== null) {
      if (match[0].includes('image/getImage')) {
        urls.add(match[0].replace(/&amp;/g, '&') + '&w=400&h=600');
      }
    }
    console.log(JSON.stringify(Array.from(urls).slice(0, 100), null, 2));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
