// main.js

const boardSize = 8; const cellSize = 50; let score = 0;

const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));

const pieceShapes = [ [[1]], [[1, 1]], [[1, 1, 1]], [[1], [1]], [[1], [1], [1]], [[1, 1], [1, 0]], // L-shape [[1, 0], [1, 1]], [[0, 1], [1, 1]], [[1, 1], [0, 1]] ];

const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f1c40f", "#9b59b6"];

const boardElement = document.getElementById("board"); const piecesElement = document.getElementById("pieces"); const scoreElement = document.getElementById("score"); const gameOverElement = document.getElementById("gameOver");

function createCell(x, y) { const cell = document.createElement("div"); cell.className = "cell"; cell.style.left = ${x * cellSize}px; cell.style.top = ${y * cellSize}px; return cell; }

function drawBoard() { boardElement.innerHTML = ""; for (let y = 0; y < boardSize; y++) { for (let x = 0; x < boardSize; x++) { const cell = createCell(x, y); if (board[y][x]) { cell.style.backgroundColor = board[y][x]; } boardElement.appendChild(cell); } } }

function canPlace(piece, posX, posY) { for (let y = 0; y < piece.length; y++) { for (let x = 0; x < piece[0].length; x++) { if (piece[y][x]) { if ( posY + y >= boardSize || posX + x >= boardSize || board[posY + y][posX + x] ) { return false; } } } } return true; }

function placePiece(piece, posX, posY, color) { for (let y = 0; y < piece.length; y++) { for (let x = 0; x < piece[0].length; x++) { if (piece[y][x]) { board[posY + y][posX + x] = color; } } } clearLines(); }

function clearLines() { let linesCleared = 0; for (let y = 0; y < boardSize; y++) { if (board[y].every(cell => cell)) { board[y] = Array(boardSize).fill(null); linesCleared++; } } if (linesCleared > 0) { score += linesCleared * 10; scoreElement.textContent = Score: ${score}; } }

function generatePiece() { const shape = pieceShapes[Math.floor(Math.random() * pieceShapes.length)]; const color = colors[Math.floor(Math.random() * colors.length)]; return { shape, color }; }

function spawnPieces() { piecesElement.innerHTML = ""; for (let i = 0; i < 3; i++) { const pieceObj = generatePiece(); const wrapper = document.createElement("div"); wrapper.className = "piece"; wrapper.draggable = true; wrapper.dataset.shape = JSON.stringify(pieceObj.shape); wrapper.dataset.color = pieceObj.color; pieceObj.shape.forEach((row, y) => { row.forEach((val, x) => { if (val) { const block = document.createElement("div"); block.className = "block"; block.style.left = ${x * 20}px; block.style.top = ${y * 20}px; block.style.backgroundColor = pieceObj.color; wrapper.appendChild(block); } }); }); piecesElement.appendChild(wrapper); } }

function checkGameOver() { const pieces = document.querySelectorAll(".piece"); for (const pieceEl of pieces) { const shape = JSON.parse(pieceEl.dataset.shape); for (let y = 0; y < boardSize; y++) { for (let x = 0; x < boardSize; x++) { if (canPlace(shape, x, y)) { return false; } } } } return true; }

// Drag & Drop events boardElement.addEventListener("dragover", e => e.preventDefault());

boardElement.addEventListener("drop", e => { const rect = boardElement.getBoundingClientRect(); const x = Math.floor((e.clientX - rect.left) / cellSize); const y = Math.floor((e.clientY - rect.top) / cellSize);

const pieceEl = document.querySelector(".dragging"); if (!pieceEl) return;

const shape = JSON.parse(pieceEl.dataset.shape); const color = pieceEl.dataset.color;

if (canPlace(shape, x, y)) { placePiece(shape, x, y, color); pieceEl.remove(); if (checkGameOver()) { gameOverElement.style.display = "block"; } } drawBoard(); });

piecesElement.addEventListener("dragstart", e => { if (e.target.classList.contains("piece")) { e.target.classList.add("dragging"); } });

piecesElement.addEventListener("dragend", e => { if (e.target.classList.contains("piece")) { e.target.classList.remove("dragging"); } });

drawBoard(); spawnPieces();

