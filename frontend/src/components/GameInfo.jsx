import React from 'react';
import './GameInfo.css';

const GameInfo = ({ gameState, playerId }) => {
  if (!gameState) return null;

  const playerColor = gameState.players.white === playerId ? 'white' : 'black';
  const isMyTurn = gameState.currentTurn === playerColor;

  return (
    <div className="game-info">
      <div className="turn-indicator">
        <h2>Current Turn: 
          <span className={`turn-color ${gameState.currentTurn}`}>
            {gameState.currentTurn.toUpperCase()}
          </span>
        </h2>
        {isMyTurn && <div className="your-turn">Your Turn!</div>}
      </div>
      
      <div className="player-info">
        <div className="info-item">
          <strong>Your Color:</strong> 
          <span className={`player-color ${playerColor}`}>
            {playerColor.toUpperCase()}
          </span>
        </div>
        <div className="info-item">
          <strong>Game Status:</strong> {gameState.gameStatus}
        </div>
        {gameState.winner && (
          <div className="winner-announcement">
            Winner: {gameState.winner.toUpperCase()}!
          </div>
        )}
      </div>
      
      <div className="spell-status">
        <div className="info-item">
          <strong>Spell Available:</strong> 
          <span className={gameState.spellCastThisTurn ? 'spell-used' : 'spell-available'}>
            {gameState.spellCastThisTurn ? 'Used' : 'Ready'}
          </span>
        </div>
      </div>

      {gameState.activeSpells && gameState.activeSpells.length > 0 && (
        <div className="active-spells">
          <h3>Active Spells:</h3>
          {gameState.activeSpells.map((spellData, idx) => (
            <div key={idx} className="active-spell">
              {spellData.spell.type} ({spellData.turnsRemaining} turns left)
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameInfo;
