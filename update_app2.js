const fs = require('fs');

const appJsPath = 'C:\\code\\cover\\MosaicScreensaver\\web\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf-8');

const urls = JSON.parse(fs.readFileSync('C:\\code\\cover\\douban_urls.json', 'utf-8'));
const urlString = JSON.stringify(urls, null, 4);

appJs = appJs.replace(
    /const curatedUrls = \[\s*[^]*?\];/m,
    `const curatedUrls = ${urlString};`
);

fs.writeFileSync(appJsPath, appJs);
console.log('Successfully updated app.js with Douban URLs.');
