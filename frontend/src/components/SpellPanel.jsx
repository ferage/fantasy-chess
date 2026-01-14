import React, { useState } from 'react';
import './SpellPanel.css';

const SpellPanel = ({ gameState, onCastSpell }) => {
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [targetMode, setTargetMode] = useState(false);

  if (!gameState) return null;

  const spells = [
    {
      type: 'firewall',
      name: 'Firewall',
      icon: '🔥',
      description: 'Creates a damaging barrier on a tile',
      targetType: 'tile'
    },
    {
      type: 'freeze',
      name: 'Freeze',
      icon: '❄️',
      description: 'Freezes an enemy piece for 2 turns',
      targetType: 'enemy'
    },
    {
      type: 'poison',
      name: 'Poison',
      icon: '☠️',
      description: 'Poisons an enemy, dealing damage over time',
      targetType: 'enemy'
    },
    {
      type: 'shield',
      name: 'Shield',
      icon: '🛡️',
      description: 'Protects your piece from one attack',
      targetType: 'ally'
    },
    {
      type: 'lightning',
      name: 'Lightning',
      icon: '⚡',
      description: 'Deals instant damage to an enemy',
      targetType: 'enemy'
    }
  ];

  const handleSpellClick = (spell) => {
    if (gameState.spellCastThisTurn) {
      alert('You have already cast a spell this turn!');
      return;
    }
    
    setSelectedSpell(spell);
    setTargetMode(true);
  };

  const handleBoardClick = (e) => {
    if (!targetMode || !selectedSpell) return;

    // This is a simplified version - in production, would integrate with board component
    alert(`Spell targeting is simplified in this version. Click a board tile after selecting a spell.`);
    
    // Example: onCastSpell(selectedSpell.type, targetX, targetY);
    setSelectedSpell(null);
    setTargetMode(false);
  };

  return (
    <div className="spell-panel">
      <h3>Magic Spells</h3>
      
      {gameState.spellCastThisTurn && (
        <div className="spell-warning">
          Spell already cast this turn!
        </div>
      )}
      
      {targetMode && (
        <div className="targeting-mode">
          <p>Select a target for {selectedSpell.name}</p>
          <button onClick={() => {
            setSelectedSpell(null);
            setTargetMode(false);
          }}>
            Cancel
          </button>
        </div>
      )}
      
      <div className="spells-grid">
        {spells.map((spell) => (
          <div
            key={spell.type}
            className={`spell-card ${selectedSpell === spell ? 'selected' : ''} ${
              gameState.spellCastThisTurn ? 'disabled' : ''
            }`}
            onClick={() => !gameState.spellCastThisTurn && handleSpellClick(spell)}
          >
            <div className="spell-icon">{spell.icon}</div>
            <div className="spell-name">{spell.name}</div>
            <div className="spell-description">{spell.description}</div>
            <div className="spell-target">
              Target: {spell.targetType}
            </div>
          </div>
        ))}
      </div>
      
      <div className="spell-info">
        <p>💡 You can cast one spell per turn</p>
        <p>💡 Choose your target carefully!</p>
      </div>
    </div>
  );
};

export default SpellPanel;
