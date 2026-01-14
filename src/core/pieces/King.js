/**
 * King.js - Fantasy Chess King piece
 */

class King {
  constructor(color) {
    this.color = color;
    this.type = 'king';
    this.name = 'King';
    this.position = null;
    this.hasMoved = false;
    this.specialAbility = 'Royal Command';
  }

  /**
   * King can move one square in any direction
   */
  getValidMoves(board) {
    const moves = [];
    if (!this.position) return moves;

    const { row, col } = this.position;
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (board.isValidPosition(newRow, newCol)) {
        const targetPiece = board.getPiece(newRow, newCol);
        // Can move to empty square or capture enemy
        if (!targetPiece || targetPiece.color !== this.color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }

    return moves;
  }

  canMoveTo(board, targetRow, targetCol) {
    const moves = this.getValidMoves(board);
    return moves.some(move => move.row === targetRow && move.col === targetCol);
  }

  moveTo(row, col) {
    this.position = { row, col };
    this.hasMoved = true;
  }

  getSymbol() {
    return this.color === 'white' ? '♔' : '♚';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = King;
}
