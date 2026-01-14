/**
 * Game.js - Main game controller
 */

class Game {
  constructor() {
    this.board = null;
    this.currentPlayer = 'white';
    this.gameState = 'setup'; // 'setup', 'playing', 'checkmate', 'stalemate', 'draw'
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
  }

  /**
   * Initialize a new game
   */
  initialize(board) {
    this.board = board;
    this.currentPlayer = 'white';
    this.gameState = 'playing';
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
  }

  /**
   * Attempt to move a piece
   */
  makeMove(fromRow, fromCol, toRow, toCol) {
    const piece = this.board.getPiece(fromRow, fromCol);
    
    if (!piece) {
      return { success: false, error: 'No piece at source position' };
    }

    if (piece.color !== this.currentPlayer) {
      return { success: false, error: 'Not your piece' };
    }

    if (!piece.canMoveTo(this.board, toRow, toCol)) {
      return { success: false, error: 'Invalid move for this piece' };
    }

    // Capture enemy piece if present
    const capturedPiece = this.board.getPiece(toRow, toCol);
    if (capturedPiece) {
      this.capturedPieces[capturedPiece.color].push(capturedPiece);
    }

    // Execute the move
    this.board.removePiece(fromRow, fromCol);
    this.board.setPiece(toRow, toCol, piece);
    piece.moveTo(toRow, toCol);

    // Record move
    this.moveHistory.push({
      piece: piece.type,
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol },
      captured: capturedPiece ? capturedPiece.type : null,
      player: this.currentPlayer
    });

    // Switch players
    this.switchPlayer();

    return { success: true };
  }

  /**
   * Switch to the other player
   */
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
  }

  /**
   * Check if game is over
   */
  isGameOver() {
    return this.gameState === 'checkmate' || this.gameState === 'stalemate' || this.gameState === 'draw';
  }

  /**
   * Get game status
   */
  getStatus() {
    return {
      currentPlayer: this.currentPlayer,
      gameState: this.gameState,
      moveCount: this.moveHistory.length,
      capturedPieces: this.capturedPieces
    };
  }

  /**
   * Reset the game
   */
  reset() {
    if (this.board) {
      this.board.clear();
    }
    this.currentPlayer = 'white';
    this.gameState = 'setup';
    this.moveHistory = [];
    this.capturedPieces = { white: [], black: [] };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}
