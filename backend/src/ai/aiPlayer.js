// AI player for Fantasy Chess

const { PieceTypes } = require('../game/pieces');

class AIPlayer {
  constructor(color, difficulty = 'medium') {
    this.color = color;
    this.difficulty = difficulty; // 'easy', 'medium', 'hard'
  }

  makeMove(gameState) {
    const difficulty = this.difficulty;
    
    if (difficulty === 'easy') {
      return this.makeRandomMove(gameState);
    } else if (difficulty === 'medium') {
      return this.makeStrategicMove(gameState);
    } else {
      return this.makeMinimaxMove(gameState);
    }
  }

  makeRandomMove(gameState) {
    // Get all possible moves
    const allMoves = this.getAllPossibleMoves(gameState);
    
    if (allMoves.length === 0) {
      return null;
    }
    
    // Pick a random move
    const randomIndex = Math.floor(Math.random() * allMoves.length);
    return allMoves[randomIndex];
  }

  makeStrategicMove(gameState) {
    // Get all possible moves
    const allMoves = this.getAllPossibleMoves(gameState);
    
    if (allMoves.length === 0) {
      return null;
    }
    
    // Score each move
    const scoredMoves = allMoves.map(move => ({
      move,
      score: this.evaluateMove(move, gameState)
    }));
    
    // Sort by score (highest first)
    scoredMoves.sort((a, b) => b.score - a.score);
    
    // Return best move
    return scoredMoves[0].move;
  }

  makeMinimaxMove(gameState, depth = 3) {
    const bestMove = this.minimax(gameState, depth, true, -Infinity, Infinity);
    return bestMove.move;
  }

  minimax(gameState, depth, isMaximizing, alpha, beta) {
    if (depth === 0 || gameState.gameStatus === 'ended') {
      return {
        score: this.evaluateGameState(gameState),
        move: null
      };
    }

    const allMoves = this.getAllPossibleMoves(gameState);
    
    if (allMoves.length === 0) {
      return {
        score: this.evaluateGameState(gameState),
        move: null
      };
    }

    let bestMove = null;

    if (isMaximizing) {
      let maxScore = -Infinity;
      
      for (const move of allMoves) {
        const newState = this.simulateMove(gameState, move);
        const result = this.minimax(newState, depth - 1, false, alpha, beta);
        
        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = move;
        }
        
        alpha = Math.max(alpha, result.score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      
      return { score: maxScore, move: bestMove };
    } else {
      let minScore = Infinity;
      
      for (const move of allMoves) {
        const newState = this.simulateMove(gameState, move);
        const result = this.minimax(newState, depth - 1, true, alpha, beta);
        
        if (result.score < minScore) {
          minScore = result.score;
          bestMove = move;
        }
        
        beta = Math.min(beta, result.score);
        if (beta <= alpha) {
          break; // Alpha-beta pruning
        }
      }
      
      return { score: minScore, move: bestMove };
    }
  }

  getAllPossibleMoves(gameState) {
    const moves = [];
    
    // Get all pieces of the AI's color
    const myPieces = gameState.pieces.filter(p => 
      p.color === this.color && p.isAlive
    );
    
    myPieces.forEach(piece => {
      // Get valid moves
      const validMoves = gameState.getValidMoves(piece);
      validMoves.forEach(move => {
        moves.push({
          type: 'move',
          piece,
          from: { x: piece.position.x, y: piece.position.y },
          to: { x: move.x, y: move.y }
        });
      });
      
      // Get valid shots
      if (piece.canShoot()) {
        const validShots = gameState.getValidShots(piece);
        validShots.forEach(shot => {
          moves.push({
            type: 'shoot',
            piece,
            from: { x: piece.position.x, y: piece.position.y },
            to: { x: shot.x, y: shot.y }
          });
        });
      }
    });
    
    return moves;
  }

  evaluateMove(move, gameState) {
    let score = 0;
    
    // Bonus for capturing pieces
    const targetPiece = gameState.board.getPiece(move.to.x, move.to.y);
    if (targetPiece) {
      score += this.getPieceValue(targetPiece.type);
      
      // Extra bonus for capturing wizard
      if (targetPiece.type === PieceTypes.WIZARD) {
        score += 1000;
      }
    }
    
    // Bonus for moving to center
    const distanceToCenter = Math.abs(move.to.x - 3.5) + Math.abs(move.to.y - 3.5);
    score += (7 - distanceToCenter) * 2;
    
    // Bonus for attacking moves
    if (move.type === 'attack' || move.type === 'shoot') {
      score += 10;
    }
    
    return score;
  }

  evaluateGameState(gameState) {
    let score = 0;
    
    // Count material
    gameState.pieces.forEach(piece => {
      if (!piece.isAlive) return;
      
      const value = this.getPieceValue(piece.type);
      if (piece.color === this.color) {
        score += value;
      } else {
        score -= value;
      }
    });
    
    // Check win/loss
    if (gameState.gameStatus === 'ended') {
      if (gameState.winner === this.color) {
        score += 10000;
      } else {
        score -= 10000;
      }
    }
    
    return score;
  }

  getPieceValue(pieceType) {
    const values = {
      [PieceTypes.WIZARD]: 100,
      [PieceTypes.BEAST]: 50,
      [PieceTypes.ROOK]: 50,
      [PieceTypes.KNIGHT]: 30,
      [PieceTypes.ARCHER]: 30,
      [PieceTypes.DWARF]: 20
    };
    return values[pieceType] || 10;
  }

  simulateMove(gameState, move) {
    // Create a deep copy of the game state
    // (Simplified - in production would need proper cloning)
    const newState = { ...gameState };
    
    // Apply the move
    if (move.type === 'move') {
      const targetPiece = newState.board.getPiece(move.to.x, move.to.y);
      if (targetPiece) {
        targetPiece.isAlive = false;
      }
      newState.board.movePiece(move.from.x, move.from.y, move.to.x, move.to.y);
    } else if (move.type === 'shoot') {
      const targetPiece = newState.board.getPiece(move.to.x, move.to.y);
      if (targetPiece) {
        targetPiece.isAlive = false;
      }
    }
    
    return newState;
  }
}

module.exports = AIPlayer;
