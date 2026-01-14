import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Board from './components/Board';
import GameControls from './components/GameControls';
import SpellPanel from './components/SpellPanel';
import GameInfo from './components/GameInfo';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [gameState, setGameState] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [playerId] = useState(`player_${Date.now()}`);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameMode, setGameMode] = useState(null); // null, 'menu', 'game'
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('register', playerId);
    });

    socket.on('gameCreated', ({ gameId, state }) => {
      console.log('Game created:', gameId);
      setGameId(gameId);
      setGameState(state);
      setGameMode('game');
    });

    socket.on('gameState', (state) => {
      console.log('Game state updated');
      setGameState(state);
    });

    socket.on('gameEnded', ({ winner }) => {
      alert(`Game Over! Winner: ${winner}`);
    });

    socket.on('error', ({ message }) => {
      console.error('Game error:', message);
      setError(message);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      socket.off('connect');
      socket.off('gameCreated');
      socket.off('gameState');
      socket.off('gameEnded');
      socket.off('error');
    };
  }, [playerId]);

  const createGame = (mode, difficulty = 'medium') => {
    socket.emit('createGame', { playerId, mode, difficulty });
  };

  const handleTileClick = (x, y) => {
    if (!gameState || gameState.gameStatus !== 'active') return;

    const piece = gameState.pieces.find(
      p => p.position.x === x && p.position.y === y && p.isAlive
    );

    if (selectedPiece) {
      // Try to move or attack
      if (selectedPiece.position.x === x && selectedPiece.position.y === y) {
        // Deselect
        setSelectedPiece(null);
      } else {
        // Make move
        socket.emit('makeMove', {
          gameId,
          fromX: selectedPiece.position.x,
          fromY: selectedPiece.position.y,
          toX: x,
          toY: y
        });
        setSelectedPiece(null);
      }
    } else if (piece && piece.color === gameState.currentTurn) {
      // Select piece
      setSelectedPiece(piece);
    }
  };

  const handleShoot = (targetX, targetY) => {
    if (!selectedPiece) return;

    socket.emit('makeShot', {
      gameId,
      fromX: selectedPiece.position.x,
      fromY: selectedPiece.position.y,
      toX: targetX,
      toY: targetY
    });
    setSelectedPiece(null);
  };

  const handleCastSpell = (spellType, targetX, targetY) => {
    socket.emit('castSpell', {
      gameId,
      spellType,
      targetX,
      targetY
    });
  };

  const handleEndTurn = () => {
    socket.emit('endTurn', { gameId });
    setSelectedPiece(null);
  };

  if (gameMode === null) {
    return (
      <div className="app">
        <h1>Fantasy Chess</h1>
        <div className="menu">
          <h2>Select Game Mode</h2>
          <button onClick={() => createGame('ai', 'easy')}>
            Play vs AI (Easy)
          </button>
          <button onClick={() => createGame('ai', 'medium')}>
            Play vs AI (Medium)
          </button>
          <button onClick={() => createGame('ai', 'hard')}>
            Play vs AI (Hard)
          </button>
          <button onClick={() => createGame('pvp')}>
            Create Multiplayer Game
          </button>
        </div>
      </div>
    );
  }

  if (gameMode === 'game' && gameState) {
    return (
      <div className="app">
        <h1>Fantasy Chess</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="game-container">
          <div className="game-main">
            <GameInfo gameState={gameState} playerId={playerId} />
            <Board
              gameState={gameState}
              selectedPiece={selectedPiece}
              onTileClick={handleTileClick}
              onShoot={handleShoot}
            />
            <GameControls
              gameState={gameState}
              selectedPiece={selectedPiece}
              onEndTurn={handleEndTurn}
              onDeselectPiece={() => setSelectedPiece(null)}
            />
          </div>
          <SpellPanel
            gameState={gameState}
            onCastSpell={handleCastSpell}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Fantasy Chess</h1>
      <p>Loading...</p>
    </div>
  );
}

export default App;
