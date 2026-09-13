// Mock Data Array for the prototype
const mockData = {
    passes: [
        { zone: 2, player: "De Arrascaeta", team: "Flamengo", crestUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg", stat: "145 Passes" },
        { zone: 14, player: "Andreas Pereira", team: "Palmeiras", crestUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg", stat: "120 Passes" },
        { zone: 20, player: "Ganso", team: "Fluminense", crestUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Fluminense_FC_escudo.svg", stat: "160 Passes" }
    ],
    tackles: [
        { zone: 5, player: "Lucas Romero", team: "Cruzeiro", crestUrl: "https://commons.wikimedia.org/wiki/File:Cruzeiro_Esporte_Clube_(logo).svg", stat: "15 Tackles" },
        { zone: 18, player: "Marlon Freitas", team: "Palmeiras", crestUrl: "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg", stat: "12 Tackles" }
    ]
};

// DOM Elements
const pitchContainer = document.getElementById('pitch');
const statSelector = document.getElementById('stat-selector');
const clearBtn = document.getElementById('clear-btn');
const spotlightText = document.getElementById('spotlight-text');

// Function 1: Renders the grid based on the selected stat
function renderGrid(statType) {
    pitchContainer.innerHTML = ''; // Clear current pitch
    const data = mockData[statType];

    for (let i = 0; i < 24; i++) {
        const zoneDiv = document.createElement('div');
        zoneDiv.className = 'zone';
        zoneDiv.dataset.zoneId = i; // Store zone ID for click events

        const zoneInfo = data.find(item => item.zone === i);

        if (zoneInfo) {
            // Store player data in data attributes for easy access later
            zoneDiv.dataset.player = zoneInfo.player;
            zoneDiv.dataset.team = zoneInfo.team;
            zoneDiv.dataset.stat = zoneInfo.stat;

            zoneDiv.innerHTML = `
                <img src="${zoneInfo.crestUrl}" alt="${zoneInfo.team} Crest" class="team-crest">
                <span class="player-name">${zoneInfo.player}</span>
            `;
        } else {
            zoneDiv.innerHTML = `<span style="opacity: 0.2; font-size: 0.7em;">Zone ${i + 1}</span>`;
        }

        pitchContainer.appendChild(zoneDiv);
    }
}
// Function 2: Handles highlighting a zone and updating the text article
function handleZoneClick(event) {
    const clickedZone = event.target.closest('.zone');
    
    if (!clickedZone) return;

    // Remove 'active' class from all zones
    document.querySelectorAll('.zone').forEach(z => z.classList.remove('active'));
    
    // Add 'active' class to clicked zone
    clickedZone.classList.add('active');

    // Update the spotlight text using DOM manipulation
    if (clickedZone.dataset.player) {
        spotlightText.innerHTML = `<strong>${clickedZone.dataset.player}</strong> from <em>${clickedZone.dataset.team}</em> dominates this zone with <strong>${clickedZone.dataset.stat}</strong>.`;
    } else {
        spotlightText.innerText = `No major data recorded for Zone ${parseInt(clickedZone.dataset.zoneId) + 1}.`;
    }
}

// Event Listener 1: Dropdown Change
statSelector.addEventListener('change', (e) => {
    renderGrid(e.target.value);
    spotlightText.innerText = "Click on any active zone on the pitch to see detailed player information.";
});

// Event Listener 2: Clear Button Click
clearBtn.addEventListener('click', () => {
    pitchContainer.innerHTML = '';
    spotlightText.innerText = "Field cleared. Select a stat to reload data.";
});

// Event Listener 3: Pitch Grid Click (Event Delegation)
pitchContainer.addEventListener('click', handleZoneClick);

// Initial Load
renderGrid('passes');