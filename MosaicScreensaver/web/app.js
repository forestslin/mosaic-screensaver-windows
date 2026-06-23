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
    const cacheTime = localStorage.getItem('artworksCacheTimeV4');
    
    // Use cache if it's less than 24 hours old
    if (cacheTime && (now - parseInt(cacheTime)) < 24 * 60 * 60 * 1000) {
        try {
            const cachedMusic = JSON.parse(localStorage.getItem('cachedMusicArtworksV4'));
            const cachedMovie = JSON.parse(localStorage.getItem('cachedMovieArtworksV4'));
            const cachedBook = JSON.parse(localStorage.getItem('cachedBookArtworksV4'));
            
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
        await fetchBookArtworks();
    }

    // Fallbacks
    if (musicArtworks.length === 0) musicArtworks = ['https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4a/0c/3e/4a0c3e60-fef0-be2a-5a50-6a1005a76e73/196626943960.jpg/600x600bb.jpg'];
    if (movieArtworks.length === 0) movieArtworks = ['https://static.tvmaze.com/uploads/images/original_untouched/425/1064746.jpg'];
    if (bookArtworks.length === 0) bookArtworks = ['https://covers.openlibrary.org/b/id/8259441-L.jpg'];

    // Save to cache
    try {
        localStorage.setItem('cachedMusicArtworksV4', JSON.stringify(musicArtworks));
        localStorage.setItem('cachedMovieArtworksV4', JSON.stringify(movieArtworks));
        localStorage.setItem('cachedBookArtworksV4', JSON.stringify(bookArtworks));
        localStorage.setItem('artworksCacheTimeV4', now.toString());
    } catch(e) {}
}

async function fetchBookArtworks() {
    try {
        const bookLanguage = typeof window.bookLanguage !== 'undefined' ? window.bookLanguage : 1; // 0=Chinese, 1=Mixed
        
        if (bookLanguage === 0) {
            // To ensure 100% high-quality Chinese book covers without API limitations or spam, 
            // we use a curated list of top 250 Chinese books from Douban.
            const curatedUrls = ["https://img1.doubanio.com/view/subject/l/public/s1070959.jpg","https://img9.doubanio.com/view/subject/l/public/s29869926.jpg","https://img9.doubanio.com/view/subject/l/public/s29101586.jpg","https://img1.doubanio.com/view/subject/l/public/s4371408.jpg","https://img9.doubanio.com/view/subject/l/public/s28357056.jpg","https://img1.doubanio.com/view/subject/l/public/s27237850.jpg","https://img1.doubanio.com/view/subject/l/public/s1078958.jpg","https://img1.doubanio.com/view/subject/l/public/s2347590.jpg","https://img2.doubanio.com/view/subject/l/public/s29651121.jpg","https://img3.doubanio.com/view/subject/l/public/s1024407.jpg","https://img1.doubanio.com/view/subject/l/public/s1229240.jpg","https://img1.doubanio.com/view/subject/l/public/s24514468.jpg","https://img3.doubanio.com/view/subject/l/public/s24516687.jpg","https://img9.doubanio.com/view/subject/l/public/s34099286.jpg","https://img1.doubanio.com/view/subject/l/public/s1237549.jpg","https://img3.doubanio.com/view/subject/l/public/s1034062.jpg","https://img9.doubanio.com/view/subject/l/public/s34711695.jpg","https://img3.doubanio.com/view/subject/l/public/s1369343.jpg","https://img1.doubanio.com/view/subject/l/public/s29799269.jpg","https://img9.doubanio.com/view/subject/l/public/s26018275.jpg","https://img9.doubanio.com/view/subject/l/public/s29376146.jpg","https://img3.doubanio.com/view/subject/l/public/s23128183.jpg","https://img9.doubanio.com/view/subject/l/public/s3745215.jpg","https://img2.doubanio.com/view/subject/l/public/s34099301.jpg","https://img9.doubanio.com/view/subject/l/public/s1319205.jpg","https://img3.doubanio.com/view/subject/l/public/s25814002.jpg","https://img1.doubanio.com/view/subject/l/public/s1447349.jpg","https://img1.doubanio.com/view/subject/l/public/s1151479.jpg","https://img3.doubanio.com/view/subject/l/public/s34099293.jpg","https://img1.doubanio.com/view/subject/l/public/s24575140.jpg","https://img9.doubanio.com/view/subject/l/public/s4468484.jpg","https://img3.doubanio.com/view/subject/l/public/s34777382.jpg","https://img1.doubanio.com/view/subject/l/public/s29396368.jpg","https://img1.doubanio.com/view/subject/l/public/s1762210.jpg","https://img3.doubanio.com/view/subject/l/public/s27814883.jpg","https://img2.doubanio.com/view/subject/l/public/s1144911.jpg","https://img3.doubanio.com/view/subject/l/public/s1070222.jpg","https://img1.doubanio.com/view/subject/l/public/s28050760.jpg","https://img9.doubanio.com/view/subject/l/public/s2157335.jpg","https://img3.doubanio.com/view/subject/l/public/s34099297.jpg","https://img1.doubanio.com/view/subject/l/public/s1765799.jpg","https://img1.doubanio.com/view/subject/l/public/s2654869.jpg","https://img9.doubanio.com/view/subject/l/public/s4007145.jpg","https://img3.doubanio.com/view/subject/l/public/s7019913.jpg","https://img1.doubanio.com/view/subject/l/public/s34099290.jpg","https://img9.doubanio.com/view/subject/l/public/s3248016.jpg","https://img9.doubanio.com/view/subject/l/public/s1800355.jpg","https://img3.doubanio.com/view/subject/l/public/s3219163.jpg","https://img3.doubanio.com/view/subject/l/public/s11284102.jpg","https://img3.doubanio.com/view/subject/l/public/s33797467.jpg","https://img3.doubanio.com/view/subject/l/public/s33956867.jpg","https://img9.doubanio.com/view/subject/l/public/s34100166.jpg","https://img9.doubanio.com/view/subject/l/public/s1627374.jpg","https://img1.doubanio.com/view/subject/l/public/s2659208.jpg","https://img1.doubanio.com/view/subject/l/public/s2962510.jpg","https://img1.doubanio.com/view/subject/l/public/s33640730.jpg","https://img1.doubanio.com/view/subject/l/public/s1727290.jpg","https://img1.doubanio.com/view/subject/l/public/s4575849.jpg","https://img9.doubanio.com/view/subject/l/public/s8968135.jpg","https://img2.doubanio.com/view/subject/l/public/s1134341.jpg","https://img3.doubanio.com/view/subject/l/public/s2347562.jpg","https://img9.doubanio.com/view/subject/l/public/s34069455.jpg","https://img1.doubanio.com/view/subject/l/public/s34848979.jpg","https://img2.doubanio.com/view/subject/l/public/s34192061.jpg","https://img9.doubanio.com/view/subject/l/public/s34544956.jpg","https://img2.doubanio.com/view/subject/l/public/s33802981.jpg","https://img2.doubanio.com/view/subject/l/public/s27003191.jpg","https://img1.doubanio.com/view/subject/l/public/s6240330.jpg","https://img9.doubanio.com/view/subject/l/public/s28297426.jpg","https://img9.doubanio.com/view/subject/l/public/s3254244.jpg","https://img3.doubanio.com/view/subject/l/public/s1076372.jpg","https://img3.doubanio.com/view/subject/l/public/s4250062.jpg","https://img2.doubanio.com/view/subject/l/public/s1106951.jpg","https://img3.doubanio.com/view/subject/l/public/s3424257.jpg","https://img9.doubanio.com/view/subject/l/public/s1953384.jpg","https://img1.doubanio.com/view/subject/l/public/s2177629.jpg","https://img9.doubanio.com/view/subject/l/public/s4521754.jpg","https://img9.doubanio.com/view/subject/l/public/s4526465.jpg","https://img3.doubanio.com/view/subject/l/public/s33884123.jpg","https://img9.doubanio.com/view/subject/l/public/s29477615.jpg","https://img1.doubanio.com/view/subject/l/public/s29071620.jpg","https://img2.doubanio.com/view/subject/l/public/s27409671.jpg","https://img3.doubanio.com/view/subject/l/public/s33685372.jpg","https://img9.doubanio.com/view/subject/l/public/s34300626.jpg","https://img3.doubanio.com/view/subject/l/public/s34577743.jpg","https://img9.doubanio.com/view/subject/l/public/s26018916.jpg","https://img1.doubanio.com/view/subject/l/public/s1008848.jpg","https://img1.doubanio.com/view/subject/l/public/s33986279.jpg","https://img9.doubanio.com/view/subject/l/public/s1768916.jpg","https://img9.doubanio.com/view/subject/l/public/s2651394.jpg","https://img3.doubanio.com/view/subject/l/public/s3893343.jpg","https://img9.doubanio.com/view/subject/l/public/s1486674.jpg","https://img2.doubanio.com/view/subject/l/public/s1067911.jpg","https://img1.doubanio.com/view/subject/l/public/s1167060.jpg","https://img2.doubanio.com/view/subject/l/public/s8958901.jpg","https://img3.doubanio.com/view/subject/l/public/s28688273.jpg","https://img2.doubanio.com/view/subject/l/public/s29535271.jpg","https://img3.doubanio.com/view/subject/l/public/s28260907.jpg","https://img1.doubanio.com/view/subject/l/public/s33779178.jpg","https://img9.doubanio.com/view/subject/l/public/s1020454.jpg","https://img9.doubanio.com/view/subject/l/public/s1790246.jpg","https://img9.doubanio.com/view/subject/l/public/s1146614.jpg","https://img3.doubanio.com/view/subject/l/public/s33944153.jpg","https://img1.doubanio.com/view/subject/l/public/s33710398.jpg","https://img9.doubanio.com/view/subject/l/public/s27411424.jpg","https://img1.doubanio.com/view/subject/l/public/s29878650.jpg","https://img2.doubanio.com/view/subject/l/public/s1045431.jpg","https://img1.doubanio.com/view/subject/l/public/s24611679.jpg","https://img9.doubanio.com/view/subject/l/public/s1077996.jpg","https://img9.doubanio.com/view/subject/l/public/s34072986.jpg","https://img9.doubanio.com/view/subject/l/public/s29786716.jpg","https://img3.doubanio.com/view/subject/l/public/s3628082.jpg","https://img9.doubanio.com/view/subject/l/public/s29574754.jpg","https://img9.doubanio.com/view/subject/l/public/s6807265.jpg","https://img1.doubanio.com/view/subject/l/public/s27217828.jpg","https://img1.doubanio.com/view/subject/l/public/s3983958.jpg","https://img9.doubanio.com/view/subject/l/public/s29249996.jpg","https://img3.doubanio.com/view/subject/l/public/s1015872.jpg","https://img3.doubanio.com/view/subject/l/public/s4661043.jpg","https://img9.doubanio.com/view/subject/l/public/s28668834.jpg","https://img1.doubanio.com/view/subject/l/public/s8972088.jpg","https://img1.doubanio.com/view/subject/l/public/s33562530.jpg","https://img2.doubanio.com/view/subject/l/public/s1067491.jpg","https://img3.doubanio.com/view/subject/l/public/s1044902.jpg","https://img1.doubanio.com/view/subject/l/public/s33699260.jpg","https://img3.doubanio.com/view/subject/l/public/s29164777.jpg","https://img9.doubanio.com/view/subject/l/public/s28561075.jpg","https://img1.doubanio.com/view/subject/l/public/s1201610.jpg","https://img1.doubanio.com/view/subject/l/public/s2832939.jpg","https://img9.doubanio.com/view/subject/l/public/s4619775.jpg","https://img9.doubanio.com/view/subject/l/public/s33958826.jpg","https://img3.doubanio.com/view/subject/l/public/s6987353.jpg","https://img3.doubanio.com/view/subject/l/public/s33638812.jpg","https://img1.doubanio.com/view/subject/l/public/s3134040.jpg","https://img3.doubanio.com/view/subject/l/public/s1595557.jpg","https://img1.doubanio.com/view/subject/l/public/s2619779.jpg","https://img2.doubanio.com/view/subject/l/public/s28332051.jpg","https://img3.doubanio.com/view/subject/l/public/s2393243.jpg","https://img2.doubanio.com/view/subject/l/public/s32330891.jpg","https://img3.doubanio.com/view/subject/l/public/s33317677.jpg","https://img2.doubanio.com/view/subject/l/public/s1914861.jpg","https://img1.doubanio.com/view/subject/l/public/s5763939.jpg","https://img3.doubanio.com/view/subject/l/public/s35398737.jpg","https://img1.doubanio.com/view/subject/l/public/s29746559.jpg","https://img1.doubanio.com/view/subject/l/public/s6916838.jpg","https://img9.doubanio.com/view/subject/l/public/s4444885.jpg","https://img9.doubanio.com/view/subject/l/public/s3675595.jpg","https://img1.doubanio.com/view/subject/l/public/s27914268.jpg","https://img9.doubanio.com/view/subject/l/public/s2019056.jpg","https://img2.doubanio.com/view/subject/l/public/s6828981.jpg","https://img1.doubanio.com/view/subject/l/public/s29738720.jpg","https://img1.doubanio.com/view/subject/l/public/s6185540.jpg","https://img1.doubanio.com/view/subject/l/public/s10199588.jpg","https://img1.doubanio.com/view/subject/l/public/s27598249.jpg","https://img9.doubanio.com/view/subject/l/public/s4133656.jpg","https://img9.doubanio.com/view/subject/l/public/s1785715.jpg","https://img3.doubanio.com/view/subject/l/public/s33968312.jpg","https://img9.doubanio.com/view/subject/l/public/s27218035.jpg","https://img9.doubanio.com/view/subject/l/public/s33492346.jpg","https://img9.doubanio.com/view/subject/l/public/s27685036.jpg","https://img9.doubanio.com/view/subject/l/public/s10206185.jpg","https://img9.doubanio.com/view/subject/l/public/s6795555.jpg","https://img3.doubanio.com/view/subject/l/public/s28313152.jpg","https://img3.doubanio.com/view/subject/l/public/s34323307.jpg","https://img3.doubanio.com/view/subject/l/public/s28095832.jpg","https://img1.doubanio.com/view/subject/l/public/s2652540.jpg","https://img3.doubanio.com/view/subject/l/public/s1099483.jpg","https://img3.doubanio.com/view/subject/l/public/s29675003.jpg","https://img3.doubanio.com/view/subject/l/public/s6974202.jpg","https://img2.doubanio.com/view/subject/l/public/s5988251.jpg","https://img1.doubanio.com/view/subject/l/public/s2391798.jpg","https://img1.doubanio.com/view/subject/l/public/s3042670.jpg","https://img3.doubanio.com/view/subject/l/public/s29796663.jpg","https://img1.doubanio.com/view/subject/l/public/s2611329.jpg","https://img3.doubanio.com/view/subject/l/public/s10205753.jpg","https://img9.doubanio.com/view/subject/l/public/s35289336.jpg","https://img3.doubanio.com/view/subject/l/public/s34340992.jpg","https://img1.doubanio.com/view/subject/l/public/s6180859.jpg","https://img3.doubanio.com/view/subject/l/public/s27988902.jpg","https://img1.doubanio.com/view/subject/l/public/s34356439.jpg","https://img1.doubanio.com/view/subject/l/public/s34821689.jpg","https://img9.doubanio.com/view/subject/l/public/s2990934.jpg","https://img9.doubanio.com/view/subject/l/public/s26040205.jpg","https://img9.doubanio.com/view/subject/l/public/s34274534.jpg","https://img3.doubanio.com/view/subject/l/public/s4421443.jpg","https://img3.doubanio.com/view/subject/l/public/s1513433.jpg","https://img9.doubanio.com/view/subject/l/public/s29827014.jpg","https://img3.doubanio.com/view/subject/l/public/s1325863.jpg","https://img2.doubanio.com/view/subject/l/public/s1137441.jpg","https://img2.doubanio.com/view/subject/l/public/s34249411.jpg","https://img3.doubanio.com/view/subject/l/public/s1670932.jpg","https://img2.doubanio.com/view/subject/l/public/s28622011.jpg","https://img3.doubanio.com/view/subject/l/public/s35012802.jpg","https://img1.doubanio.com/view/subject/l/public/s26546959.jpg","https://img9.doubanio.com/view/subject/l/public/s28284246.jpg","https://img9.doubanio.com/view/subject/l/public/s2170315.jpg","https://img2.doubanio.com/view/subject/l/public/s29673011.jpg","https://img3.doubanio.com/view/subject/l/public/s29032782.jpg","https://img1.doubanio.com/view/subject/l/public/s10431840.jpg","https://img3.doubanio.com/view/subject/l/public/s29423902.jpg","https://img3.doubanio.com/view/subject/l/public/s23579217.jpg","https://img2.doubanio.com/view/subject/l/public/s28061231.jpg","https://img3.doubanio.com/view/subject/l/public/s33984963.jpg","https://img1.doubanio.com/view/subject/l/public/s1146040.jpg","https://img3.doubanio.com/view/subject/l/public/s1070937.jpg","https://img2.doubanio.com/view/subject/l/public/s33774031.jpg","https://img9.doubanio.com/view/subject/l/public/s26720726.jpg","https://img3.doubanio.com/view/subject/l/public/s1683067.jpg","https://img1.doubanio.com/view/subject/l/public/s34385069.jpg","https://img1.doubanio.com/view/subject/l/public/s34157889.jpg","https://img1.doubanio.com/view/subject/l/public/s1436519.jpg","https://img9.doubanio.com/view/subject/l/public/s1127135.jpg","https://img9.doubanio.com/view/subject/l/public/s4093514.jpg","https://img1.doubanio.com/view/subject/l/public/s2563279.jpg","https://img9.doubanio.com/view/subject/l/public/s34097535.jpg","https://img2.doubanio.com/view/subject/l/public/s29000481.jpg","https://img1.doubanio.com/view/subject/l/public/s3286369.jpg","https://img1.doubanio.com/view/subject/l/public/s2142329.jpg","https://img1.doubanio.com/view/subject/l/public/s2128420.jpg","https://img9.doubanio.com/view/subject/l/public/s5765615.jpg","https://img9.doubanio.com/view/subject/l/public/s34636504.jpg","https://img3.doubanio.com/view/subject/l/public/s4243447.jpg","https://img9.doubanio.com/view/subject/l/public/s29417056.jpg","https://img1.doubanio.com/view/subject/l/public/s3435158.jpg","https://img2.doubanio.com/view/subject/l/public/s35534351.jpg","https://img3.doubanio.com/view/subject/l/public/s34711693.jpg","https://img2.doubanio.com/view/subject/l/public/s8972061.jpg","https://img9.doubanio.com/view/subject/l/public/s4124434.jpg","https://img3.doubanio.com/view/subject/l/public/s25807032.jpg","https://img9.doubanio.com/view/subject/l/public/s5804746.jpg","https://img2.doubanio.com/view/subject/l/public/s29109031.jpg","https://img9.doubanio.com/view/subject/l/public/s30025945.jpg","https://img2.doubanio.com/view/subject/l/public/s29960161.jpg","https://img9.doubanio.com/view/subject/l/public/s2976745.jpg","https://img1.doubanio.com/view/subject/l/public/s3099438.jpg","https://img9.doubanio.com/view/subject/l/public/s28397415.jpg","https://img9.doubanio.com/view/subject/l/public/s28033064.jpg","https://img3.doubanio.com/view/subject/l/public/s2522397.jpg","https://img3.doubanio.com/view/subject/l/public/s8972073.jpg","https://img3.doubanio.com/view/subject/l/public/s4293097.jpg","https://img1.doubanio.com/view/subject/l/public/s2897060.jpg","https://img3.doubanio.com/view/subject/l/public/s27009357.jpg","https://img9.doubanio.com/view/subject/l/public/s35466934.jpg","https://img1.doubanio.com/view/subject/l/public/s1469589.jpg","https://img3.doubanio.com/view/subject/l/public/s28284337.jpg","https://img9.doubanio.com/view/subject/l/public/s2280094.jpg","https://img2.doubanio.com/view/subject/l/public/s32332471.jpg","https://img9.doubanio.com/view/subject/l/public/s29486755.jpg","https://img1.doubanio.com/view/subject/l/public/s3696740.jpg","https://img1.doubanio.com/view/subject/l/public/s34151389.jpg"];
            bookArtworks = [...bookArtworks, ...curatedUrls];
        } else {
            // Mixed/Western books using OpenLibrary
            const pages = [];
            for(let i=0; i<2; i++) {
                pages.push(Math.floor(Math.random() * 20) + 1);
            }
            
            const bookPromises = pages.map(page => 
                fetch(`https://openlibrary.org/search.json?q=subject:fiction&limit=100&page=${page}`)
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
        }
        
        // Fallback if no books loaded
        if (bookArtworks.length === 0) {
            bookArtworks = ['https://covers.openlibrary.org/b/id/8259441-L.jpg'];
        } else {
            bookArtworks = bookArtworks.sort(() => Math.random() - 0.5);
            // Limit the total cached books to avoid exceeding localStorage quota
            bookArtworks = bookArtworks.slice(0, 300);
            try {
                localStorage.setItem('cachedBookArtworksV4', JSON.stringify(bookArtworks));
            } catch(e) {}
        }
    } catch (err) {
        console.error("Error fetching books", err);
    }
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
