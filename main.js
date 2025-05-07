const board = document.getElementById("board"); const piecesContainer = document.getElementById("pieces"); const scoreDisplay = document.getElementById("score"); const gameOverText = document.getElementById("gameOver"); let boardMatrix = []; let score = 0;

const colors = ["#e91e63", "#00bcd4", "#4caf50", "#ffc107", "#9c27b0"];

function createBoard() { boardMatrix = Array.from({ length: 8 }, () => Array(8).fill(0)); board.innerHTML = ""; for (let y = 0; y < 8; y++) { for (let x = 0; x < 8; x++) { const cell = document.createElement("div"); cell.className = "cell"; board.appendChild(cell); } } }

function drawBoard() { const cells = board.querySelectorAll(".cell"); for (let y = 0; y < 8; y++) { for (let x = 0; x < 8; x++) { const index = y * 8 + x; cells[index].classList.toggle("filled", boardMatrix[y][x] !== 0); cells[index].style.backgroundColor = boardMatrix[y][x] ? boardMatrix[y][x] : "#555"; } } }

const pieceShapes = [ [[1]], [[1, 1]], [[1, 1, 1]], [[1], [1], [1], [1]], [[1, 0], [1, 0], [1, 1]] ];

function generatePiece() { const shape = pieceShapes[Math.floor(Math.random() * pieceShapes.length)]; const color = colors[Math.floor(Math.random() * colors.length)]; return { shape, color }; }

function renderPieces() { piecesContainer.innerHTML = ""; for (let i = 0; i < 3; i++) { const { shape, color } = generatePiece(); const piece = document.createElement("div"); piece.className = "piece"; piece.dataset.shape = JSON.stringify(shape); piece.dataset.color = color; shape.forEach((row, y) => { row.forEach((block, x) => { if (block) { const div = document.createElement("div"); div.className = "block"; div.style.backgroundColor = color; div.dataset.x = x; div.dataset.y = y; piece.appendChild(div); } else { const div = document.createElement("div"); div.style.width = "40px"; div.style.height = "40px"; piece.appendChild(div); } }); }); piece.draggable = true; piece.addEventListener("dragstart", dragStart); piecesContainer.appendChild(piece); } }

function dragStart(e) { e.dataTransfer.setData("shape", e.target.dataset.shape); e.dataTransfer.setData("color", e.target.dataset.color); }

board.addEventListener("dragover", (e) => e.preventDefault());

board.addEventListener("drop", (e) => { const rect = board.getBoundingClientRect(); const x = Math.floor((e.clientX - rect.left) / 42); const y = Math.floor((e.clientY - rect.top) / 42); const shape = JSON.parse(e.dataTransfer.getData("shape")); const color = e.dataTransfer.getData("color"); if (placePiece(x, y, shape, color)) { removeFullLines(); drawBoard(); renderPieces(); if (!canPlaceAnyPiece()) { gameOver(); } } });

function placePiece(px, py, shape, color) { for (let y = 0; y < shape.length; y++) { for (let x = 0; x < shape[0].length; x++) { if (shape[y][x]) { if ( py + y >= 8 || px + x >= 8 || boardMatrix[py + y][px + x] !== 0 ) { return false; } } } }

for (let y = 0; y < shape.length; y++) { for (let x = 0; x < shape[0].length; x++) { if (shape[y][x]) { boardMatrix[py + y][px + x] = color; } } } return true; }

function removeFullLines() { for (let y = 0; y < 8; y++) { if (boardMatrix[y].every(cell => cell !== 0)) { boardMatrix[y] = Array(8).fill(0); score += 10; } } for (let x = 0; x < 8; x++) { if (boardMatrix.every(row => row[x] !== 0)) { for (let y = 0; y < 8; y++) { boardMatrix[y][x] = 0; } score += 10; } } scoreDisplay.textContent = Score: ${score}; }

function canPlaceAnyPiece() { const pieces = document.querySelectorAll(".piece"); for (let piece of pieces) { const shape = JSON.parse(piece.dataset.shape); for (let y = 0; y <= 8 - shape.length; y++) { for (let x = 0; x <= 8 - shape[0].length; x++) { if (canPlace(x, y, shape)) return true; } } } return false; }

function canPlace(px, py, shape) { for (let y = 0; y < shape.length; y++) { for (let x = 0; x < shape[0].length; x++) { if (shape[y][x]) { if ( py + y >= 8 || px + x >= 8 || boardMatrix[py + y][px + x] !== 0 ) { return false; } } } } return true; }

function gameOver() { gameOverText.style.display = "block"; }

createBoard(); drawBoard(); renderPieces();

