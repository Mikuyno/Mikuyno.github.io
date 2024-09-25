
    const initialGameState = [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];

    const pieceImages = {
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

    const initialTurn = "white";

    function Game() {
      const [game, setGame] = React.useState(initialGameState);
      const [selectedSquare, setSelectedSquare] = React.useState(null);
      const [turn, setTurn] = React.useState(initialTurn)

      // Handle square click for moving pieces
      function handleValidation(game, selectedrow, selectedcol, row, col, turn)
      {
          const piece = game[selectedrow][selectedcol];

          if (turn == "white" && piece == piece.toLowerCase())
          {
            return false;
          }
          if(turn == "black" && piece == piece.toUpperCase())
          {
            return false;
          }

          switch(piece)
          {
              case "p":
              case "P":
                if(piece == "p" && selectedrow == 1)
                {
                  if((selectedrow == row - 1 && selectedcol == col) || (selectedrow == row - 2 && selectedcol == col))
                  {
                    return true;
                  }
                }
                else if (piece== "p" && selectedrow == row - 1 && selectedcol == col)
                {
                  return true;
                }
                if(piece == "P" && selectedrow == 6)
                  {
                    if((selectedrow == row + 1 && selectedcol == col) || (selectedrow == row + 2 && selectedcol == col))
                    {
                      return true;
                    }
                  }
                else if (piece== "P" && selectedrow == row + 1 && selectedcol == col)
                {
                  return true;
                }
                break;

              case "r":
              case "R":
                if(piece== "r" && row >=0 && row <=7 && selectedcol == col)
                {
                  return true;
                }
                if(piece== "r" && col >=0 && col <=7 && selectedrow == row)
                {
                  return true;
                }
                if(piece== "R" && row >=0 && row <=7 && selectedcol == col)
                {
                  return true;
                }
                if(piece== "R" && col >=0 && col <=7 && selectedrow == row)
                {
                  return true;
                }
                break;

                case "k":
                case "K":
                if(piece== "k" && (selectedrow == row+1 || selectedrow == row-1 || selectedrow == row) && (selectedcol == col+1 || selectedcol == col-1 || selectedcol == col))
                {
                  return true;
                }
                if(piece== "K" && (selectedrow == row+1 || selectedrow == row-1 ) && (selectedcol == col+1 || selectedcol == col-1 || selectedcol == col))
                {
                  return true;
                }
                break;

                case "b":
                case "B":
                if(piece== "b" && Math.abs(selectedrow - row) === Math.abs(selectedcol-col))
                {
                  return true;
                }
                if(piece== "B" && Math.abs(selectedrow - row) === Math.abs(selectedcol-col))
                {
                  return true;
                }
                break;

                case "n":
                case "N":
                if(piece== "n" && ((selectedcol === col +1 || selectedcol === col -1) && (selectedrow === row +2 || selectedrow === row -2 ) || (selectedrow === row +1 || selectedrow === row -1) && (selectedcol === col +2 || selectedcol === col -2)) )
                {
                  return true;
                }
                if(piece== "N" && ((selectedcol === col +1 || selectedcol === col -1) && (selectedrow === row +2 || selectedrow === row -2 ) || (selectedrow === row +1 || selectedrow === row -1) && (selectedcol === col +2 || selectedcol === col -2)))
                {
                  return true;
                }
                break;

                case "q":
                case "Q":
                if(piece== "q" && ((row >=0 && row <=7 && selectedcol == col)||(col >=0 && col <=7 && selectedrow == row)) || ((selectedrow == row+1 || selectedrow == row-1 || selectedrow == row) && (selectedcol == col+1 || selectedcol == col-1 || selectedcol == col)) || (Math.abs(selectedrow - row) === Math.abs(selectedcol-col)))
                {
                  return true;
                }
                if(piece== "Q" && ((row >=0 && row <=7 && selectedcol == col)||(col >=0 && col <=7 && selectedrow == row)) || ((selectedrow == row+1 || selectedrow == row-1 || selectedrow == row) && (selectedcol == col+1 || selectedcol == col-1 || selectedcol == col)) || (Math.abs(selectedrow - row) === Math.abs(selectedcol-col)))
                {
                  return true;
                }
                break;
          }
      }
      function handleClick(row, col) {
        if (selectedSquare) {
          const newGame = game.map(row => row.slice());
          const [selectedRow, selectedCol] = selectedSquare;

          const ValidMove = handleValidation(game, selectedRow, selectedCol, row, col, turn)

          if(ValidMove)
          {
          // Move the piece to the new location
          newGame[row][col] = newGame[selectedRow][selectedCol];
          newGame[selectedRow][selectedCol] = '';
          setGame(newGame);
          setSelectedSquare(null);
          setTurn(turn == "white" ? "black" : "white");
          }
          else
          {
            alert("Invalid Move!!!");
            setSelectedSquare(null);
          }
        } else {
          if (game[row][col]) {
            setSelectedSquare([row, col]);
          }
        }
      }

      return (
        <div>
          <Board game={game} onSquareClick={handleClick} selectedSquare={selectedSquare} />
        </div>
      );
    }

    // View: Board and buttons reflecting the game state
    function Board({ game, onSquareClick, selectedSquare }) {
      return (
        <div>
          {game.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
              {row.map((value, colIndex) => (
                <Square
                  key={colIndex}
                  value={value}
                  onClick={() => onSquareClick(rowIndex, colIndex)}
                  isLight={(rowIndex + colIndex) % 2 === 0}
                  isSelected={selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex}
                />
              ))}
            </div>
          ))}
        </div>
      );
    }

    function Square({ value, onClick, isLight, isSelected }) {
      const squareStyle = {
        width: '80px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        backgroundColor: isSelected ? '#ffeb3b' : (isLight ? 'tomato' : 'grey'),
        border: '1px solid #999'
      };

      // Display the piece image or an empty square
      const pieceDisplay = () => {
        if (value) {
          return <img src={pieceImages[value]} alt={value} style={{ width: '70px', height: '70px' }} />;
        }
        return null;
      };

      return (
        <button style={squareStyle} onClick={onClick}>
          {pieceDisplay()}
        </button>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<Game />);