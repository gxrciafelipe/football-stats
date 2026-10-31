// Dictionary mapping team names to their crest URLs
const teamCrests = {
    "Flamengo": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg",
    "Palmeiras": "https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg",
    "Fluminense": "https://upload.wikimedia.org/wikipedia/commons/a/a3/Fluminense_FC_escudo.svg",
    "Cruzeiro": "https://upload.wikimedia.org/wikipedia/commons/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg",
    "Botafogo": "https://upload.wikimedia.org/wikipedia/commons/c/cb/Escudo_Botafogo.svg",
    "São Paulo": "https://upload.wikimedia.org/wikipedia/commons/4/4b/S%C3%A3o_Paulo_Futebol_Clube.png"
};

// Cleaner Mock Data using just the team names
const mockData = {
    passes: [
        { zone: 2, player: "Gerson", team: "Flamengo", stat: "145 Passes" },
        { zone: 14, player: "Raphael Veiga", team: "Palmeiras", stat: "120 Passes" },
        { zone: 20, player: "Ganso", team: "Fluminense", stat: "160 Passes" },
        { zone: 8, player: "Matheus Pereira", team: "Cruzeiro", stat: "135 Passes" }
    ],
    tackles: [
        { zone: 5, player: "André", team: "Fluminense", stat: "15 Tackles" },
        { zone: 18, player: "Zé Rafael", team: "Palmeiras", stat: "12 Tackles" },
        { zone: 1, player: "William", team: "Cruzeiro", stat: "18 Tackles" }
    ]
};

// DOM Elements
const pitchContainer = document.getElementById('pitch');
const statSelector = document.getElementById('stat-selector');
const clearBtn = document.getElementById('clear-btn');
const spotlightText = document.getElementById('spotlight-text');

function renderGrid(statType) {
    pitchContainer.innerHTML = ''; 
    const data = mockData[statType];

    for (let i = 0; i < 24; i++) {
        const zoneDiv = document.createElement('div');
        zoneDiv.className = 'zone';
        zoneDiv.dataset.zoneId = i; 

        const zoneInfo = data.find(item => item.zone === i);

        if (zoneInfo) {
            zoneDiv.dataset.player = zoneInfo.player;
            zoneDiv.dataset.team = zoneInfo.team;
            zoneDiv.dataset.stat = zoneInfo.stat;

            // Look up the URL from our dictionary, fallback to a default if missing
            const crestUrl = teamCrests[zoneInfo.team] || "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";

            zoneDiv.innerHTML = `
                <img src="${crestUrl}" alt="${zoneInfo.team} Crest" class="team-crest">
                <span class="player-name">${zoneInfo.player}</span>
            `;
        } else {
            zoneDiv.innerHTML = `<span style="opacity: 0.2; font-size: 0.7em;">Zone ${i + 1}</span>`;
        }

        pitchContainer.appendChild(zoneDiv);
    }
}

function handleZoneClick(event) {
    const clickedZone = event.target.closest('.zone');
    if (!clickedZone) return;

    document.querySelectorAll('.zone').forEach(z => z.classList.remove('active'));
    clickedZone.classList.add('active');

    if (clickedZone.dataset.player) {
        spotlightText.innerHTML = `<strong>${clickedZone.dataset.player}</strong> from <em>${clickedZone.dataset.team}</em> dominates this zone with <strong>${clickedZone.dataset.stat}</strong>.`;
    } else {
        spotlightText.innerText = `No major data recorded for Zone ${parseInt(clickedZone.dataset.zoneId) + 1}.`;
    }
}

statSelector.addEventListener('change', (e) => {
    renderGrid(e.target.value);
    spotlightText.innerText = "Click on any active zone on the pitch to see detailed player information.";
});

clearBtn.addEventListener('click', () => {
    pitchContainer.innerHTML = '';
    spotlightText.innerText = "Field cleared. Select a stat to reload data.";
});

pitchContainer.addEventListener('click', handleZoneClick);
renderGrid('passes');