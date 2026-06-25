// 1. Smart Install Logic
let deferredPrompt;
const installBtn = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

// 2. The Auto-Scanner
const trackList = [
    "Debut", "Gabriela", "Gameboy", "Gnarly", "I'm Pretty", 
    "M.I.A", "Mean Girls", "My Way", "Tonight I Might", "Touch"
];

function renderGrid() {
    const grid = document.getElementById('song-grid');
    const audioPlayer = document.getElementById('audio-player');
    grid.innerHTML = ''; 
    
    trackList.forEach(trackName => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="art-placeholder"></div>
            <div class="song-info">
                <h3>${trackName}</h3>
                <p>Click to Play</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            // Update Player Bar
            document.getElementById('player-title').innerText = trackName;
            
            // Encode the path to handle spaces (e.g., 'Mean Girls.mp3' becomes 'Mean%20Girls.mp3')
            const safePath = encodeURIComponent(trackName);
            audioPlayer.src = `music/${safePath}.mp3`;
            
            // Attempt playback
            audioPlayer.play().catch(error => {
                console.log("Playback blocked by browser, please click Play button.");
            });
        });
        
        grid.appendChild(card);
    });
}

// 3. Manual Play/Pause Button Logic
const playBtn = document.querySelector('.play-btn');
const audioPlayer = document.getElementById('audio-player');

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
