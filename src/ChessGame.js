import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (game.isGameOver()) {
      if (game.isCheckmate()) {
        setStatus(game.turn() === "w" ? "Black Wins!" : "White Wins!");
      } else {
        setStatus("Game Over: Draw");
      }
    } else {
      setStatus("");
    }
  }, [fen]);

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setStatus("");
  };

  const makeRandomMove = () => {
    if (game.isGameOver()) return;
    const possibleMoves = game.moves();
    if (possibleMoves.length === 0) return;
    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    game.move(randomMove);
    setFen(game.fen());
  };

  const onDrop = (sourceSquare, targetSquare) => {
    if (game.isGameOver()) return false; // Prevent moves after game over
  
    try {
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
  
      if (move === null) {
        console.warn("Invalid move:", sourceSquare, targetSquare); // Debugging log
        return false; // Reject invalid moves
      }
  
      setFen(game.fen());
  
      setTimeout(() => {
        if (!game.isGameOver()) {
          makeRandomMove();
        }
      }, 250);
  
      return true;
    } catch (error) {
      console.error("Move error:", error);
      return false; // Prevent crashes on invalid moves
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Chess Game</h1>
      {status && <p className="text-lg font-semibold text-red-500 mb-2">{status}</p>}
      <div className="w-4/5 max-w-2xl"> {/* Scales to 80% of window width */}
        <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={Math.min(window.innerWidth * 0.8, 500)} />
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={resetGame} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Restart</button>
        <button onClick={() => setStatus("You Surrendered! Black Wins!")} className="px-4 py-2 bg-red-500 text-white rounded-lg">Surrender</button>
      </div>
    </div>
  );
};

export default ChessGame;
