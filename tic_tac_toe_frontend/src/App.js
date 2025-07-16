import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Colors and minimal styling are defined in App.css using :root variables.
 * We'll override board/game style here via inline styles for required palette.
 */

const COLORS = {
  primary: "#1976d2",    // X
  accent: "#fbc02d",     // O
  secondary: "#424242",  // Grid and border
  bg: "#ffffff",
  lightBorder: "#e9ecef",
};

const emptyBoard = () => Array(9).fill(null);

// PUBLIC_INTERFACE
function App() {
  // "None" until user picks, then "X" or "O"
  const [userSymbol, setUserSymbol] = useState(null);
  // "X" always goes first
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [board, setBoard] = useState(emptyBoard());
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [moveCount, setMoveCount] = useState(0);
  // "Easy" by default—can be "Easy" | "Medium" | "Hard"
  const [difficulty, setDifficulty] = useState("Easy");

  // PUBLIC_INTERFACE
  function handleDifficultyChange(level) {
    setDifficulty(level);
    // On changing difficulty, also reset pre-game
    setUserSymbol(null);
    setCurrentPlayer("X");
    setBoard(emptyBoard());
    setWinnerInfo(null);
    setMoveCount(0);
  }

  // PUBLIC_INTERFACE
  function restartGame() {
    setUserSymbol(null);
    setCurrentPlayer("X");
    setBoard(emptyBoard());
    setWinnerInfo(null);
    setMoveCount(0);
    // Difficulty remains as last selected
  }

  // PUBLIC_INTERFACE
  function startGameAs(symbol) {
    setUserSymbol(symbol);
    setCurrentPlayer("X"); // X always starts
    setBoard(emptyBoard());
    setWinnerInfo(null);
    setMoveCount(0);
    // Use selected difficulty
  }

  // Check for winner on every board change
  useEffect(() => {
    const winResult = calculateWinner(board);
    setWinnerInfo(winResult);
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(index) {
    if (board[index] !== null || winnerInfo) return; // Occupied or game over
    const nextBoard = board.slice();
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    setMoveCount(moveCount + 1);
  }

  // PUBLIC_INTERFACE
  function renderSquare(i) {
    const value = board[i];
    let color = COLORS.secondary;
    if (value === "X") color = COLORS.primary;
    if (value === "O") color = COLORS.accent;
    return (
      <button
        className="ttt-square"
        onClick={() => handleSquareClick(i)}
        style={{
          color,
          borderColor: COLORS.secondary,
          background: COLORS.bg,
        }}
        aria-label={`Board square ${i+1}, ${
          value ? value + ' selected' : 'empty'
        }`}
        key={i}
        disabled={!!winnerInfo || board[i]}
      >
        {value}
      </button>
    );
  }

  // PUBLIC_INTERFACE
  function renderBoard() {
    return (
      <div className="ttt-board">
        {[0, 1, 2].map((row) => (
          <div className="ttt-row" key={row}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </div>
        ))}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function getStatus() {
    if (!userSymbol) return "Select X or O to start";
    if (winnerInfo && winnerInfo.winner) {
      return winnerInfo.winner === userSymbol
        ? "You win! 🎉"
        : "You lose!";
    }
    if (winnerInfo && winnerInfo.tie) {
      return "It's a tie!";
    }
    // prompt current player
    return currentPlayer === userSymbol
      ? "Your turn"
      : "Opponent's turn";
  }

  return (
    <div className="ttt-container" style={{
      minHeight: "100vh",
      background: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <h1 className="ttt-title" style={{
        color: COLORS.primary,
        letterSpacing: "1px",
        fontWeight: 700,
        margin: "32px 0 12px 0",
      }}>
        Tic Tac Toe
      </h1>
      {/* Difficulty Selector */}
      {!userSymbol && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 10 }}>
          <div className="ttt-selectRow" style={{ marginBottom: 8 }}>
            <span style={{ marginRight: 10 }}>Difficulty:</span>
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                className="ttt-select-btn"
                style={{
                  background: difficulty === level ? COLORS.primary : COLORS.bg,
                  color: difficulty === level ? "#fff" : COLORS.secondary,
                  borderColor: COLORS.primary,
                  margin: "0 2px",
                  fontWeight: difficulty === level ? 700 : 600,
                  opacity: difficulty === level ? 1 : 0.83,
                  boxShadow: difficulty === level ? "0 2px 6px rgba(25,118,210,0.07)" : "none",
                  transition: "background 0.15s,color 0.15s,box-shadow 0.15s"
                }}
                onClick={() => handleDifficultyChange(level)}
                aria-label={`Difficulty ${level}`}
              >
                {level}
              </button>
            ))}
          </div>
          <span style={{
            fontSize: "0.96rem",
            color: COLORS.secondary,
            opacity: 0.54,
            letterSpacing: "0.2px"
          }}>
            {difficulty} selected
          </span>
        </div>
      )}
      {/* Selection */}
      {!userSymbol && (
        <div className="ttt-selectRow">
          <span style={{marginRight: "10px"}}>Choose your symbol:</span>
          <button
            className="ttt-select-btn"
            style={{
              background: COLORS.bg,
              color: COLORS.primary,
              borderColor: COLORS.primary,
              marginRight: 12,
            }}
            onClick={() => startGameAs("X")}
            aria-label="Choose X"
          >
            X
          </button>
          <button
            className="ttt-select-btn"
            style={{
              background: COLORS.bg,
              color: COLORS.accent,
              borderColor: COLORS.accent,
            }}
            onClick={() => startGameAs("O")}
            aria-label="Choose O"
          >
            O
          </button>
        </div>
      )}
      {/* Board */}
      <div style={{margin: "28px 0"}}>
        {renderBoard()}
      </div>
      {/* Status */}
      <div className="ttt-status" style={{
        fontSize: "1.3rem",
        minHeight: 36,
        color: COLORS.secondary,
        margin: "0 0 18px 0"
      }}>
        {getStatus()}
      </div>
      {/* Actions */}
      <div className="ttt-actions">
        {(!!userSymbol) &&
          <button
            className="ttt-restart-btn"
            onClick={restartGame}
            style={{
              background: COLORS.primary,
              color: "#fff",
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              padding: "8px 24px",
              border: "none",
              marginRight: 10,
              cursor: "pointer",
              boxShadow: "0 2px 8px 0 rgba(25,118,210,0.10)",
              transition: "background 0.2s"
            }}
            aria-label="Restart game"
          >Restart</button>
        }
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(board) {
  // Returns {winner: "X"|"O"}, or {tie:true}, or null
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diags
  ];
  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return {winner: board[a], positions: [a,b,c]};
  }
  if (board.every(sq => sq)) return { tie: true };
  return null;
}

export default App;
