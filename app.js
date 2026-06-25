// 1. Smart Install Logic (PWA)
let deferredPrompt;
const installBtn = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default Chrome prompt
    e.preventDefault();
    deferredPrompt = e;
    // Show our custom UI button
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User install response: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
    }
});

// Detect iOS Safari to show manual instructions (Optional Pro-touch)
const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
};
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

if (isIos() && !isInStandaloneMode()) {
    console.log("On iOS: Suggest tapping 'Share' -> 'Add to Home Screen'");
    // You could trigger a small toast notification here
}


// 2. IndexedDB Setup
let db;
const request = indexedDB.open("PristineMusicDB", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    // Create an object store for our music blobs
    if (!db.objectStoreNames.contains('tracks')) {
        db.createObjectStore('tracks', { keyPath: 'id' });
    }
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("IndexedDB ready.");
};

request.onerror = function(event) {
    console.error("IndexedDB error:", event.target.errorCode);
};


// 3. The Folder Scanner Logic
const folderImport = document.getElementById('folder-import');
let library = []; // In-memory metadata list

folderImport.addEventListener('change', (event) => {
    const files = event.target.files;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Filter out non-audio files
        if (file.type.startsWith('audio/') || file.name.endsWith('.mp3')) {
            
            // Fallback Logic: Use filename if no tags
            const rawName = file.name.replace(/\.[^/.]+$/, ""); // Strip extension
            let [artist, title] = rawName.split(' - ');
            
            if (!title) {
                title = rawName; // If no dash, whole name is title
                artist = "Unknown Artist";
            }

            const songData = {
                id: file.webkitRelativePath || file.name,
                title: title.trim(),
                artist: artist.trim(),
                fileRef: file // Temporarily holding the file object
            };
            
            library.push(songData);
        }
    }
    
    console.log(`Discovered ${library.length} tracks!`);
    renderGrid();
});

// 4. Basic UI Renderer
function renderGrid() {
    const grid = document.getElementById('song-grid');
    grid.innerHTML = ''; // Clear placeholder
    
    library.forEach(song => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="art-placeholder"></div>
            <div class="song-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
        `;
        
        // Clicking a card updates the player (Playback logic comes next)
        card.addEventListener('click', () => {
            document.getElementById('player-title').innerText = song.title;
            document.getElementById('player-artist').innerText = song.artist;
        });
        
        grid.appendChild(card);
    });
}
