// 1. Database Setup
let db;
const request = indexedDB.open("PristineMusicDB", 1);
request.onupgradeneeded = (e) => {
    db = e.target.result;
    if (!db.objectStoreNames.contains('tracks')) db.createObjectStore('tracks', { keyPath: 'id' });
};
request.onsuccess = (e) => { db = e.target.result; };

// 2. State
const trackList = ["Debut", "Gabriela", "Gameboy", "Gnarly", "I'm Pretty", "M.I.A", "Mean Girls", "My Way", "Tonight I Might", "Touch"];
const audioPlayer = document.getElementById('audio-player');
let currentTrack = null;

// 3. API Fetcher (Hardcoded Artist for accuracy)
async function fetchTrackMeta(trackName) {
    const artist = "KATSEYE"; // Ensures API searches specifically for this artist
    try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(trackName + " " + artist)}&entity=song&limit=1`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            return {
                artist: data.results[0].artistName,
                cover: data.results[0].artworkUrl100.replace('100x100', '500x500')
            };
        }
    } catch (err) { console.error("API error"); }
    return { artist: "KATSEYE", cover: "" };
}

// 4. Save/Delete Logic
async function saveToInternalStorage(trackName, btnElement) {
    try {
        const response = await fetch(`music/${encodeURIComponent(trackName)}.mp3`);
        const blob = await response.blob();
        const transaction = db.transaction(["tracks"], "readwrite");
        transaction.objectStore("tracks").put({ id: trackName, data: blob });
        btnElement.innerText = "✓ Saved";
    } catch (err) { alert("Could not save."); }
}

// 5. Render Grid
async function renderGrid() {
    const grid = document.getElementById('song-grid');
    grid.innerHTML = '';
    
    for (const trackName of trackList) {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="art-placeholder" id="art-${trackName}"></div>
            <div class="song-info">
                <h3>${trackName}</h3>
                <p id="artist-${trackName}">Loading...</p>
                <button class="download-btn">Save</button>
            </div>
        `;
        grid.appendChild(card);

        fetchTrackMeta(trackName).then(meta => {
            document.getElementById(`artist-${trackName}`).innerText = meta.artist;
            if (meta.cover) document.getElementById(`art-${trackName}`).style.backgroundImage = `url('${meta.cover}')`;
            card.addEventListener('click', () => startPlayback(trackName, meta));
        });

        card.querySelector('.download-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            saveToInternalStorage(trackName, e.target);
        });
    }
}

// 6. Playback
function startPlayback(trackName, meta) {
    currentTrack = trackName;
    audioPlayer.src = `music/${encodeURIComponent(trackName)}.mp3`;
    audioPlayer.play();
    document.getElementById('player-title').innerText = trackName;
    document.getElementById('mini-art').src = meta.cover || '';
    document.getElementById('mini-play').innerText = '⏸';
    document.getElementById('fs-title').innerText = trackName;
    document.getElementById('fs-artist').innerText = meta.artist;
    document.getElementById('fs-cover').src = meta.cover || '';
    document.querySelector('.fs-play').innerText = '⏸';
}

function togglePlay() {
    if (audioPlayer.paused) { audioPlayer.play(); document.getElementById('mini-play').innerText = '⏸'; document.querySelector('.fs-play').innerText = '⏸'; }
    else { audioPlayer.pause(); document.getElementById('mini-play').innerText = '▶'; document.querySelector('.fs-play').innerText = '▶'; }
}

document.getElementById('mini-play').addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
document.querySelector('.fs-play').addEventListener('click', togglePlay);

// 7. UI Toggles
document.getElementById('mini-player').addEventListener('click', () => { if(currentTrack) document.getElementById('fullscreen-player').classList.remove('hidden'); });
document.getElementById('close-fullscreen').addEventListener('click', () => { document.getElementById('fullscreen-player').classList.add('hidden'); });
document.getElementById('profile-btn').addEventListener('click', () => document.getElementById('profile-modal').classList.remove('hidden'));
document.getElementById('close-profile').addEventListener('click', () => document.getElementById('profile-modal').classList.add('hidden'));

// 8. Cache Logic
document.getElementById('clear-cache').addEventListener('click', () => {
    indexedDB.deleteDatabase("PristineMusicDB");
    localStorage.clear();
    location.reload();
});

window.onload = renderGrid;
