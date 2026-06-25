// 1. Smart Install Logic
let deferredPrompt;
const installBtn = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        installBtn.style.display = 'none';
    }
});

// 2. The Auto-Scanner
// Since we can't 'look' into folders via GitHub, you just list your file names here ONCE.
// Then the code handles the rest.
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
                <p>Unknown Artist</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            document.getElementById('player-title').innerText = trackName;
            // This points to your actual files in the /music folder
            audioPlayer.src = `music/${trackName}.mp3`;
            audioPlayer.play();
        });
        
        grid.appendChild(card);
    });
}

window.onload = renderGrid;
