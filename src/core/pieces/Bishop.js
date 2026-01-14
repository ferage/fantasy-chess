/**
 * Bishop.js - Fantasy Chess Bishop piece (Mystic Bishop)
 */

class Bishop {
  constructor(color) {
    this.color = color;
    this.type = 'bishop';
    this.name = 'Mystic Bishop';
    this.position = null;
    this.hasMoved = false;
    this.specialAbility = 'Divine Light';
  }

  /**
   * Bishop moves diagonally any number of squares
   */
  getValidMoves(board) {
    const moves = [];
    if (!this.position) return moves;

    const { row, col } = this.position;
    const directions = [
      [-1, -1], [-1, 1],
      [1, -1],  [1, 1]
    ];

    for (const [dRow, dCol] of directions) {
      let newRow = row + dRow;
      let newCol = col + dCol;

      while (board.isValidPosition(newRow, newCol)) {
        const targetPiece = board.getPiece(newRow, newCol);
        
        if (!targetPiece) {
          moves.push({ row: newRow, col: newCol });
        } else {
          if (targetPiece.color !== this.color) {
            moves.push({ row: newRow, col: newCol });
          }
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
    return this.color === 'white' ? '♗' : '♝';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Bishop;
}
