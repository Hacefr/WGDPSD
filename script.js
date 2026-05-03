fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const listContainer = document.getElementById('demon-list');
    data.sort((a, b) => a.position - b.position); // Ensure correct order
    data.forEach(level => {
      listContainer.innerHTML += `
        <div class="level-card">
          <h2>#${level.position} - ${level.name}</h2>
          <p>By ${level.creator} | ID: ${level.id}</p>
          <a href="${level.video}" target="_blank">Watch Verification</a>
        </div>`;
    });
  });
