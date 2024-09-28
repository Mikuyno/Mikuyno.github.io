
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

    const GameCords = [
      [' A 8', ' B 8', ' C 8', ' D 8', ' E 8', ' F 8', ' G 8', ' H 8'],
      [' A 7', ' B 7', ' C 7', ' D 7', ' E 7', ' F 7', ' G 7', ' H 7'],
      [' A 6', ' B 6', ' C 6', ' D 6', ' E 6', ' F 6', ' G 6', ' H 6'],
      [' A 5', ' B 5', ' C 5', ' D 5', ' E 5', ' F 5', ' G 5', ' H 5'],
      [' A 4', ' B 4', ' C 4', ' D 4', ' E 4', ' F 4', ' G 4', ' H 4'],
      [' A 3', ' B 3', ' C 3', ' D 3', ' E 3', ' F 3', ' G 3', ' H 3'],
      [' A 2', ' B 2', ' C 2', ' D 2', ' E 2', ' F 2', ' G 2', ' H 2'],
      [' A 1', ' B 1', ' C 1', ' D 1', ' E 1', ' F 1', ' G 1', ' H 1']
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

    function TurnTrack ({turn})
    {
      const TrackerStyle =
      {
        marginBottom: "20px",
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
      };

      return(
        <div style = {TrackerStyle}>
          Current Turn: {turn.charAt(0).toUpperCase() + turn.slice(1)}
        </div>
      )
    }

    function PathCheck (game, selectedrow, selectedcol, row, col)
    {
      const rowDir = Math.sign(row - selectedrow);
      const colDir = Math.sign(col - selectedcol);

      let currentRow = selectedrow + rowDir;
      let currentCol = selectedcol + colDir;

      while(currentRow != row || currentCol != col)
      {
        if(game[currentRow][currentCol] != "")
        {
          return false;
        }
        currentRow += rowDir;
        currentCol += colDir;
      }
       
      return true;
    }



    function Game() {

      const [game, setGame] = React.useState(initialGameState);
      const [selectedSquare, setSelectedSquare] = React.useState(null);
      const [turn, setTurn] = React.useState(initialTurn);
      const [GameState, setGameState] = React.useState("running");
      const [Started, setStarted] = React.useState(false);
      const [Speaking, setSpeaking] = React.useState(false);
      

      return (
        <div>
          <TurnTrack turn={turn} />
          <Board game={game} onSquareClick={handleClick} selectedSquare={selectedSquare} Started={Started}/>
          {!Started ? (
            <button onClick={() => {start();speak("Started", Speaking);}}>Start Game</button>
          ) : (<button onClick ={() => {restart(); speak("Restarted", Speaking);}}>Restart Game</button>
          )}
          <button onClick={speech}>Text-to-Speech toggle</button>
        </div>
      );

      function start()
      {
        setStarted(true);
      }

      function restart()
      {
        setGame(initialGameState);
        setSelectedSquare(null);
        setTurn(initialTurn);
        setStarted(true);
        setGameState("running")

      }

      function speak(sentence, Speaking)
      {
        if (Speaking === false)
        {
          return;
        }
        const utterance = new SpeechSynthesisUtterance(sentence);
        
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices[0];
        
        window.speechSynthesis.speak(utterance);
      }

      function speech()
      {
        if(Speaking === true)
        {
          speak("Text to speech off", Speaking);
          setSpeaking(false);
          return;
        }
        else
        {
          speak("Text to Speech on", true);
          setSpeaking(true);
        }
      }


      // Handle square click for moving pieces
      function handleValidation(game, selectedrow, selectedcol, row, col, turn)
      {
          const piece = game[selectedrow][selectedcol];
          const selected = game[row][col];

          if (turn == "white" && piece == piece.toLowerCase())
          {
            return false;
          }
          if(turn == "black" && piece == piece.toUpperCase())
          {
            return false;
          }

          if(selected != '')
          {
            if(turn=="white")
            {
              if(selected == selected.toUpperCase())
              {
                return false;
              }
            }
            if (turn == "black")
            {
              if(selected == selected.toLowerCase())
              {
                return false;
              }
            }
            
          }

          

          switch(piece)
          {
              case "p":
              case "P":
                if(piece == "p" && selectedrow == 1)
                {
                  if((selectedrow == row - 1 && selectedcol == col) || (selectedrow == row - 2 && selectedcol == col))
                  {
                    if(selected == '')
                    {
                      return true;
                    }
                  }
                  else if(selectedrow == row - 1 && (selectedcol == col + 1 || selectedcol == col-1))
                  {
                    if(selected == selected.toUpperCase(selected))
                    {
                      return true;
                    }
                  }
                }
                else if (piece== "p" && selectedrow == row - 1 && selectedcol == col)
                {
                  if(selected == '')
                    {
                      return true;
                    }
        
                }
                else if (piece =="p" && selectedrow == row - 1 && (selectedcol == col + 1 || selectedcol == col-1))
                  {
                    if (selected == selected.toUpperCase(selected))
                    {
                      return true;
                    }
                  }

                if(piece == "P" && selectedrow == 6)
                  {
                    if((selectedrow == row + 1 && selectedcol == col) || (selectedrow == row + 2 && selectedcol == col))
                    {
                      if(selected == '')
                        {
                          return true;
                        }
                    }
                    else if(selectedrow == row + 1 && (selectedcol == col + 1 || selectedcol == col-1))
                    {
                      if(selected == selected.toLowerCase(selected) && selected != '')
                      {
                        return true;
                      }
                    }
                  }
                else if (piece== "P" && selectedrow == row + 1 && selectedcol == col)
                {
                  if(selected == '')
                    {
                      return true;
                    }
                }
                else if (piece =="P" && selectedrow == row + 1 && (selectedcol == col +1 || selectedcol == col-1))
                {
                  if (selected == selected.toLowerCase(selected) && selected != '')
                  {
                    return true;
                  }
                }
                break;

              case "r":
              case "R":
                if(row >=0 && row <=7 && selectedcol == col && PathCheck(game,selectedrow, selectedcol, row, col))
                {
                  return true;
                }

                if(col >=0 && col <=7 && selectedrow == row && PathCheck(game,selectedrow, selectedcol, row, col))
                {
                  return true;
                }
                break;

                case "k":
                case "K":
                if((selectedrow == row+1 || selectedrow == row-1 || selectedrow == row) && (selectedcol == col+1 || selectedcol == col-1 || selectedcol == col))
                {
                  return true;
                }
                break;

                case "b":
                case "B":
                if(Math.abs(selectedrow - row) === Math.abs(selectedcol-col) && PathCheck(game,selectedrow, selectedcol, row, col))
                {
                  return true;
                }

                case "n":
                case "N":
                if(((selectedcol === col +1 || selectedcol === col -1) && (selectedrow === row +2 || selectedrow === row -2 ) || (selectedrow === row +1 || selectedrow === row -1) && (selectedcol === col +2 || selectedcol === col -2)) )
                {
                  return true;
                }
                break;

                case "q":
                case "Q":
                if((((row >=0 && row <=7 && selectedcol == col)||(col >=0 && col <=7 && selectedrow == row)) || ((selectedrow == row+1 || selectedrow == row-1 || selectedrow == row) && (selectedcol == col+1 || selectedcol == col-1 || selectedcol == col)) || (Math.abs(selectedrow - row) === Math.abs(selectedcol-col))) && PathCheck(game,selectedrow, selectedcol, row, col))
                {
                  return true;
                }
                break;
          }
      }

      function KingCaptured (game, color)
      {
        const king = color === "white" ? "K" : "k"
        for(let row = 0; row < game.length; row++)
        {
          for(let col= 0; col < game[row].length; col++)
          {
            if(game[row][col]== king)
            {
              return;
            }
          }
        }
        setGameState("checkmate")
        speak(color== "white" ? "Checkmate. Black Wins!!" : "Checkmate. White Wins!!", Speaking)
        alert(color== "white" ? "Checkmate. Black Wins!!" : "Checkmate. White Wins!!")
        return;
      }
    
      function handleClick(row, col) {
        if(GameState=="checkmate" || !Started)
        {
          return;
        }
        if (selectedSquare) {
          const newGame = game.map(row => row.slice());
          const [selectedRow, selectedCol] = selectedSquare;
          const nextTurn = (turn == "white" ? "black" : "white");

          const ValidMove = handleValidation(game, selectedRow, selectedCol, row, col, turn)

          if(ValidMove)
          {
            // Move the piece to the new location
            newGame[row][col] = newGame[selectedRow][selectedCol];
            newGame[selectedRow][selectedCol] = '';
            setGame(newGame);
            KingCaptured(newGame, nextTurn)
            setSelectedSquare(null);
            setTurn(nextTurn);
            switch(game[selectedRow][selectedCol]) {
              case 'p':
                speak("Moved selected Black Pawn to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'P':
                speak("Moved selected White Pawn to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'q':
                speak("Moved selected Black Queen to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'Q':
                speak("Moved selected White Queen to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'r':
                speak("Moved selected Black Rook to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'R':
                speak("Moved selected White Rook to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'k':
                speak("Moved selected Black King to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'K':
                speak("Moved selected White King to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'n':
                speak("Moved selected Black Knight to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'N':
                speak("Moved selected White Knight to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'b':
                speak("Moved selected Black Bishop to ".concat(GameCords[row][col]), Speaking);
                break;
              case 'B':
                speak("Moved selected White Bishop to ".concat(GameCords[row][col]), Speaking);
                break;
            }
            
            
          }
          else if(game[selectedRow][selectedCol]== game[row][col])
          {
            setSelectedSquare(null);
            switch(game[row][col])
            {
              case 'p':
                speak("DeSelected Black Pawn on".concat(GameCords[row][col]), Speaking)
                break;
              case 'P':
                speak("DeSelected White Pawn on".concat(GameCords[row][col]), Speaking)
                break;
              case 'q':
                speak("DeSelected Black Queen on".concat(GameCords[row][col]), Speaking)
                break;
              case 'Q':
                speak("DeSelected White Queen on".concat(GameCords[row][col]), Speaking)
                break;
              case 'r':
                speak("DeSelected Black Rook on".concat(GameCords[row][col]), Speaking)
                break;
              case 'R':
                speak("DeSelected White Rook on".concat(GameCords[row][col]), Speaking)
                break;
              case 'k':
                speak("DeSelected Black King on".concat(GameCords[row][col]), Speaking)
                break;
              case 'K':
                speak("DeSelected White King on".concat(GameCords[row][col]), Speaking)
                break;
              case 'n':
                speak("DeSelected Black Knight on".concat(GameCords[row][col]), Speaking)
                break;
              case 'N':
                speak("DeSelected White Knight on".concat(GameCords[row][col]), Speaking)
                break;
              case 'b':
                speak("DeSelected Black Bishop on".concat(GameCords[row][col]), Speaking)
                break;
              case 'B':
                speak("DeSelected White Bishop on".concat(GameCords[row][col]), Speaking)
                break;
            }
          }
          else
          {
            speak("Invalid Move", Speaking)
            alert("Invalid Move!!!")
            setSelectedSquare(null);
          }
        }
        else {
          if (game[row][col]) {
            setSelectedSquare([row, col]);
            switch(game[row][col])
            {
              case 'p':
                speak("Selected Black Pawn on".concat(GameCords[row][col]), Speaking)
                break;
              case 'P':
                speak("Selected White Pawn on".concat(GameCords[row][col]), Speaking)
                break;
              case 'q':
                speak("Selected Black Queen on".concat(GameCords[row][col]), Speaking)
                break;
              case 'Q':
                speak("Selected White Queen on".concat(GameCords[row][col]), Speaking)
                break;
              case 'r':
                speak("Selected Black Rook on".concat(GameCords[row][col]), Speaking)
                break;
              case 'R':
                speak("Selected White Rook on".concat(GameCords[row][col]), Speaking)
                break;
              case 'k':
                speak("Selected Black King on".concat(GameCords[row][col]), Speaking)
                break;
              case 'K':
                speak("Selected White King on".concat(GameCords[row][col]), Speaking)
                break;
              case 'n':
                speak("Selected Black Knight on".concat(GameCords[row][col]), Speaking)
                break;
              case 'N':
                speak("Selected White Knight on".concat(GameCords[row][col]), Speaking)
                break;
              case 'b':
                speak("Selected Black Bishop on".concat(GameCords[row][col]), Speaking)
                break;
              case 'B':
                speak("Selected White Bishop on".concat(GameCords[row][col]), Speaking)
                break;
            }
          }
        }
      }

      return (
        <div>
          <Board game={game} onSquareClick={handleClick} selectedSquare={selectedSquare} Started={Started}/>
        </div>
      );
    }

    // View: Board and buttons reflecting the game state
    function Board({ game, onSquareClick, selectedSquare,Started }) {
      return (
        <div>


          {game.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
              {row.map((value, colIndex) => (
                <Square
                  key={colIndex}
                  value={value}
                  onClick={() => Started && onSquareClick(rowIndex, colIndex)}
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