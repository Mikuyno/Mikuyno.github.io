    // Model: Starting state of the chessboard in 2D array
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

    // Mapping of chess pieces to their respective image URLs
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

    function Game() {
      const [game, setGame] = React.useState(initialGameState);
      const [selectedSquare, setSelectedSquare] = React.useState(null);

      // Handle square click for moving pieces
      function handleClick(row, col) {
        if (selectedSquare) {
          const newGame = game.map(row => row.slice());
          const [selectedRow, selectedCol] = selectedSquare;

          // Move the piece to the new location
          newGame[row][col] = newGame[selectedRow][selectedCol];
          newGame[selectedRow][selectedCol] = '';
          setGame(newGame);
          setSelectedSquare(null);
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
        backgroundColor: isSelected ? '#ffeb3b' : (isLight ? '#f0d9b5' : '#b58863'),
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