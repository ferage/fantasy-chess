/**
 * Piece.js - Base class for all chess pieces
 */

class Piece {
  constructor(color, type, name) {
    this.color = color; // 'white' or 'black'
    this.type = type; // 'king', 'queen', 'rook', etc.
    this.name = name; // Display name
    this.position = null; // { row, col }
    this.hasMoved = false;
    this.specialAbility = null;
  }

  /**
   * Get all valid moves for this piece
   * Must be overridden by subclasses
   */
  getValidMoves(board) {
    return [];
  }

  /**
   * Check if a move to target position is valid
   */
  canMoveTo(board, targetRow, targetCol) {
    const moves = this.getValidMoves(board);
    return moves.some(move => move.row === targetRow && move.col === targetCol);
  }

  /**
   * Move piece to new position
   */
  moveTo(row, col) {
    this.position = { row, col };
    this.hasMoved = true;
  }

  /**
   * Check if target square has enemy piece
   */
  isEnemy(board, row, col) {
    const piece = board.getPiece(row, col);
    return piece && piece.color !== this.color;
  }

  /**
   * Check if target square has friendly piece
   */
  isFriendly(board, row, col) {
    const piece = board.getPiece(row, col);
    return piece && piece.color === this.color;
  }

  /**
   * Get piece symbol for display
   */
  getSymbol() {
    const symbols = {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
    };
    return symbols[this.type] || '?';
  }

  /**
   * Clone this piece
   */
  clone() {
    const cloned = Object.create(Object.getPrototypeOf(this));
    Object.assign(cloned, this);
    return cloned;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Piece;
}
