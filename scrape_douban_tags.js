const https = require('https');
const fs = require('fs');

async function fetchDoubanTag(tag, start) {
  return new Promise((resolve, reject) => {
    const encodedTag = encodeURIComponent(tag);
    const options = {
      hostname: 'book.douban.com',
      path: `/tag/${encodedTag}?start=${start}&type=T`,
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
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.end();
  });
}

async function scrape1000() {
  const tags = ['小说', '历史', '文学', '科幻', '悬疑', '名著', '散文', '哲学'];
  const allUrls = new Set();

  for (const tag of tags) {
    console.log(`Scraping tag: ${tag}...`);
    for (let i = 0; i < 7; i++) { // 7 pages * 20 = 140 per tag * 8 tags = 1120
      if (allUrls.size >= 1000) break;
      const start = i * 20;
      try {
        const html = await fetchDoubanTag(tag, start);
        const regex = /<img[^>]+src="([^"]+doubanio\.com\/view\/subject\/[^"]+\.jpg)"/g;
        let match;
        while ((match = regex.exec(html)) !== null) {
          let url = match[1];
          url = url.replace('/s/public/', '/l/public/').replace('/m/public/', '/l/public/');
          allUrls.add(url);
        }
        console.log(`Tag ${tag} page ${i + 1}: Total unique so far: ${allUrls.size}`);
      } catch (err) {
        console.error(err);
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    if (allUrls.size >= 1000) break;
  }
  
  const urlsArray = Array.from(allUrls).slice(0, 1000);
  fs.writeFileSync('douban_urls_1000.json', JSON.stringify(urlsArray, null, 2));
  console.log(`Saved ${urlsArray.length} urls to douban_urls_1000.json`);
}

scrape1000();
