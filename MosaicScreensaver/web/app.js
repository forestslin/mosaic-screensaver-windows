const displayMode = typeof window.displayMode !== 'undefined' ? window.displayMode : 2; // 0 = Music, 1 = Movie, 2 = Mixed

const musicGenres = window.selectedMusicGenres && window.selectedMusicGenres.length > 0 
    ? window.selectedMusicGenres 
    : ['pop', 'rock', 'jazz'];

const movieGenres = window.selectedMovieGenres && window.selectedMovieGenres.length > 0 
    ? window.selectedMovieGenres 
    : ['action', 'comedy', 'drama'];

const MUSIC_API_URLS = musicGenres.map(g => `https://itunes.apple.com/search?term=${encodeURIComponent(g)}&entity=album&limit=200`);
const MOVIE_API_URLS = movieGenres.map(g => `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(g)}`);

let musicArtworks = [];
let movieArtworks = [];
let tiles = [];
let cols = 0;
let rows = 0;

async function fetchArtworks() {
    const promises = [];
    
    // Fetch music if displayMode is Music (0) or Mixed (2)
    if (displayMode === 0 || displayMode === 2) {
        promises.push(
            Promise.all(MUSIC_API_URLS.map(url => fetch(url).then(res => res.json())))
                .then(results => {
                    results.forEach(data => {
                        if (data.results) {
                            data.results.forEach(item => {
                                if (item.artworkUrl100) {
                                    const highResUrl = item.artworkUrl100.replace('100x100bb', '600x600bb');
                                    musicArtworks.push(highResUrl);
                                }
                            });
                        }
                    });
                    // Shuffle
                    musicArtworks = musicArtworks.sort(() => Math.random() - 0.5);
                    console.log(`Fetched ${musicArtworks.length} music artworks`);
                })
                .catch(err => console.error("Error fetching music:", err))
        );
    }
    
    // Fetch movie if displayMode is Movie (1) or Mixed (2)
    if (displayMode === 1 || displayMode === 2) {
        promises.push(
            Promise.all(MOVIE_API_URLS.map(url => fetch(url).then(res => res.json())))
                .then(results => {
                    results.forEach(data => {
                        if (data) {
                            data.forEach(item => {
                                if (item.show && item.show.image && item.show.image.original) {
                                    movieArtworks.push(item.show.image.original);
                                } else if (item.show && item.show.image && item.show.image.medium) {
                                    movieArtworks.push(item.show.image.medium);
                                }
                            });
                        }
                    });
                    // Shuffle
                    movieArtworks = movieArtworks.sort(() => Math.random() - 0.5);
                    console.log(`Fetched ${movieArtworks.length} movie posters`);
                })
                .catch(err => console.error("Error fetching movies:", err))
        );
    }
    
    await Promise.all(promises);
}

function getRandomArtwork(type) {
    const pool = type === 'music' ? musicArtworks : movieArtworks;
    if (pool.length === 0) return '';

    // Collect all currently used artworks on the grid for this type
    const usedArtworks = new Set();
    tiles.forEach(t => {
        if (t.type === type) {
            if (t.imgFront && t.imgFront.src) usedArtworks.add(t.imgFront.src);
            if (t.imgBack && t.imgBack.src) usedArtworks.add(t.imgBack.src);
        }
    });

    // Filter out used ones to prevent duplicates
    let available = pool.filter(url => !usedArtworks.has(url));
    
    // If we run out of unique artworks, fallback to the entire pool
    if (available.length === 0) {
        available = pool;
    }

    return available[Math.floor(Math.random() * available.length)];
}

function initGrid() {
    const container = document.getElementById('mosaic-container');
    container.innerHTML = '';
    tiles = [];

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Determine vertical rows
    // Target height around 200px per tile
    rows = Math.max(2, Math.round(height / 200));

    // Determine column sizes and types
    let colTypes = [];
    if (displayMode === 0) {
        // Music only (1:1 grid)
        // Column width is roughly height / rows
        const musicColWidth = height / rows;
        cols = Math.max(1, Math.round(width / musicColWidth));
        colTypes = Array(cols).fill('music');
    } else if (displayMode === 1) {
        // Movie only (2:3 grid)
        // Column width is roughly (height / rows) * (2/3)
        const movieColWidth = (height / rows) * (2 / 3);
        cols = Math.max(1, Math.round(width / movieColWidth));
        colTypes = Array(cols).fill('movie');
    } else {
        // Mixed (Alternating columns)
        // Average column width: (MusicColWidth + MovieColWidth) / 2
        const avgColWidth = ((height / rows) + (height / rows * 0.667)) / 2;
        cols = Math.max(2, Math.round(width / avgColWidth));
        
        for (let i = 0; i < cols; i++) {
            colTypes.push(i % 2 === 0 ? 'music' : 'movie');
        }
    }

    for (let c = 0; c < cols; c++) {
        const type = colTypes[c];
        
        // Create vertical column container
        const columnEl = document.createElement('div');
        columnEl.className = `mosaic-column ${type}`;
        container.appendChild(columnEl);

        for (let r = 0; r < rows; r++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            
            const inner = document.createElement('div');
            inner.className = 'tile-inner';
            
            const front = document.createElement('div');
            front.className = 'face front';
            const imgFront = document.createElement('img');
            imgFront.src = getRandomArtwork(type);
            imgFront.onload = () => imgFront.classList.add('loaded');
            front.appendChild(imgFront);
            
            const back = document.createElement('div');
            back.className = 'face back';
            const imgBack = document.createElement('img');
            imgBack.src = getRandomArtwork(type);
            imgBack.onload = () => imgBack.classList.add('loaded');
            back.appendChild(imgBack);
            
            inner.appendChild(front);
            inner.appendChild(back);
            tile.appendChild(inner);
            columnEl.appendChild(tile);
            
            tiles.push({
                el: tile,
                imgFront: imgFront,
                imgBack: imgBack,
                isFlipped: false,
                type: type
            });
        }
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
            tile.imgFront.src = getRandomArtwork(tile.type);
        }, 600); // Update halfway through the flip
    } else {
        tile.el.classList.remove('is-flipped');
        // Update the back image (which is now hidden) for the NEXT flip
        setTimeout(() => {
            tile.imgBack.classList.remove('loaded');
            tile.imgBack.src = getRandomArtwork(tile.type);
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
    
    // Map flipSpeed (1-5, default 3) to intervals
    const speedLevel = window.flipSpeed || 3;
    let baseInterval, randomRange;
    switch (speedLevel) {
        case 1: // Slowest
            baseInterval = 4500;
            randomRange = 3000;
            break;
        case 2: // Slower
            baseInterval = 3000;
            randomRange = 2000;
            break;
        case 4: // Faster
            baseInterval = 750;
            randomRange = 500;
            break;
        case 5: // Fastest
            baseInterval = 300;
            randomRange = 200;
            break;
        case 3: // Normal
        default:
            baseInterval = 1500;
            randomRange = 1000;
            break;
    }
    
    for (let i = 0; i < flipCount; i++) {
        setTimeout(() => {
            setInterval(flipRandomTile, baseInterval + Math.random() * randomRange);
        }, Math.random() * baseInterval);
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
