const trackList = ["Debut", "Gabriela", "Gameboy", "Gnarly", "I'm Pretty", "M.I.A", "Mean Girls", "My Way", "Tonight I Might", "Touch"];
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.querySelector('.play-btn');

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
                <button class="download-btn" data-track="${trackName}">Download</button>
            </div>
        `;
        
        card.addEventListener('click', () => {
            document.getElementById('player-title').innerText = trackName;
            audioPlayer.src = `music/${encodeURIComponent(trackName)}.mp3`;
            audioPlayer.play();
            playBtn.innerText = '⏸';
        });

        card.querySelector('.download-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Stop from playing the song
            const link = document.createElement('a');
            link.href = `music/${encodeURIComponent(trackName)}.mp3`;
            link.download = `${trackName}.mp3`;
            link.click();
        });
        
        grid.appendChild(card);
    });
}

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
