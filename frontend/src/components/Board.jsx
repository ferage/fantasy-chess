import React from 'react';
import './Board.css';

const Board = ({ gameState, selectedPiece, onTileClick, onShoot }) => {
  if (!gameState) return null;

  const getPieceSymbol = (piece) => {
    const symbols = {
      wizard: '🧙',
      beast: '🐺',
      dwarf: '⛏️',
      archer: '🏹',
      knight: '🗡️',
      rook: '🏰'
    };
    return symbols[piece.type] || '⚔️';
  };

  const getTileClass = (tile) => {
    const classes = ['tile'];
    
    // Base color
    if (tile.type === 'protected') {
      classes.push(tile.color === 'light' ? 'protected-light' : 'protected-dark');
    } else if (tile.type === 'objective') {
      classes.push('objective');
    } else {
      classes.push(tile.color === 'light' ? 'light' : 'dark');
    }

    // Selected piece highlight
    if (selectedPiece && 
        selectedPiece.position.x === tile.x && 
        selectedPiece.position.y === tile.y) {
      classes.push('selected');
    }

    // Valid move highlights
    if (selectedPiece) {
      const validMoves = getValidMovesForSelectedPiece();
      const validShots = getValidShotsForSelectedPiece();
      
      if (validMoves.some(m => m.x === tile.x && m.y === tile.y)) {
        classes.push(validMoves.find(m => m.x === tile.x && m.y === tile.y).type === 'attack' 
          ? 'valid-attack' 
          : 'valid-move');
      }
      
      if (validShots.some(s => s.x === tile.x && s.y === tile.y)) {
        classes.push('valid-shoot');
      }
    }

    return classes.join(' ');
  };

  const getValidMovesForSelectedPiece = () => {
    if (!selectedPiece) return [];
    
    const moves = [];
    const pattern = getMovementPattern(selectedPiece);
    
    pattern.forEach(({dx, dy}) => {
      const newX = selectedPiece.position.x + dx;
      const newY = selectedPiece.position.y + dy;
      
      if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
        const targetPiece = gameState.pieces.find(
          p => p.position.x === newX && p.position.y === newY && p.isAlive
        );
        
        if (!targetPiece) {
          moves.push({x: newX, y: newY, type: 'move'});
        } else if (targetPiece.color !== selectedPiece.color) {
          moves.push({x: newX, y: newY, type: 'attack'});
        }
      }
    });
    
    return moves;
  };

  const getValidShotsForSelectedPiece = () => {
    if (!selectedPiece || !canShoot(selectedPiece)) return [];
    
    const shots = [];
    const range = getShootingRange(selectedPiece);
    
    const directions = [
      {dx: 1, dy: 0}, {dx: -1, dy: 0},
      {dx: 0, dy: 1}, {dx: 0, dy: -1},
      {dx: 1, dy: 1}, {dx: 1, dy: -1},
      {dx: -1, dy: 1}, {dx: -1, dy: -1}
    ];
    
    directions.forEach(({dx, dy}) => {
      for (let i = 1; i <= range; i++) {
        const newX = selectedPiece.position.x + (dx * i);
        const newY = selectedPiece.position.y + (dy * i);
        
        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
          const targetPiece = gameState.pieces.find(
            p => p.position.x === newX && p.position.y === newY && p.isAlive
          );
          
          if (targetPiece) {
            if (targetPiece.color !== selectedPiece.color) {
              shots.push({x: newX, y: newY, type: 'shoot'});
            }
            break;
          }
        }
      }
    });
    
    return shots;
  };

  const getMovementPattern = (piece) => {
    const patterns = {
      wizard: [
        {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1},
        {dx: -1, dy: 0}, {dx: 1, dy: 0},
        {dx: -1, dy: 1}, {dx: 0, dy: 1}, {dx: 1, dy: 1}
      ],
      beast: (() => {
        const moves = [];
        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            if (dx !== 0 || dy !== 0) moves.push({dx, dy});
          }
        }
        return moves;
      })(),
      dwarf: [
        {dx: 0, dy: -1}, {dx: 0, dy: 1},
        {dx: -1, dy: 0}, {dx: 1, dy: 0}
      ],
      archer: [
        {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1},
        {dx: -1, dy: 0}, {dx: 1, dy: 0},
        {dx: -1, dy: 1}, {dx: 0, dy: 1}, {dx: 1, dy: 1}
      ],
      knight: [
        {dx: -2, dy: -1}, {dx: -2, dy: 1},
        {dx: -1, dy: -2}, {dx: -1, dy: 2},
        {dx: 1, dy: -2}, {dx: 1, dy: 2},
        {dx: 2, dy: -1}, {dx: 2, dy: 1}
      ],
      rook: (() => {
        const moves = [];
        for (let i = 1; i <= 7; i++) {
          moves.push({dx: i, dy: 0}, {dx: -i, dy: 0});
          moves.push({dx: 0, dy: i}, {dx: 0, dy: -i});
        }
        return moves;
      })()
    };
    return patterns[piece.type] || [];
  };

  const canShoot = (piece) => {
    return piece.type === 'archer';
  };

  const getShootingRange = (piece) => {
    if (piece.type === 'archer') return 3;
    return 0;
  };

  const handleTileClick = (tile) => {
    const validShots = getValidShotsForSelectedPiece();
    const isValidShot = validShots.some(s => s.x === tile.x && s.y === tile.y);
    
    if (isValidShot) {
      onShoot(tile.x, tile.y);
    } else {
      onTileClick(tile.x, tile.y);
    }
  };

  return (
    <div className="board-container">
      <div className="board">
        {gameState.board.map((row, y) => (
          <div key={y} className="board-row">
            {row.map((tile, x) => {
              const piece = gameState.pieces.find(
                p => p.position.x === x && p.position.y === y && p.isAlive
              );

              return (
                <div
                  key={`${x}-${y}`}
                  className={getTileClass(tile)}
                  onClick={() => handleTileClick(tile)}
                >
                  {piece && (
                    <div className={`piece ${piece.color}`}>
                      <span className="piece-symbol">{getPieceSymbol(piece)}</span>
                      {piece.frozen && <div className="status-icon">❄️</div>}
                      {piece.poisoned && <div className="status-icon">☠️</div>}
                      {piece.shielded && <div className="status-icon">🛡️</div>}
                    </div>
                  )}
                  {tile.effects && tile.effects.length > 0 && (
                    <div className="tile-effect">
                      {tile.effects.map(effect => (
                        <span key={effect.id}>🔥</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Board;
