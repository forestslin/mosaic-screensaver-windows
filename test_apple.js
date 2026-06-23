const fs = require('fs');

async function test() {
    const res = await fetch('https://itunes.apple.com/search?term=%E5%8A%89%E6%85%88%E6%AC%A3&entity=ebook&country=tw&limit=10');
    const data = await res.json();
    for (const item of data.results) {
        console.log(`Title: ${item.trackName}, Author: ${item.artistName}, Price: ${item.price}, Rating: ${item.averageUserRating}`);
    }
}
test();
