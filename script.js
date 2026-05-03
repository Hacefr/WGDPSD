// --- DATA SECTION ---
const allLevels = [
    { 
        pos: 1, 
        name: "Tidal Wave", 
        tag: "Unverified", // Add your tag here
        creator: "OniLink", 
        video: "https://youtube.com", 
        records: ["PlayerOne"] 
    },
    { 
        pos: 2, 
        name: "Acheron", 
        tag: "", // No tag for this level
        creator: "Riot", 
        video: "https://youtube.com", 
        records: ["PlayerTwo"] 
    },
    { 
        pos: 11, 
        name: "Cataclysm", 
        tag: "Legacy", 
        creator: "GGBoy", 
        video: "https://youtube.com", 
        records: ["PlayerOne"] 
    }
];

const listTeam = [
    { role: "Owners", names: ["YourName"] },
    { role: "Editors", names: ["Editor1"] }
];

// --- LOGIC SECTION ---
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[0].length >= 11) ? match[2] : null;
}

function calculatePoints(pos) {
    return Math.max(0, 250 - (pos - 1) * 2.5);
}

function showSection(section) {
    const content = document.getElementById('content-area');
    content.innerHTML = "";
    
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${section}`).classList.add('active');

    if (section === 'main' || section === 'extended') {
        const filtered = allLevels.filter(l => section === 'main' ? l.pos <= 10 : l.pos > 10);
        content.innerHTML = `<h1>${section.toUpperCase()} LIST</h1>`;
        
        filtered.forEach(level => {
            const ytID = getYouTubeID(level.video);
            const thumb = ytID ? `https://youtube.com{ytID}/mqdefault.jpg` : "";
            
            // Logic to check if a tag exists
            const tagHTML = level.tag ? `<span class="level-tag">${level.tag}</span>` : "";

            content.innerHTML += `
                <div class="level-card">
                    <div class="thumbnail" style="background-image: url('${thumb}')"></div>
                    <div class="level-info">
                        <h2>#${level.pos} - ${level.name} ${tagHTML}</h2>
                        <p>By <span class="accent">${level.creator}</span></p>
                        <p>Records: ${level.records.join(', ') || "None"}</p>
                        <a href="${level.video}" target="_blank" class="video-link">Watch Video</a>
                    </div>
                </div>`;
        });
    } else if (section === 'players') {
        content.innerHTML = "<h1>TOP PLAYERS</h1>";
        let scores = {};
        allLevels.forEach(l => l.records.forEach(p => scores[p] = (scores[p] || 0) + calculatePoints(l.pos)));
        
        Object.entries(scores).sort((a, b) => b[1] - a[1]).forEach((p, i) => {
            content.innerHTML += `
                <div class="level-card"><div class="level-info">
                    <h2>#${i+1} - ${p[0]}</h2>
                    <p>Points: <span class="accent">${p[1].toFixed(2)}</span></p>
                </div></div>`;
        });
    } else if (section === 'team') {
        content.innerHTML = "<h1>LIST TEAM</h1>";
        listTeam.forEach(t => {
            content.innerHTML += `<div class="level-card"><div class="level-info"><h2>${t.role}</h2><p>${t.names.join(', ')}</p></div></div>`;
        });
    }
}

showSection('main');
