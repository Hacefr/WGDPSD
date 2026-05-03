// Add your levels here. Position 1-10 goes to Main, 11+ to Extended.
const allLevels = [
    { "pos": 1, "name": "Abyss of Darkness", "creator": "Exen", "video": "https://youtube.com" },
    { "pos": 2, "name": "Sakupen Circles", "creator": "NickXD", "video": "https://youtube.com" },
    // Keep adding more...
];

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function filterList(type) {
    const container = document.getElementById('list-container');
    container.innerHTML = "";

    const filtered = allLevels.filter(l => type === 'main' ? l.pos <= 10 : l.pos > 10);

    filtered.forEach(level => {
        const ytID = getYouTubeID(level.video);
        const thumbUrl = `https://img.youtube.com/vi/${ytID}/mqdefault.jpg`;

        container.innerHTML += `
            <div class="level-card">
                <div class="thumbnail" style="background-image: url('${thumbUrl}')"></div>
                <div class="level-info">
                    <h2>#${level.pos} - ${level.name}</h2>
                    <p>By <strong>${level.creator}</strong></p>
                    <a href="${level.video}" target="_blank" style="color: #4db8ff; text-decoration: none;">Watch Video</a>
                </div>
            </div>`;
    });
}

// Default to showing the Main List
filterList('main');
