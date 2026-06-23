const fs = require('fs');

const appJsPath = 'C:\\code\\cover\\MosaicScreensaver\\web\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf-8');

const urls = JSON.parse(fs.readFileSync('douban_urls.json', 'utf-8'));
const urlString = JSON.stringify(urls);

const newLogic = `
            // To ensure 100% high-quality Chinese book covers without API limitations or spam, 
            // we use a curated list of top 250 Chinese books from Douban.
            const curatedUrls = ${urlString};
            bookArtworks = [...bookArtworks, ...curatedUrls];
`;

const regex = /\/\/\s*Use iTunes API \(Taiwan\).*?}\s*}\);\s*}/s;

appJs = appJs.replace(regex, newLogic.trim());

// also update the cache key from V3 to V4
appJs = appJs.replace(/V3/g, 'V4');

fs.writeFileSync(appJsPath, appJs);
console.log('app.js updated successfully!');
