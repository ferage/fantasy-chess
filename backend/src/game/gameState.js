// Main game state and logic

const { Board } = require('./board');
const { getInitialPieceSetup, PieceTypes } = require('./pieces');
const { SpellSystem } = require('./spells');

class GameState {
  constructor(gameId, players) {
    this.gameId = gameId;
    this.board = new Board();
    this.pieces = getInitialPieceSetup();
    this.players = players; // {white: playerId, black: playerId}
    this.currentTurn = 'white';
    this.spellSystem = new SpellSystem();
    this.spellCastThisTurn = false;
    this.moveHistory = [];
    this.gameStatus = 'active'; // 'active', 'ended'
    this.winner = null;
    
    // Place pieces on board
    this.pieces.forEach(piece => {
      this.board.setPiece(piece.position.x, piece.position.y, piece);
    });
  }

  getValidMoves(piece) {
    if (!piece || !piece.isAlive) {
      return [];
    }

    // Check if piece is frozen
    if (piece.frozen) {
      return [];
    }

    const moves = [];
    const pattern = piece.getMovementPattern();
    
    pattern.forEach(({dx, dy}) => {
      const newX = piece.position.x + dx;
      const newY = piece.position.y + dy;
      
      if (this.board.isValidPosition(newX, newY)) {
        const targetPiece = this.board.getPiece(newX, newY);
        
        // Can move to empty squares or enemy pieces (attack)
        if (!targetPiece) {
          moves.push({x: newX, y: newY, type: 'move'});
        } else if (targetPiece.color !== piece.color) {
          moves.push({x: newX, y: newY, type: 'attack'});
        }
      }
    });
    
    return moves;
  }

  getValidShots(piece) {
    if (!piece || !piece.isAlive || !piece.canShoot()) {
      return [];
    }

    const shots = [];
    const range = piece.getShootingRange();
    
    // Can shoot in straight lines (horizontal, vertical, diagonal)
    const directions = [
      {dx: 1, dy: 0}, {dx: -1, dy: 0},
      {dx: 0, dy: 1}, {dx: 0, dy: -1},
      {dx: 1, dy: 1}, {dx: 1, dy: -1},
      {dx: -1, dy: 1}, {dx: -1, dy: -1}
    ];
    
    directions.forEach(({dx, dy}) => {
      for (let i = 1; i <= range; i++) {
        const newX = piece.position.x + (dx * i);
        const newY = piece.position.y + (dy * i);
        
        if (this.board.isValidPosition(newX, newY)) {
          const targetPiece = this.board.getPiece(newX, newY);
          
          if (targetPiece) {
            // Can only shoot at enemies
            if (targetPiece.color !== piece.color) {
              shots.push({x: newX, y: newY, type: 'shoot'});
            }
            break; // Can't shoot through pieces
          }
        }
      }
    });
    
    return shots;
  }

  isValidMove(piece, toX, toY) {
    const validMoves = this.getValidMoves(piece);
    return validMoves.some(move => move.x === toX && move.y === toY);
  }

  makeMove(fromX, fromY, toX, toY) {
    const piece = this.board.getPiece(fromX, fromY);
    
    if (!piece) {
      return { success: false, error: 'No piece at source position' };
    }
    
    if (piece.color !== this.currentTurn) {
      return { success: false, error: 'Not your turn' };
    }
    
    if (!this.isValidMove(piece, toX, toY)) {
      return { success: false, error: 'Invalid move' };
    }
    
    // Check if attacking
    const targetPiece = this.board.getPiece(toX, toY);
    if (targetPiece) {
      this.capturePiece(targetPiece);
    }
    
    // Move piece
    this.board.movePiece(fromX, fromY, toX, toY);
    
    // Record move
    this.moveHistory.push({
      piece: piece.type,
      from: {x: fromX, y: fromY},
      to: {x: toX, y: toY},
      captured: targetPiece ? targetPiece.type : null,
      turn: this.currentTurn
    });
    
    return { success: true };
  }

  makeShot(fromX, fromY, toX, toY) {
    const piece = this.board.getPiece(fromX, fromY);
    
    if (!piece || !piece.canShoot()) {
      return { success: false, error: 'Piece cannot shoot' };
    }
    
    if (piece.color !== this.currentTurn) {
      return { success: false, error: 'Not your turn' };
    }
    
    const validShots = this.getValidShots(piece);
    const isValid = validShots.some(shot => shot.x === toX && shot.y === toY);
    
    if (!isValid) {
      return { success: false, error: 'Invalid shot' };
    }
    
    const targetPiece = this.board.getPiece(toX, toY);
    if (targetPiece) {
      this.capturePiece(targetPiece);
    }
    
    return { success: true };
  }

  capturePiece(piece) {
    // Check if piece has shield
    if (piece.shielded && piece.shieldHealth > 0) {
      piece.shieldHealth--;
      if (piece.shieldHealth <= 0) {
        piece.shielded = false;
      }
      return false; // Piece not captured
    }
    
    piece.isAlive = false;
    this.board.removePiece(piece.position.x, piece.position.y);
    
    // Check win conditions
    this.checkWinConditions();
    
    return true;
  }

  castSpell(spell, target) {
    if (this.spellCastThisTurn) {
      return { success: false, error: 'Already cast a spell this turn' };
    }
    
    if (spell.caster !== this.currentTurn) {
      return { success: false, error: 'Not your turn' };
    }
    
    const spellId = this.spellSystem.castSpell(spell, target, this.board);
    this.spellCastThisTurn = true;
    
    return { success: true, spellId };
  }

  endTurn() {
    // Update spell effects
    this.spellSystem.updateSpells(this.board);
    
    // Update piece statuses
    this.pieces.forEach(piece => {
      if (piece.frozen && piece.frozenTurns > 0) {
        piece.frozenTurns--;
        if (piece.frozenTurns <= 0) {
          piece.frozen = false;
        }
      }
    });
    
    // Switch turn
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
    this.spellCastThisTurn = false;
    
    // Check win conditions
    this.checkWinConditions();
  }

  checkWinConditions() {
    // Win condition 1: Capture enemy wizard
    const whiteWizard = this.pieces.find(p => 
      p.type === PieceTypes.WIZARD && p.color === 'white' && p.isAlive
    );
    const blackWizard = this.pieces.find(p => 
      p.type === PieceTypes.WIZARD && p.color === 'black' && p.isAlive
    );
    
    if (!whiteWizard) {
      this.gameStatus = 'ended';
      this.winner = 'black';
      return;
    }
    
    if (!blackWizard) {
      this.gameStatus = 'ended';
      this.winner = 'white';
      return;
    }
    
    // Win condition 2: Control all protected zones
    // (Simplified: would need to track control of protected tiles)
  }

  getState() {
    return {
      gameId: this.gameId,
      board: this.board.tiles,
      pieces: this.pieces.filter(p => p.isAlive),
      currentTurn: this.currentTurn,
      gameStatus: this.gameStatus,
      winner: this.winner,
      spellCastThisTurn: this.spellCastThisTurn,
      activeSpells: this.spellSystem.getActiveSpells()
    };
  }
}

module.exports = GameState;
