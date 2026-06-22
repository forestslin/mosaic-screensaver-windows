const genres = window.selectedGenres && window.selectedGenres.length > 0 
    ? window.selectedGenres 
    : ['action', 'comedy', 'drama'];
const API_URLS = genres.map(g => `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(g)}`);
let artworks = [];
let tiles = [];
const TILE_TARGET_WIDTH = 200;
const TILE_TARGET_HEIGHT = 300;
let cols = 0;
let rows = 0;

async function fetchArtworks() {
    try {
        const promises = API_URLS.map(url => fetch(url).then(res => res.json()));
        const results = await Promise.all(promises);
        
        results.forEach(data => {
            if (data) {
                data.forEach(item => {
                    if (item.show && item.show.image && item.show.image.original) {
                        artworks.push(item.show.image.original);
                    } else if (item.show && item.show.image && item.show.image.medium) {
                        artworks.push(item.show.image.medium);
                    }
                });
            }
        });
        
        // Shuffle artworks
        artworks = artworks.sort(() => Math.random() - 0.5);
        console.log(`Fetched ${artworks.length} artworks`);
    } catch (e) {
        console.error("Error fetching artworks:", e);
    }
}

function getRandomArtwork() {
    if (artworks.length === 0) return '';

    // Collect all currently used artworks on the grid
    const usedArtworks = new Set();
    tiles.forEach(t => {
        if (t.imgFront && t.imgFront.src) usedArtworks.add(t.imgFront.src);
        if (t.imgBack && t.imgBack.src) usedArtworks.add(t.imgBack.src);
    });

    // Filter out used ones to prevent duplicates on screen
    let available = artworks.filter(url => !usedArtworks.has(url));
    
    // If we run out of unique artworks, fallback to all
    if (available.length === 0) {
        available = artworks;
    }

    return available[Math.floor(Math.random() * available.length)];
}

function initGrid() {
    const container = document.getElementById('mosaic-container');
    container.innerHTML = '';
    tiles = [];

    const width = window.innerWidth;
    const height = window.innerHeight;

    cols = Math.round(width / TILE_TARGET_WIDTH);
    rows = Math.round(height / TILE_TARGET_HEIGHT);
    
    // By using 1fr for both rows and columns, the grid will stretch tiles slightly to fill 100vw and 100vh exactly.
    // This eliminates any black borders and prevents tiles from being clipped/incomplete at the edges.
    // The image itself uses object-fit: cover, so it will crop internally without distortion.
    container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    container.style.width = `100vw`;
    container.style.height = `100vh`;

    const totalTiles = cols * rows;

    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        
        const inner = document.createElement('div');
        inner.className = 'tile-inner';
        
        const front = document.createElement('div');
        front.className = 'face front';
        const imgFront = document.createElement('img');
        imgFront.src = getRandomArtwork();
        imgFront.onload = () => imgFront.classList.add('loaded');
        front.appendChild(imgFront);
        
        const back = document.createElement('div');
        back.className = 'face back';
        const imgBack = document.createElement('img');
        // Pre-assign a random artwork to the back so it's ready when flipped
        imgBack.src = getRandomArtwork();
        imgBack.onload = () => imgBack.classList.add('loaded');
        back.appendChild(imgBack);
        
        inner.appendChild(front);
        inner.appendChild(back);
        tile.appendChild(inner);
        container.appendChild(tile);
        
        tiles.push({
            el: tile,
            imgFront: imgFront,
            imgBack: imgBack,
            isFlipped: false
        });
    }
}

function flipRandomTile() {
    if (tiles.length === 0) return;
    
    // Pick a random tile that isn't currently flipping
    const availableTiles = tiles.filter(t => !t.el.classList.contains('flipping'));
    if (availableTiles.length === 0) return;
    
    const tile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
    
    // Add flipping class for the popOut animation
    tile.el.classList.add('flipping');
    
    // Toggle flip state
    tile.isFlipped = !tile.isFlipped;
    
    if (tile.isFlipped) {
        tile.el.classList.add('is-flipped');
        // Update the front image (which is now hidden) for the NEXT flip
        setTimeout(() => {
            tile.imgFront.classList.remove('loaded');
            tile.imgFront.src = getRandomArtwork();
        }, 600); // Update halfway through the flip
    } else {
        tile.el.classList.remove('is-flipped');
        // Update the back image (which is now hidden) for the NEXT flip
        setTimeout(() => {
            tile.imgBack.classList.remove('loaded');
            tile.imgBack.src = getRandomArtwork();
        }, 600);
    }
    
    // Remove flipping class after animation ends
    setTimeout(() => {
        tile.el.classList.remove('flipping');
    }, 1200);
}

// Start multiple flip loops for a dynamic effect
function startFlipping() {
    // Number of simultaneous flips depends on screen size
    const flipCount = Math.max(1, Math.floor((cols * rows) / 20));
    
    for (let i = 0; i < flipCount; i++) {
        setTimeout(() => {
            setInterval(flipRandomTile, 1500 + Math.random() * 1000); // Random interval between 1.5s and 2.5s
        }, Math.random() * 2000); // Random start offset
    }
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initGrid();
    }, 500);
});

// Initialization
async function init() {
    await fetchArtworks();
    initGrid();
    startFlipping();
}

init();
