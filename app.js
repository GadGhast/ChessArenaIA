// Equipos
const teams = [
  { name: "Lewison", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "GadGhast", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "LardGhast", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "Luisón", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "Carlsen", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "Nakamura", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "Gascón", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "Gukesh", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "Rey Enigma", points: 0, wins: 0, draws: 0, losses: 0 },
  { name: "ReyDama", points: 0, wins: 0, draws: 0, losses: 0 },
];

let chess = new Chess();
let board = null;
let currentWhite = null;
let currentBlack = null;

const historyEl = document.getElementById("history");
const currentMatchEl = document.getElementById("current-match");
const standingsBody = document.querySelector("#standings tbody");

function updateStandings() {
  teams.sort((a, b) => b.points - a.points);
  standingsBody.innerHTML = teams
    .map(
      (t) => `
    <tr>
      <td>${t.name}</td>
      <td>${t.points.toFixed(1)}</td>
      <td>${t.wins}</td>
      <td>${t.draws}</td>
      <td>${t.losses}</td>
    </tr>`
    )
    .join("");
}

function selectRandomTeams() {
  let white, black;
  do {
    white = teams[Math.floor(Math.random() * teams.length)];
    black = teams[Math.floor(Math.random() * teams.length)];
  } while (white === black);
  return [white, black];
}

function startNewGame() {
  chess.reset();
  board.start();

  [currentWhite, currentBlack] = selectRandomTeams();
  currentMatchEl.textContent = `${currentWhite.name} vs ${currentBlack.name}`;
  
  makeBotMove();
}

function makeBotMove() {
  if (chess.game_over()) {
    endGame();
    return;
  }
  // Movimiento aleatorio para simplificar (en lugar de motor)
  const moves = chess.moves();
  const move = moves[Math.floor(Math.random() * moves.length)];
  chess.move(move);
  board.position(chess.fen());

  if (chess.game_over()) {
    endGame();
  } else {
    // Turno siguiente después de 1 segundo
    setTimeout(makeBotMove, 1000);
  }
}

function endGame() {
  let resultText = "";
  if (chess.in_checkmate()) {
    const winnerIsWhite = chess.turn() === "b"; // Turno indica quien pierde
    const winner = winnerIsWhite ? currentWhite : currentBlack;
    const loser = winnerIsWhite ? currentBlack : currentWhite;

    winner.wins++;
    winner.points += 1;
    loser.losses++;

    resultText = `${winner.name} 1-0 ${loser.name}`;
  } else if (
    chess.in_draw() ||
    chess.in_stalemate() ||
    chess.in_threefold_repetition() ||
    chess.insufficient_material()
  ) {
    currentWhite.draws++;
    currentWhite.points += 0.5;
    currentBlack.draws++;
    currentBlack.points += 0.5;

    resultText = `${currentWhite.name} 0.5-0.5 ${currentBlack.name}`;
  } else {
    resultText = `Partida entre ${currentWhite.name} y ${currentBlack.name} finalizó`;
  }

  historyEl.innerHTML = `<li>${resultText}</li>` + historyEl.innerHTML;
  updateStandings();

  setTimeout(() => {
    startNewGame();
  }, 2000);
}

window.onload = () => {
  board = Chessboard("chess-board", {
    draggable: false,
    position: "start",
    pieceTheme: "img/chesspieces/wikipedia/{piece}.png",
  });
  updateStandings();
  startNewGame();
};
