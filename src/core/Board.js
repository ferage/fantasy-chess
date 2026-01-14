/**
 * Board.js - Represents the chess board and manages square states
 */

class Board {
  constructor() {
    this.size = 8;
    this.squares = this.initializeBoard();
  }

  /**
   * Initialize an empty 8x8 board
   */
  initializeBoard() {
    const board = [];
    for (let row = 0; row < this.size; row++) {
      board[row] = [];
      for (let col = 0; col < this.size; col++) {
        board[row][col] = null;
      }
    }
    return board;
  }

  /**
   * Get piece at specific position
   */
  getPiece(row, col) {
    if (this.isValidPosition(row, col)) {
      return this.squares[row][col];
    }
    return null;
  }

  /**
   * Set piece at specific position
   */
  setPiece(row, col, piece) {
    if (this.isValidPosition(row, col)) {
      this.squares[row][col] = piece;
      if (piece) {
        piece.position = { row, col };
      }
    }
  }

  /**
   * Remove piece from board
   */
  removePiece(row, col) {
    if (this.isValidPosition(row, col)) {
      const piece = this.squares[row][col];
      this.squares[row][col] = null;
      return piece;
    }
    return null;
  }

  /**
   * Check if position is within board bounds
   */
  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  /**
   * Check if square is empty
   */
  isEmpty(row, col) {
    return this.isValidPosition(row, col) && this.squares[row][col] === null;
  }

  /**
   * Clear the entire board
   */
  clear() {
    this.squares = this.initializeBoard();
  }

  /**
   * Get all pieces of a specific color
   */
  getPiecesByColor(color) {
    const pieces = [];
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const piece = this.squares[row][col];
        if (piece && piece.color === color) {
          pieces.push(piece);
        }
      }
    }
    return pieces;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Board;
}
