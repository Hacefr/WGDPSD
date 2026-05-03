let allLevels = []; // Starts empty, will be filled by data.json

// Load data from your external JSON file
async function loadData() {
    try {
        const response = await fetch('data.json');
        allLevels = await response.json();
        showSection('main'); // Show the list once data is loaded
    } catch (error) {
        console.error("Error loading data.json:", error);
        document.getElementById('content-area').innerHTML = "<h1>Error loading data.json</h1>";
    }
}

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match.length === 11) ? match[2] : null;
}

function calculatePoints(pos) {
    return Math.max(0, 250 - (pos - 1) * 2.5);
}

function showSection(section) {
    const content = document.getElementById('content-area');
    content.innerHTML = "";
    
    document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${section}`);
    if(activeBtn) activeBtn.classList.add('active');

    if (section === 'main' || section === 'extended') {
        // Pointercrate standard: Main is top 10, Extended is 11+
        const filtered = allLevels.filter(l => section === 'main' ? l.position <= 10 : l.position > 10);
        content.innerHTML = `<h1>${section.toUpperCase()} LIST</h1>`;
        
        filtered.forEach(level => {
            const ytID = getYouTubeID(level.video);
            const thumb = ytID ? `https://youtube.com{ytID}/mqdefault.jpg` : "";
            const tagHTML = level.tag ? `<span class="tag">${level.tag}</span>` : "";

            content.innerHTML += `
                <div class="level-card">
                    <div class="thumbnail" style="background-image: url('${thumb}')"></div>
                    <div class="level-info">
                        <h2>#${level.position} - ${level.name} ${tagHTML}</h2>
                        <p>By <strong style="color:var(--accent-blue)">${level.creator}</strong></p>
                        <p>Verifier: ${level.verifier || "N/A"}</p>
                        <a href="${level.video}" target="_blank" class="video-link">Watch Verification</a>
                    </div>
                </div>`;
        });
    } else if (section === 'players') {
        content.innerHTML = "<h1>TOP PLAYERS</h1>";
        // Logic for players would require a "records" field in your JSON as well
        content.innerHTML += "<p>Player rankings will appear here based on level completions.</p>";
    } else if (section === 'team') {
        content.innerHTML = "<h1>LIST TEAM</h1><p>Edit script.js to add team members.</p>";
    }
}

// Kick off the loading process
loadData();
