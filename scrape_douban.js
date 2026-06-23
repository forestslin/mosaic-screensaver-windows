const https = require('https');
const fs = require('fs');

async function fetchDoubanPage(start) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'book.douban.com',
      path: `/top250?start=${start}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function scrapeAll() {
  const allUrls = [];
  for (let i = 0; i < 10; i++) {
    console.log(`Fetching page ${i+1}...`);
    try {
      const html = await fetchDoubanPage(i * 25);
      // Douban book covers look like: <img src="https://img3.doubanio.com/view/subject/s/public/s29656182.jpg" width="90" />
      // Wait, top250 covers are small in HTML (e.g., /s/public). We want larger covers!
      // Large covers can be fetched by replacing /s/ or /m/ with /l/ in the URL:
      // https://img3.doubanio.com/view/subject/l/public/s29656182.jpg
      
      const regex = /<img src="([^"]+doubanio\.com\/view\/subject\/[^"\/]+\/public\/s\d+\.jpg)"/g;
      let match;
      while ((match = regex.exec(html)) !== null) {
        let url = match[1];
        url = url.replace('/s/public/', '/l/public/').replace('/m/public/', '/l/public/');
        allUrls.push(url);
      }
    } catch (err) {
      console.error(err);
    }
    // sleep to avoid ban
    await new Promise(r => setTimeout(r, 1000));
  }
  fs.writeFileSync('douban_urls.json', JSON.stringify(allUrls, null, 2));
  console.log(`Saved ${allUrls.length} urls.`);
}

scrapeAll();
