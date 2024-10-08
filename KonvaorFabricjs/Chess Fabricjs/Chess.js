// Initialize Fabric.js canvas
const canvas = new fabric.Canvas('canvas');
const squareSize = 75;
let turn = 'white'; // White goes first
const history = [];
let whiteTime = 300; // 5 minutes for each player
let blackTime = 300;
let timerInterval;

// Initialize timers
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (turn === 'white') {
            whiteTime--;
            updateTimerDisplay('white');
        } else {
            blackTime--;
            updateTimerDisplay('black');
        }
    }, 1000);
}

function updateTimerDisplay(color) {
    const timerElement = document.getElementById(`${color}-timer`);
    const time = color === 'white' ? whiteTime : blackTime;
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    timerElement.innerText = `${color.charAt(0).toUpperCase() + color.slice(1)}: ${minutes}:${seconds}`;
    if (time <= 0) {
        clearInterval(timerInterval);
        alert(`${color.charAt(0).toUpperCase() + color.slice(1)} time's up!`);
        if(color == "white")
        {
            whiteTime = 300;
        }
        else
        {
            blackTime = 300;
        }
        turn = turn === "white" ? "black" : "white";
        startTimer();
    }
}

// Create the chessboard
function createChessboard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const isLightSquare = (row + col) % 2 === 0;
            const square = new fabric.Rect({
                left: col * squareSize,
                top: row * squareSize,
                fill: isLightSquare ? '#eee' : '#8B4513',
                width: squareSize,
                height: squareSize,
                selectable: false
            });
            canvas.add(square);
        }
    }
}

// Load SVG pieces onto the chessboard
function addPieces() {
    const pieces = {
        'r': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
        'n': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
        'b': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
        'q': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
        'k': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
        'p': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
        'R': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
        'N': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
        'B': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
        'Q': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
        'K': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
        'P': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg'
    };

    const boardState = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['.', '.', '.', '.', '.', '.', '.', '.'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = boardState[row][col];
            if (piece !== '.') {
                fabric.loadSVGFromURL(pieces[piece], function(objects, options) {
                    const svgPiece = fabric.util.groupSVGElements(objects, options);
                    svgPiece.set({
                        left: col * squareSize + squareSize / 2,
                        top: row * squareSize + squareSize / 2,
                        originX: 'center',
                        originY: 'center',
                        hasControls: false,
                        selectable: true,
                        pieceColor: piece === piece.toUpperCase() ? 'white' : 'black',
                        originalLeft: col * squareSize + squareSize / 2,
                        originalTop: row * squareSize + squareSize / 2
                    });

                    svgPiece.on('mousedown', function() {
                        if (turn === this.pieceColor) {
                            this.set({ opacity: 0.5 });
                            canvas.setActiveObject(this);
                        }
                    });

                    svgPiece.on('mouseup', function() {
                        if (canvas.getActiveObject() === this) {
                            this.set({ opacity: 1 });
                        }
                    });

                    canvas.add(svgPiece);
                });
            }
        }
    }
}

// Enable piece dragging and snapping
canvas.on('object:modified', function(e) {
    const obj = e.target;
    if (obj && obj.pieceColor === turn) {
        obj.set({
            left: Math.round(obj.left / squareSize) * squareSize + squareSize / 2,
            top: Math.round(obj.top / squareSize) * squareSize + squareSize / 2
        });
        obj.setCoords();
        updateHistory(`${obj.pieceColor} moved to ${coordsToPosition(obj.left, obj.top)}`);
        turn = turn === 'white' ? 'black' : 'white'; // Switch turn
        startTimer(); // Restart timer for next turn
    } else if (obj) {
        obj.set({
            left: obj.originalLeft,
            top: obj.originalTop
        });
    }
    canvas.renderAll();
});

// Convert coordinates to position
function coordsToPosition(left, top) {
    const col = Math.floor(left / squareSize);
    const row = 8 - Math.floor(top / squareSize);
    return String.fromCharCode(col + 'a'.charCodeAt(0)) + row;
}

// Update move history
function updateHistory(move) {
    history.push(move);
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = history.join('<br/>');
}

// Move piece with keyboard
window.addEventListener('keydown', function(event) {
    if (event.key.match(/[a-h][1-8]/)) { // Check for valid square
        const from = prompt("Enter the piece's current position (e.g., e2):");
        if (from) {
            movePiece(from, event.key);
        }
    }
});

// Function to move piece based on input
function movePiece(from, to) {
    const piece = canvas.getActiveObject();
    if (!piece) return;

    const fromCoords = positionToCoords(from);
    const toCoords = positionToCoords(to);

    if (piece && piece.left === fromCoords.x && piece.top === fromCoords.y) {
        piece.set({
            left: toCoords.x,
            top: toCoords.y,
        });
        piece.setCoords();
        canvas.renderAll();
        updateHistory(`${piece.pieceColor} moves from ${from} to ${to}`);
        turn = turn === 'white' ? 'black' : 'white';
        startTimer(); // Restart timer for the next player
    }
}

// Convert position to coordinates
function positionToCoords(position) {
    const col = position.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 8 - parseInt(position[1]);
    return {
        x: col * squareSize + squareSize / 2,
        y: row * squareSize + squareSize / 2
    };
}

// Initialize chessboard, pieces, and timer
createChessboard();
addPieces();
startTimer();

