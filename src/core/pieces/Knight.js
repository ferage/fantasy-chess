/**
 * Knight.js - Fantasy Chess Knight piece (Dragon Rider)
 */

class Knight {
  constructor(color) {
    this.color = color;
    this.type = 'knight';
    this.name = 'Dragon Rider';
    this.position = null;
    this.hasMoved = false;
    this.specialAbility = 'Leap of Faith';
  }

  /**
   * Knight moves in an L-shape: 2 squares in one direction and 1 square perpendicular
   * Knights can jump over other pieces
   */
  getValidMoves(board) {
    const moves = [];
    if (!this.position) return moves;

    const { row, col } = this.position;
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2],  [1, 2],  [2, -1],  [2, 1]
    ];

    for (const [dRow, dCol] of knightMoves) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (board.isValidPosition(newRow, newCol)) {
        const targetPiece = board.getPiece(newRow, newCol);
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
    return this.color === 'white' ? '♘' : '♞';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Knight;
}
