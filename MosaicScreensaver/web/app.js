const displayMode = typeof window.displayMode !== 'undefined' ? window.displayMode : 2; // 0=Music, 1=Movie, 2=Mixed, 3=Books, 4=All Mixed
const animationType = typeof window.animationType !== 'undefined' ? window.animationType : 0; // 0=Flip, 1=Flow
const bookLanguage = typeof window.bookLanguage !== 'undefined' ? window.bookLanguage : 0; // 0=Chinese, 1=All

const musicGenres = window.selectedMusicGenres && window.selectedMusicGenres.length > 0 ? window.selectedMusicGenres : ['pop', 'rock', 'jazz'];
const movieGenres = window.selectedMovieGenres && window.selectedMovieGenres.length > 0 ? window.selectedMovieGenres : ['action', 'comedy', 'drama'];

let musicArtworks = [];
let movieArtworks = [];
let bookArtworks = [];
let tiles = [];
let cols = 0;
let rows = 0;

async function fetchArtworks() {
    const now = Date.now();
    const cacheTime = localStorage.getItem('artworksCacheTime');
    
    // Use cache if it's less than 24 hours old
    if (cacheTime && (now - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) {
        try {
            const cachedMusic = JSON.parse(localStorage.getItem('cachedMusicArtworks'));
            const cachedMovie = JSON.parse(localStorage.getItem('cachedMovieArtworks'));
            const cachedBook = JSON.parse(localStorage.getItem('cachedBookArtworks'));
            
            // Check if we have what we need based on displayMode
            let cacheValid = true;
            if ((displayMode === 0 || displayMode === 2 || displayMode === 4) && (!cachedMusic || cachedMusic.length === 0)) cacheValid = false;
            if ((displayMode === 1 || displayMode === 2 || displayMode === 4) && (!cachedMovie || cachedMovie.length === 0)) cacheValid = false;
            if ((displayMode === 3 || displayMode === 4) && (!cachedBook || cachedBook.length === 0)) cacheValid = false;
            
            if (cacheValid) {
                musicArtworks = cachedMusic || [];
                movieArtworks = cachedMovie || [];
                bookArtworks = cachedBook || [];
                console.log("Loaded artworks from cache.");
                return;
            }
        } catch(e) {}
    }

    const promises = [];

    // Fetch Music
    if (displayMode === 0 || displayMode === 2 || displayMode === 4) {
        const selectedMusic = [...musicGenres].sort(() => 0.5 - Math.random()).slice(0, 3);
        for (const g of selectedMusic) {
            const url = `https://itunes.apple.com/search?term=${encodeURIComponent(g)}&entity=album&limit=200`;
            try {
                const res = await fetch(url);
                const data = await res.json();
                if (data.results) {
                    data.results.forEach(item => {
                        if (item.artworkUrl100) {
                            musicArtworks.push(item.artworkUrl100.replace('100x100bb', '600x600bb'));
                        }
                    });
                }
            } catch(e) { console.error(e); }
        }
        musicArtworks = musicArtworks.sort(() => Math.random() - 0.5);
    }

    // Fetch Movie
    if (displayMode === 1 || displayMode === 2 || displayMode === 4) {
        const pages = [];
        while(pages.length < 3) {
            const p = Math.floor(Math.random() * 20);
            if(!pages.includes(p)) pages.push(p);
        }
        
        const moviePromises = pages.map(page => 
            fetch(`https://api.tvmaze.com/shows?page=${page}`)
                .then(res => res.json())
                .catch(() => [])
        );
        const results = await Promise.all(moviePromises);
        results.forEach(data => {
            if (data && Array.isArray(data)) {
                data.forEach(show => {
                    const matchesGenre = movieGenres.some(g => {
                        if (g.toLowerCase() === 'chinese') {
                            return (show.network && show.network.country && show.network.country.code === 'CN') ||
                                   (show.webChannel && show.webChannel.country && show.webChannel.country.code === 'CN') ||
                                   (show.language && show.language.toLowerCase() === 'chinese');
                        }
                        return show.genres && show.genres.some(sg => sg.toLowerCase() === g.toLowerCase());
                    });
                    if (matchesGenre && show.image) {
                        movieArtworks.push(show.image.original || show.image.medium);
                    }
                });
            }
        });
        movieArtworks = movieArtworks.sort(() => Math.random() - 0.5);
    }

    // Fetch Books
    if (displayMode === 3 || displayMode === 4) {
        const pages = [];
        while(pages.length < 3) {
            const p = Math.floor(Math.random() * 20) + 1;
            if(!pages.includes(p)) pages.push(p);
        }
        
        const langParam = bookLanguage === 0 ? "&language=chi" : "";
        const bookPromises = pages.map(page => 
            fetch(`https://openlibrary.org/search.json?q=subject:fiction${langParam}&limit=100&page=${page}`)
                .then(res => res.json())
                .catch(() => ({}))
        );
        const results = await Promise.all(bookPromises);
        results.forEach(data => {
            if (data && data.docs) {
                data.docs.forEach(doc => {
                    if (doc.cover_i) {
                        bookArtworks.push(`https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`);
                    }
                });
            }
        });
        bookArtworks = bookArtworks.sort(() => Math.random() - 0.5);
    }

    // Fallbacks
    if (musicArtworks.length === 0) musicArtworks = ['https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4a/0c/3e/4a0c3e60-fef0-be2a-5a50-6a1005a76e73/196626943960.jpg/600x600bb.jpg'];
    if (movieArtworks.length === 0) movieArtworks = ['https://static.tvmaze.com/uploads/images/original_untouched/425/1064746.jpg'];
    if (bookArtworks.length === 0) bookArtworks = ['https://covers.openlibrary.org/b/id/8259441-L.jpg'];

    // Save to cache
    try {
        localStorage.setItem('cachedMusicArtworks', JSON.stringify(musicArtworks));
        localStorage.setItem('cachedMovieArtworks', JSON.stringify(movieArtworks));
        localStorage.setItem('cachedBookArtworks', JSON.stringify(bookArtworks));
        localStorage.setItem('artworksCacheTime', now.toString());
    } catch(e) {}
}

function getRandomArtwork(type) {
    let pool = [];
    if (type === 'music') pool = musicArtworks;
    else if (type === 'movie') pool = movieArtworks;
    else if (type === 'book') pool = bookArtworks;
    else pool = [...musicArtworks, ...movieArtworks, ...bookArtworks];

    if (pool.length === 0) return '';
    return pool[Math.floor(Math.random() * pool.length)];
}

function getGridTypes() {
    if (displayMode === 0) return ['music'];
    if (displayMode === 1) return ['movie'];
    if (displayMode === 2) return ['music', 'movie'];
    if (displayMode === 3) return ['book'];
    return ['music', 'movie', 'book']; // 4
}

function initFlipGrid() {
    const container = document.getElementById('mosaic-container');
    container.innerHTML = '';
    container.className = 'mosaic-container flip-mode';
    tiles = [];

    const width = window.innerWidth;
    const height = window.innerHeight;
    rows = Math.max(2, Math.round(height / 200));
    
    let colTypes = [];
    const types = getGridTypes();
    
    // Average ratio
    let totalRatio = 0;
    types.forEach(t => { totalRatio += (t === 'music' ? 1 : 0.667); });
    const avgColWidth = (height / rows) * (totalRatio / types.length);
    
    cols = Math.max(1, Math.round(width / avgColWidth));
    for (let i = 0; i < cols; i++) {
        colTypes.push(types[i % types.length]);
    }

    for (let c = 0; c < cols; c++) {
        const type = colTypes[c];
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
            
            tiles.push({ el: tile, imgFront: imgFront, imgBack: imgBack, isFlipped: false, type: type });
        }
    }
}

function initFlowGrid() {
    const container = document.getElementById('mosaic-container');
    container.innerHTML = '';
    container.className = 'mosaic-container flow-mode';
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    rows = Math.max(2, Math.round(height / 200));
    const rowHeight = height / rows;
    
    const types = getGridTypes();
    
    for (let r = 0; r < rows; r++) {
        const type = types[r % types.length];
        const rowEl = document.createElement('div');
        rowEl.className = `flow-row ${type}`;
        rowEl.style.height = `${rowHeight}px`;
        rowEl.style.position = 'relative';
        
        const speedLevel = window.flipSpeed || 3;
        // pixels per second = width / duration
        const duration = 60 - (speedLevel * 10) + Math.random() * 10;
        const itemWidth = type === 'music' ? rowHeight : rowHeight * 0.667;
        
        const itemsNeeded = Math.ceil(width / itemWidth) + 2;
        
        // Initial fill
        for (let i = 0; i < itemsNeeded; i++) {
            spawnFlowTile(rowEl, type, itemWidth, width, duration, i * itemWidth - itemWidth);
        }
        
        // Continuously spawn new tiles at the left edge (-itemWidth)
        const spawnInterval = (itemWidth / width) * duration * 1000;
        setInterval(() => {
            spawnFlowTile(rowEl, type, itemWidth, width, duration, -itemWidth);
        }, spawnInterval);
        
        container.appendChild(rowEl);
    }
}

function spawnFlowTile(rowEl, type, itemWidth, screenWidth, duration, startX) {
    const tile = document.createElement('div');
    tile.className = 'flow-tile';
    tile.style.width = `${itemWidth}px`;
    tile.style.height = '100%';
    tile.style.position = 'absolute';
    tile.style.left = '0';
    tile.style.top = '0';
    
    const img = document.createElement('img');
    img.src = getRandomArtwork(type);
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.border = '1px solid rgba(0,0,0,0.5)';
    img.style.backgroundColor = '#222';
    
    tile.appendChild(img);
    rowEl.appendChild(tile);
    
    const speed = screenWidth / duration; 
    const distanceToTravel = (screenWidth + itemWidth) - startX;
    const travelTime = distanceToTravel / speed;
    
    const anim = tile.animate([
        { transform: `translateX(${startX}px)` },
        { transform: `translateX(${screenWidth + itemWidth}px)` }
    ], {
        duration: travelTime * 1000,
        easing: 'linear',
        fill: 'forwards'
    });
    
    anim.onfinish = () => {
        tile.remove();
    };
}

function flipRandomTile() {
    if (tiles.length === 0) return;
    const availableTiles = tiles.filter(t => !t.el.classList.contains('flipping'));
    if (availableTiles.length === 0) return;
    const tile = availableTiles[Math.floor(Math.random() * availableTiles.length)];
    
    tile.el.classList.add('flipping');
    tile.isFlipped = !tile.isFlipped;
    
    if (tile.isFlipped) {
        tile.el.classList.add('is-flipped');
        setTimeout(() => {
            tile.imgFront.classList.remove('loaded');
            tile.imgFront.src = getRandomArtwork(tile.type);
        }, 600);
    } else {
        tile.el.classList.remove('is-flipped');
        setTimeout(() => {
            tile.imgBack.classList.remove('loaded');
            tile.imgBack.src = getRandomArtwork(tile.type);
        }, 600);
    }
    
    setTimeout(() => {
        tile.el.classList.remove('flipping');
    }, 1200);
}

function startFlipping() {
    const flipCount = Math.max(1, Math.floor((cols * rows) / 20));
    const speedLevel = window.flipSpeed || 3;
    let baseInterval = 1500, randomRange = 1000;
    if (speedLevel === 1) { baseInterval = 4500; randomRange = 3000; }
    else if (speedLevel === 2) { baseInterval = 3000; randomRange = 2000; }
    else if (speedLevel === 4) { baseInterval = 750; randomRange = 500; }
    else if (speedLevel === 5) { baseInterval = 300; randomRange = 200; }
    
    for (let i = 0; i < flipCount; i++) {
        setTimeout(() => {
            setInterval(flipRandomTile, baseInterval + Math.random() * randomRange);
        }, Math.random() * baseInterval);
    }
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (animationType === 1) initFlowGrid();
        else initFlipGrid();
    }, 500);
});

async function init() {
    await fetchArtworks();
    if (animationType === 1) {
        initFlowGrid();
    } else {
        initFlipGrid();
        startFlipping();
    }
}

init();
