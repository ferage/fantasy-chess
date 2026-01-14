import React from 'react';
import './GameControls.css';

const GameControls = ({ gameState, selectedPiece, onEndTurn, onDeselectPiece }) => {
  if (!gameState) return null;

  return (
    <div className="game-controls">
      <div className="controls-section">
        <h3>Controls</h3>
        
        {selectedPiece && (
          <div className="selected-piece-info">
            <p><strong>Selected:</strong> {selectedPiece.type} ({selectedPiece.color})</p>
            <p><strong>Position:</strong> ({selectedPiece.position.x}, {selectedPiece.position.y})</p>
            <button onClick={onDeselectPiece} className="deselect-btn">
              Deselect Piece
            </button>
          </div>
        )}
        
        <div className="action-legend">
          <h4>Action Colors:</h4>
          <div className="legend-item">
            <span className="legend-color move"></span>
            <span>Green = Movement</span>
          </div>
          <div className="legend-item">
            <span className="legend-color attack"></span>
            <span>Red = Attack</span>
          </div>
          <div className="legend-item">
            <span className="legend-color shoot"></span>
            <span>Purple = Shoot</span>
          </div>
        </div>
        
        <button 
          onClick={onEndTurn} 
          className="end-turn-btn"
          disabled={gameState.gameStatus !== 'active'}
        >
          End Turn
        </button>
      </div>
      
      <div className="instructions">
        <h4>How to Play:</h4>
        <ul>
          <li>Click a piece to select it</li>
          <li>Click a highlighted tile to move or attack</li>
          <li>Archers can shoot at range (purple)</li>
          <li>Cast one spell per turn</li>
          <li>Capture the enemy wizard or protected zones to win</li>
        </ul>
      </div>
    </div>
  );
};

export default GameControls;
