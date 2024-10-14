// Initialize Fabric.js canvas
const canvas = new fabric.Canvas('canvas');
const squareSize = 75;
let turn = 'white'; // White goes first
const history = [];
let whiteTime = 300; // 5 minutes for each player
let blackTime = 300;
let timerInterval;
let Started = false;

document.addEventListener("DOMContentLoaded", function(){
    Move = document.getElementById("Move");
});

function startGame()
{
    if(Started)
    {
        return;
    }
    Started = true;
    // Initialize chessboard, pieces, and timer
    createChessboard();
    addPieces();
    startTimer();
}

function restartGame()
{
    canvas.clear();
    turn = "white"
    whiteTime = 300;
    blackTime = 300;
    clearInterval(timerInterval);
    Started = false;

    history.length = 0;
    document.getElementById("history").innerHTML = ''

    document.getElementById("white-timer").innerHTML = 'White: 00:00'
    document.getElementById("black-timer").innerHTML = 'Black: 00:00'

    startGame();
}

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
        declareWinner(color === "white" ? "black" : "white");
    }
}

function declareWinner(winnerColor)
{
    alert(`${winnerColor.charAt(0).toUpperCase() + winnerColor.slice(1)} wins!`);

    canvas.forEachObject((obj) => {
        obj.selectable = false;

    });
}

// Create the chessboard
function createChessboard() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const isLightSquare = (row + col) % 2 === 0;
            const square = new fabric.Rect({
                left: col * squareSize,
                top: row * squareSize,
                fill: isLightSquare ? 'aliceblue' : 'purple',
                width: squareSize,
                height: squareSize,
                selectable: false
            });
            canvas.add(square);
        }
    }
}

function getPieceatPosition(row, col)
{
    let left_target = col * squareSize + squareSize/2;
    let top_target = row * squareSize + squareSize/2;
    let target_piece = null;

    canvas.forEachObject((obj) => 
    {
        if(obj.type && obj.left === left_target && obj.top === top_target)
        {
            target_piece = obj;
        }
    })

    return target_piece;
}

function PathCheck(fromrow, fromcol, torow, tocol)
{
    let notBlocked = true;

    const rowDir = Math.sign(torow - fromrow);
    const colDir = Math.sign(tocol - fromcol);

    if(fromrow === torow || fromcol === tocol)
    {
        let currentrow = fromrow + rowDir;
        let currentcol = fromcol + colDir;

        while(currentrow != torow || currentcol != tocol)
        {
            if(getPieceatPosition(currentrow, currentcol))
            {
                notBlocked = false;
                break;
            }
            currentcol += colDir;
            currentrow += rowDir;
        }
    }
    else if(Math.abs(fromrow - torow) === Math.abs(fromcol - tocol))
    {
        let currentrow = fromrow + rowDir;
        let currentcol = fromcol + colDir;

        while(currentrow != torow && currentcol != tocol)
        {
            if(getPieceatPosition(currentrow, currentcol))
            {
                notBlocked = false;
                break;
            }
            currentcol += colDir;
            currentrow += rowDir;
        }
    }
    
    return notBlocked;
}

function MoveValidation(piece, fromrow, fromcol, torow, tocol,turn)
{
    pieceType = piece.type;
    targetPiece = getPieceatPosition(torow, tocol);
    
    if (targetPiece && targetPiece.pieceColor === turn)
    {
        return false;
    }


    switch(pieceType)
    {
        case "P":
            if(fromrow === 6)
            {
                if(fromcol === tocol && (fromrow - 1 === torow || fromrow - 2 === torow))
                {
                    if(targetPiece)
                    {
                        return false;
                    }
                    else
                    {
                        return PathCheck(fromrow,fromcol,torow,tocol);
                    }  
                } 
            }
            else
            {
                if(fromcol === tocol && fromrow - 1 === torow)
                {
                    if(targetPiece)
                    {
                        return false
                        
                    }
                    else
                    {
                        return true;
                    
                    } 
                } 
                else if (Math.abs(tocol - fromcol) === 1 && fromrow - 1 === torow && targetPiece)
                {
                    if(targetPiece.pieceColor != turn)
                    {
                        return true;
                    }
                }  
            }
            break;
        case "p":
            if(fromrow === 1)
            {
                if(fromcol === tocol && (fromrow + 1 === torow || fromrow + 2 === torow))
                {
                    if(targetPiece)
                    {
                        return false
                    }
                    else
                    {
                        return PathCheck(fromrow,fromcol,torow,tocol);
                    }  
                } 
            }
            else
            {
                if(fromcol === tocol && fromrow + 1 === torow)
                {
                    if(targetPiece)
                    {
                        return false
                    }
                    else
                    {
                        return true;
                    }  
                }
                else if (Math.abs(tocol - fromcol) === 1 && fromrow + 1 === torow && targetPiece)
                {
                    if(targetPiece.pieceColor != turn)
                    {
                        return true;
                    }
                } 
            }
            break;
        case "R":
        case "r":
            if((torow >=0 && torow <=7 && fromcol === tocol) || (tocol >=0 && tocol <=7 && fromrow === torow))
                return PathCheck(fromrow, fromcol, torow, tocol);
                break;
        case "k":
        case "K":
            if((torow == fromrow+1 || torow == fromrow-1 || torow == fromrow) && (tocol == fromcol+1 || tocol == fromcol-1 || tocol == fromcol))
                return true;
                break;
        case "B":
        case "b":
            if(Math.abs(torow - fromrow) === Math.abs(tocol-fromcol))
                return PathCheck(fromrow, fromcol, torow, tocol);
                break;
        case "Q":
        case "q":
            if(((torow >=0 && torow <=7 && fromcol === tocol) || (tocol >=0 && tocol <=7 && fromrow === torow)) || ((torow == fromrow+1 || torow == fromrow-1 || torow == fromrow) && (tocol == fromcol+1 || tocol == fromcol-1 || tocol == fromcol)) || (Math.abs(torow - fromrow) === Math.abs(tocol-fromcol)))
                return PathCheck(fromrow, fromcol, torow, tocol);
                break;
        case "N":
        case "n":
            if(((tocol === fromcol +1 || tocol === fromcol -1) && (torow === fromrow +2 || torow === fromrow -2 ) || (torow === fromrow +1 || torow === fromrow -1) && (tocol === fromcol +2 || tocol === fromcol -2)))
                return true;
                break;
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

    function piecestoreal(piece)
    {
        switch(piece)
        {
            case "P":
            case "p":
                return "pawn"
            case "R":
            case "r":
                return "rook"     
            case "K":
            case "k":
                return "king"
            case "Q":
            case "q":
                return "queen"  
            case "B":  
            case "b":
                return "bishop"    
            case "N":
            case "n":
                return "knight"
        }

    }



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
                        originalTop: row * squareSize + squareSize / 2,
                        type: piece,
                        Real_piece: piecestoreal(piece)

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

    /*console.log("Object modified:", obj);
    console.log("Original position:", obj.originalLeft, obj.originalTop);
    console.log("New position:", obj.left, obj.top);*/
    if (obj && obj.pieceColor === turn) {

        let nLeft = Math.round(obj.left / squareSize) * squareSize + squareSize / 2;
        let nTop = Math.round(obj.top / squareSize) * squareSize + squareSize / 2;

        let minleft = 0 + squareSize/2;
        let maxleft = 7 * squareSize + squareSize/2;
        let mintop = 0 + squareSize/2;
        let maxtop= 7 * squareSize + squareSize/2;

        let fromrow = Math.floor(obj.originalTop/squareSize);
        let fromcol = Math.floor(obj.originalLeft/squareSize);
        let torow = Math.floor(nTop/squareSize);
        let tocol = Math.floor(nLeft/squareSize);

        toPiece = getPieceatPosition(torow, tocol);

        //console.log(`Checking bounds: ${nLeft}, ${nTop}`);

        console.log(`${fromcol}, ${tocol}, ${fromrow}, ${torow}`)
        

        if (nLeft < minleft || nLeft > maxleft || nTop < mintop || nTop > maxtop) {
            //console.log("Move out of bounds. Resetting position.");
            obj.set({
                left: obj.originalLeft,
                top: obj.originalTop,
                selectable: true
            });
            canvas.setActiveObject(obj);
        } 
        else if(!MoveValidation(obj, fromrow, fromcol, torow, tocol, turn))
        {
            alert("Invalid Move.");
            obj.set({
                left: obj.originalLeft,
                top: obj.originalTop,
                selectable: true
            });
        }
        else 
        {
            obj.set({
                left: nLeft,
                top: nTop
            });
            if(nLeft != obj.originalLeft || nTop != obj.originalTop) {
                console.log("Valid move. Updating position.");
                if(toPiece)  
                {
                    if(toPiece.type === "K" || toPiece.type === "k")
                    {
                        Move.play();
                        updateHistory(`${obj.pieceColor} ${obj.Real_piece} captured ${toPiece.pieceColor}'s king.`);
                        canvas.remove(toPiece);
                        declareWinner(obj.pieceColor);
                    }
                    else
                    {
                        Move.play();
                        updateHistory(`${obj.pieceColor} ${obj.Real_piece} captured ${toPiece.pieceColor}'s ${toPiece.Real_piece} at ${coordsToPosition(nLeft, nTop)}`);
                        canvas.remove(toPiece);
                        turn = turn === 'white' ? 'black' : 'white'; // Switch turn
                        startTimer(); // Restart timer for next turn
                    }
                }
                else
                {
                    Move.play();
                    updateHistory(`${obj.pieceColor} ${obj.Real_piece} moved to ${coordsToPosition(nLeft, nTop)}`);
                    turn = turn === 'white' ? 'black' : 'white'; // Switch turn
                    startTimer(); // Restart timer for next turn
                }

            }
            else
            {
                obj.set({
                    selectable: true
                });
            }

            obj.originalLeft = nLeft;
            obj.originalTop = nTop;
        }
    } 
    else if (obj) 
    {
        //console.log("Invalid move. Resetting to original position.");
        obj.set({
            left: obj.originalLeft,
            top: obj.originalTop,
            selectable: true
        });
        canvas.setActiveObject(obj);
        obj.setCoords();
    }
    obj.setCoords();
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

// Convert position to coordinates
function positionToCoords(position) {
    const col = position.charCodeAt(0) - 'a'.charCodeAt(0);
    const row = 7 - parseInt(position[1]);
    return {
        x: col * squareSize + squareSize / 2,
        y: row * squareSize + squareSize / 2
    };
}





