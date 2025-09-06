let numPlayers = 0;
let players = [];

// Multiplicadores das cores
const colorMultiplier = {
  "#ffffff": 1,     // Branco
  "#808080": 1.1,   // Cinza
  "#000000": 1.2,   // Preto
  "#ff0000": 1.3,   // Vermelho
  "#0000ff": 3,   // Azul
  "#ffa500": 4,     // Laranja
  "#ffff00": 4.5,   // Amarelo
  "#008000": 7,     // Verde
  "#ffc0cb": 10      // Rosa
};

function calculateScore(player) {
  return player.count * (colorMultiplier[player.color.toLowerCase()] || 1);
}

// Tela 1: Número de jogadores
function submitNumPlayers() {
  const input = document.getElementById('numPlayers');
  numPlayers = parseInt(input.value);

  if (!numPlayers || numPlayers < 1) {
    alert("Informe um número válido de jogadores.");
    return;
  }

  document.getElementById('screen-players-number').style.display = 'none';
  document.getElementById('screen-players-info').style.display = 'block';

  renderPlayersInputs();
}

// Tela 2: Coleta nomes e cores
function renderPlayersInputs() {
  const container = document.getElementById('playersInputs');
  container.innerHTML = '';

  const cores = [
    {name: "Preto", value: "#000000"},
    {name: "Branco", value: "#ffffff"},
    {name: "Amarelo", value: "#FFFF00"},
    {name: "Verde", value: "#008000"},
    {name: "Azul", value: "#0000FF"},
    {name: "Vermelho", value: "#FF0000"},
    {name: "Rosa", value: "#FFC0CB"},
    {name: "Laranja", value: "#FFA500"},
    {name: "Cinza", value: "#808080"}
  ];

  for (let i = 0; i < numPlayers; i++) {
    const div = document.createElement('div');
    div.className = 'player-row';

    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.placeholder = `Nome do jogador ${i+1}`;
    inputName.id = `playerName${i}`;
    div.appendChild(inputName);

    const colorContainer = document.createElement('div');
    colorContainer.className = 'color-container';
    colorContainer.id = `playerColorContainer${i}`;

    cores.forEach(c => {
      const colorBox = document.createElement('div');
      colorBox.className = 'color-box';
      colorBox.style.backgroundColor = c.value;
      colorBox.title = c.name;

      colorBox.addEventListener('click', () => {
        colorContainer.querySelectorAll('.color-box').forEach(b => b.classList.remove('selected'));
        colorBox.classList.add('selected');
        colorContainer.setAttribute('data-selected', c.value);
      });

      colorContainer.appendChild(colorBox);
    });

    div.appendChild(colorContainer);
    container.appendChild(div);
  }
}

async function startGame() {
  players = [];
  for (let i = 0; i < numPlayers; i++) {
    const name = document.getElementById(`playerName${i}`).value.trim();
    const color = document.getElementById(`playerColorContainer${i}`).getAttribute('data-selected');

    if (!name) { alert("Informe todos os nomes!"); return; }
    if (!color) { alert("Escolha uma cor para cada jogador!"); return; }

    players.push({name, color, count:0});
  }

  try {
    const response = await fetch('http://127.0.0.1:8000/players', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({players})
    });
    const data = await response.json();
    console.log('Jogadores enviados:', data);
    //alert('Jogadores salvos com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar jogadores:', error);
    //alert('Erro ao salvar jogadores no servidor.');
  }

  document.getElementById('screen-players-info').style.display = 'none';
  document.getElementById('screen-game').style.display = 'block';

  renderPlayersCounters();
}

function renderPlayersCounters() {
  const container = document.getElementById('playersDisplay');
  container.innerHTML = '';

  players.forEach((player, index) => {
    const div = document.createElement('div');
    div.className = 'player-counter';

    let textStyle = `color:${player.color}`;
    if (player.color.toLowerCase() === "#ffffff") { 
      textStyle += "; text-shadow: 0 0 3px #000"; 
    }

    div.innerHTML = `
      <span style="${textStyle}">${player.name}</span>
      <span id="playerCount${index}">${player.count}</span>
      <button class="green" onclick="increment(${index})">+</button>
      <button class="red" onclick="decrement(${index})">-</button>
    `;
    container.appendChild(div);
  });
}

// Função para decrementar
function decrement(index) {
  if (players[index].count > 0) {
    players[index].count--;
    document.getElementById(`playerCount${index}`).innerText = players[index].count;
  }
}

function increment(index) {
  players[index].count++;
  document.getElementById(`playerCount${index}`).innerText = players[index].count;
}

async function finishGame() {
  document.getElementById('screen-game').style.display = 'none';
  document.getElementById('screen-results').style.display = 'block';

  const resultsContainer = document.getElementById('resultsList');
  resultsContainer.innerHTML = '';

  try {
    const response = await fetch('http://127.0.0.1:8000/results', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({results: players})
    });
    const data = await response.json();
    console.log('Resultados enviados:', data);
    //alert('Resultados salvos com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar resultados:', error);
    //alert('Erro ao salvar resultados no servidor.');
  }

  players.forEach(player => {
    const score = calculateScore(player);
    let textStyle = `color:${player.color}; font-weight:bold`;
    if (player.color.toLowerCase() === "#ffffff") { textStyle += "; text-shadow: 0 0 3px #000"; }
    const div = document.createElement('div');
    div.innerHTML = `<span style="${textStyle}">${player.name}:</span> ${score.toFixed(1)} pontos`;
    resultsContainer.appendChild(div);
  });
}

function restartGame() {
  numPlayers = 0;
  players = [];
  document.getElementById('screen-results').style.display = 'none';
  document.getElementById('screen-players-number').style.display = 'block';
  document.getElementById('numPlayers').value = '';
}

// ======= Listener da tecla Enter =======
document.addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    if (document.getElementById('screen-players-number').style.display !== 'none') {
      submitNumPlayers();
    } else if (document.getElementById('screen-players-info').style.display !== 'none') {
      startGame();
    } else if (document.getElementById('screen-results').style.display !== 'none') {
      restartGame();
    }
  }
});
