 // Initialize Fabric.js canvas
 const canvas = new fabric.Canvas('canvas');

 // Size of each square
 const squareSize = 75;

 // Chess piece colors and turn handling
 let turn = 'white'; // White goes first

 // Create the chessboard
 function createChessboard() {
     for (let row = 0; row < 8; row++) {
         for (let col = 0; col < 8; col++) {
             const isLightSquare = (row + col) % 2 === 0;
             const square = new fabric.Rect({
                 left: col * squareSize,
                 top: row * squareSize,
                 fill: isLightSquare ? '#eee' : '#8B4513', // Dark brown for dark squares
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
                 // Load the SVG piece
                 fabric.loadSVGFromURL(pieces[piece], function(objects, options) {
                     const svgPiece = fabric.util.groupSVGElements(objects, options);
                     svgPiece.set({
                         left: col * squareSize + squareSize / 2,
                         top: row * squareSize + squareSize / 2,
                         originX: 'center',
                         originY: 'center',
                         hasControls: false,
                         selectable: true, // Pieces are selectable
                         pieceColor: piece === piece.toUpperCase() ? 'white' : 'black', // Track the piece color
                         originalLeft: col * squareSize + squareSize/2,
                         originalTop: row * squareSize + squareSize/2
                     });
                     svgPiece.on('mousedown', function() {
                         if (turn == this.pieceColor)
                         {
                             this.set({ opacity: 0.5});
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

 // Initialize the chessboard and add the pieces
 createChessboard();
 addPieces();

 // Enable piece dragging
 canvas.on('object:modified', function(e) {
     const obj = e.target;
     if(obj && obj.pieceColor == turn)
     {
        obj.set({
             left: Math.round(obj.left / squareSize) * squareSize + squareSize / 2,
             top: Math.round(obj.top / squareSize) * squareSize + squareSize / 2
     
     
        })
        turn = turn == "white" ? "black" : "white";
    }
    else if (obj)
    {
        obj.set({
            left: obj.originalLeft,
            top: obj.originalTop
        })
    };
    canvas.renderAll();
 });