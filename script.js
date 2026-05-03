let allLevels = []; 

// 1. LOAD DATA
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("Could not find data.json");
        allLevels = await response.json();
        showSection('main'); 
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('content-area').innerHTML = `<h1>Error Loading List</h1>`;
    }
}

// 2. HELPER FUNCTIONS
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match.length === 11) ? match : null;
}

function calculatePoints(pos, percent) {
    // Formula: #1 gives 250pts. Rank decreases by 2.5 per spot.
    let basePoints = Math.max(0, 250 - (pos - 1) * 2.5);
    // Multiply by the percentage (e.g., 100% = 1.0, 50% = 0.5)
    return basePoints * (percent / 100);
}

// 3. MAIN DISPLAY LOGIC
function showSection(section) {
    const content = document.getElementById('content-area');
    content.innerHTML = "";
    
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${section}`);
    if(activeBtn) activeBtn.classList.add('active');

    if (section === 'main' || section === 'extended') {
        const filtered = allLevels.filter(l => section === 'main' ? l.position <= 10 : l.position > 10);
        content.innerHTML = `<h1>${section.toUpperCase()} LIST</h1>`;

        filtered.forEach(level => {
            const ytID = getYouTubeID(level.video);
            const thumb = ytID ? `https://youtube.com{ytID}/mqdefault.jpg` : "";
            
            let recordsHTML = "";
            if (level.records && level.records.length > 0) {
                recordsHTML = `<div class="records-list"><strong>Records:</strong><ul>`;
                level.records.forEach(rec => {
                    const statusClass = rec.status ? rec.status.toLowerCase() : "";
                    recordsHTML += `
                        <li>
                            <span class="rec-status ${statusClass}">${rec.status || "Victor"}:</span> 
                            <a href="${rec.link}" target="_blank">${rec.user}</a> 
                            (${rec.percent}%)
                        </li>`;
                });
                recordsHTML += `</ul></div>`;
            }

            content.innerHTML += `
                <div class="level-card">
                    <div class="thumbnail" style="background-image: url('${thumb}')"></div>
                    <div class="level-info">
                        <h2>#${level.position} - ${level.name} ${level.tag ? `<span class="tag">${level.tag}</span>` : ""}</h2>
                        <p>By <strong style="color:#4db8ff">${level.creator}</strong> | ID: ${level.id}</p>
                        ${recordsHTML}
                        <a href="${level.video}" target="_blank" class="video-link">WATCH VERIFICATION</a>
                    </div>
                </div>`;
        });

    } else if (section === 'players') {
        content.innerHTML = "<h1>TOP PLAYERS</h1>";
        let scores = {};

        // Calculate scores for every player found in records
        allLevels.forEach(level => {
            if (level.records) {
                level.records.forEach(rec => {
                    const points = calculatePoints(level.position, rec.percent);
                    if (scores[rec.user]) {
                        scores[rec.user] += points;
                    } else {
                        scores[rec.user] = points;
                    }
                });
            }
        });

        // Sort players by score (highest first)
        const sortedPlayers = Object.entries(scores).sort((a, b) => b[1] - a[1]);

        if (sortedPlayers.length === 0) {
            content.innerHTML += "<p>No records found to calculate rankings.</p>";
        }

        sortedPlayers.forEach((player, index) => {
            const [name, score] = player;
            content.innerHTML += `
                <div class="level-card">
                    <div class="level-info">
                        <h2>#${index + 1} - ${name}</h2>
                        <p>Total Points: <strong style="color:#4db8ff">${score.toFixed(2)}</strong></p>
                    </div>
                </div>`;
        });

    } else if (section === 'team') {
        content.innerHTML = `
            <h1>LIST TEAM</h1>
            <div class="level-card">
                <div class="level-info">
                    <h2>Owner</h2>
                    <p>YourName</p>
                </div>
            </div>
        `;
    }
}

// Start the application
loadData();
