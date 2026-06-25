// 1. Database Setup (Needed for internal storage)
let db;
const request = indexedDB.open("PristineMusicDB", 1);
request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('tracks')) db.createObjectStore('tracks', { keyPath: 'id' });
};
request.onsuccess = (e) => { db = e.target.result; };

// 2. Track List
const trackList = ["Debut", "Gabriela", "Gameboy", "Gnarly", "I'm Pretty", "M.I.A", "Mean Girls", "My Way", "Tonight I Might", "Touch"];
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.querySelector('.play-btn');

// 3. Helper: Save to internal app storage
async function saveToInternalStorage(trackName) {
    try {
        const response = await fetch(`music/${encodeURIComponent(trackName)}.mp3`);
        const blob = await response.blob();
        const transaction = db.transaction(["tracks"], "readwrite");
        transaction.objectStore("tracks").put({ id: trackName, data: blob });
        alert(`${trackName} saved to app offline!`);
    } catch (err) { alert("Could not save track."); }
}

// 4. Render UI
function renderGrid() {
    const grid = document.getElementById('song-grid');
    grid.innerHTML = '';
    trackList.forEach(trackName => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="art-placeholder"></div>
            <div class="song-info">
                <h3>${trackName}</h3>
                <button class="download-btn">Save Offline</button>
            </div>
        `;
        
        card.addEventListener('click', () => {
            document.getElementById('player-title').innerText = trackName;
            audioPlayer.src = `music/${encodeURIComponent(trackName)}.mp3`;
            audioPlayer.play();
            playBtn.innerText = '⏸';
        });

        card.querySelector('.download-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            saveToInternalStorage(trackName);
        });
        grid.appendChild(card);
    });
}

// 5. Playback Controls
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.innerText = '⏸';
    } else {
        audioPlayer.pause();
        playBtn.innerText = '▶';
    }
});

window.onload = renderGrid;
