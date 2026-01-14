// Magic spell system

const SpellTypes = {
  FIREWALL: 'firewall',
  FREEZE: 'freeze',
  POISON: 'poison',
  SHIELD: 'shield',
  LIGHTNING: 'lightning'
};

class Spell {
  constructor(type, caster) {
    this.type = type;
    this.caster = caster; // 'white' or 'black'
    this.id = `${type}_${Date.now()}`;
  }

  getTargetType() {
    const targetTypes = {
      [SpellTypes.FIREWALL]: 'tile',
      [SpellTypes.FREEZE]: 'piece',
      [SpellTypes.POISON]: 'piece',
      [SpellTypes.SHIELD]: 'piece',
      [SpellTypes.LIGHTNING]: 'piece'
    };
    return targetTypes[this.type];
  }

  getDuration() {
    // Duration in turns
    const durations = {
      [SpellTypes.FIREWALL]: 3,
      [SpellTypes.FREEZE]: 2,
      [SpellTypes.POISON]: 3,
      [SpellTypes.SHIELD]: 2,
      [SpellTypes.LIGHTNING]: 0 // Instant
    };
    return durations[this.type];
  }

  getEffect() {
    const effects = {
      [SpellTypes.FIREWALL]: {
        description: 'Damages any piece that moves through this tile',
        damage: 2
      },
      [SpellTypes.FREEZE]: {
        description: 'Prevents target piece from moving for 2 turns',
        canMove: false
      },
      [SpellTypes.POISON]: {
        description: 'Deals 1 damage per turn for 3 turns',
        damagePerTurn: 1
      },
      [SpellTypes.SHIELD]: {
        description: 'Protects target piece from 1 attack',
        protection: 1
      },
      [SpellTypes.LIGHTNING]: {
        description: 'Deals 3 damage instantly',
        damage: 3
      }
    };
    return effects[this.type];
  }

  canTarget(targetType, targetColor, casterColor) {
    if (this.type === SpellTypes.SHIELD) {
      // Shield can only target own pieces
      return targetType === 'piece' && targetColor === casterColor;
    }
    
    if (this.type === SpellTypes.FIREWALL) {
      // Firewall targets tiles
      return targetType === 'tile';
    }
    
    // Offensive spells target enemy pieces
    return targetType === 'piece' && targetColor !== casterColor;
  }
}

class SpellSystem {
  constructor() {
    this.activeSpells = new Map(); // spellId -> {spell, target, turnsRemaining}
  }

  castSpell(spell, target, board) {
    const duration = spell.getDuration();
    
    if (duration === 0) {
      // Instant effect
      this.applyInstantEffect(spell, target, board);
    } else {
      // Ongoing effect
      const spellData = {
        spell,
        target,
        turnsRemaining: duration
      };
      this.activeSpells.set(spell.id, spellData);
      this.applyEffect(spell, target, board);
    }
    
    return spell.id;
  }

  applyInstantEffect(spell, target, board) {
    const effect = spell.getEffect();
    
    if (spell.type === SpellTypes.LIGHTNING) {
      // Deal damage to piece
      if (target.piece) {
        target.piece.health = (target.piece.health || 10) - effect.damage;
      }
    }
  }

  applyEffect(spell, target, board) {
    const effect = spell.getEffect();
    
    if (spell.type === SpellTypes.FIREWALL) {
      // Add effect to tile
      board.addEffect(target.x, target.y, {
        id: spell.id,
        type: spell.type,
        ...effect
      });
    } else if (spell.type === SpellTypes.FREEZE) {
      // Add freeze status to piece
      if (target.piece) {
        target.piece.frozen = true;
        target.piece.frozenTurns = effect.duration || 2;
      }
    } else if (spell.type === SpellTypes.POISON) {
      // Add poison status to piece
      if (target.piece) {
        target.piece.poisoned = true;
        target.piece.poisonTurns = 3;
      }
    } else if (spell.type === SpellTypes.SHIELD) {
      // Add shield to piece
      if (target.piece) {
        target.piece.shielded = true;
        target.piece.shieldHealth = effect.protection;
      }
    }
  }

  updateSpells(board) {
    // Process ongoing spell effects each turn
    const expiredSpells = [];
    
    this.activeSpells.forEach((spellData, spellId) => {
      spellData.turnsRemaining--;
      
      // Apply per-turn effects
      if (spellData.spell.type === SpellTypes.POISON && spellData.target.piece) {
        const damage = spellData.spell.getEffect().damagePerTurn;
        spellData.target.piece.health = (spellData.target.piece.health || 10) - damage;
      }
      
      if (spellData.turnsRemaining <= 0) {
        expiredSpells.push(spellId);
      }
    });
    
    // Remove expired spells
    expiredSpells.forEach(spellId => {
      const spellData = this.activeSpells.get(spellId);
      if (spellData) {
        this.removeEffect(spellData.spell, spellData.target, board);
        this.activeSpells.delete(spellId);
      }
    });
  }

  removeEffect(spell, target, board) {
    if (spell.type === SpellTypes.FIREWALL) {
      board.removeEffect(target.x, target.y, spell.id);
    } else if (spell.type === SpellTypes.FREEZE && target.piece) {
      target.piece.frozen = false;
    } else if (spell.type === SpellTypes.POISON && target.piece) {
      target.piece.poisoned = false;
    } else if (spell.type === SpellTypes.SHIELD && target.piece) {
      target.piece.shielded = false;
    }
  }

  getActiveSpells() {
    return Array.from(this.activeSpells.values());
  }
}

module.exports = {
  Spell,
  SpellTypes,
  SpellSystem
};
