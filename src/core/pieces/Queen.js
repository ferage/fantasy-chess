/**
 * Queen.js - Fantasy Chess Queen piece (Sorceress)
 */

class Queen {
  constructor(color) {
    this.color = color;
    this.type = 'queen';
    this.name = 'Sorceress Queen';
    this.position = null;
    this.hasMoved = false;
    this.specialAbility = 'Arcane Blast';
  }

  /**
   * Queen can move any number of squares in any direction (horizontal, vertical, or diagonal)
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
      let newRow = row + dRow;
      let newCol = col + dCol;

      while (board.isValidPosition(newRow, newCol)) {
        const targetPiece = board.getPiece(newRow, newCol);
        
        if (!targetPiece) {
          // Empty square - can move here
          moves.push({ row: newRow, col: newCol });
        } else {
          // Piece found
          if (targetPiece.color !== this.color) {
            // Enemy piece - can capture
            moves.push({ row: newRow, col: newCol });
          }
          // Can't move past any piece
          break;
        }

        newRow += dRow;
        newCol += dCol;
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
    return this.color === 'white' ? '♕' : '♛';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Queen;
}
