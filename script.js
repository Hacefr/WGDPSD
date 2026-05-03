// Data: List all demons here
const allLevels = [
    { pos: 1, name: "Tidal Wave", creator: "OniLink", video: "https://youtube.com", records: ["PlayerA", "PlayerB"] },
    { pos: 2, name: "Acheron", creator: "Riot", video: "https://youtube.com", records: ["PlayerA"] },
    { pos: 11, name: "Cataclysm", creator: "GGBoy", video: "https://youtube.com", records: ["PlayerC"] }
];

// List Team Members
const listTeam = [
    { role: "Owners", names: ["AdminName"] },
    { role: "Editors", names: ["Editor1", "Editor2"] },
    { role: "Helpers", names: ["HelperName"] }
];

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function calculatePoints(pos) {
    // Formula: #1 = 250pts, decreases until #100
    return Math.max(0, 250 - (pos - 1) * 2.5);
}

function showSection(section) {
    const content = document.getElementById('content-area');
    content.innerHTML = "";
    
    // Update active button styling
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${section}`).classList.add('active');

    if (section === 'main' || section === 'extended') {
        const filtered = allLevels.filter(l => section === 'main' ? l.pos <= 10 : l.pos > 10);
        content.innerHTML = `<h1>${section.toUpperCase()} LIST</h1>`;
        filtered.forEach(level => {
            const ytID = getYouTubeID(level.video);
            const thumb = ytID ? `https://youtube.com{ytID}/mqdefault.jpg` : "";
            content.innerHTML += `
                <div class="level-card">
                    <div class="thumbnail" style="background-image: url('${thumb}')"></div>
                    <div class="level-info">
                        <h2>#${level.pos} - ${level.name}</h2>
                        <p>Published by <span class="accent">${level.creator}</span></p>
                        <p>Records: ${level.records.join(', ') || "None"}</p>
                        <a href="${level.video}" target="_blank" style="color:var(--accent-blue); text-decoration:none;">View Video</a>
                    </div>
                </div>`;
        });
    } else if (section === 'players') {
        content.innerHTML = "<h1>STATS VIEWER</h1>";
        let scores = {};
        allLevels.forEach(level => {
            const pts = calculatePoints(level.pos);
            level.records.forEach(p => scores[p] = (scores[p] || 0) + pts);
        });
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        sorted.forEach((player, i) => {
            content.innerHTML += `
                <div class="level-card">
                    <div class="level-info">
                        <h2>#${i + 1} - ${player[0]}</h2>
                        <p>Points: <span class="accent">${player[1].toFixed(2)}</span></p>
                    </div>
                </div>`;
        });
    } else if (section === 'team') {
        content.innerHTML = "<h1>LIST TEAM</h1>";
        listTeam.forEach(group => {
            content.innerHTML += `
                <div class="level-card">
                    <div class="level-info">
                        <h2>${group.role}</h2>
                        <p>${group.names.join(', ')}</p>
                    </div>
                </div>`;
        });
    }
}

// Start on Main List
showSection('main');
