/**
 * Pawn.js - Fantasy Chess Pawn piece (Warrior)
 */

class Pawn {
  constructor(color) {
    this.color = color;
    this.type = 'pawn';
    this.name = 'Warrior';
    this.position = null;
    this.hasMoved = false;
    this.specialAbility = 'Shield Wall';
  }

  /**
   * Pawn moves forward one square (or two from starting position)
   * Captures diagonally
   */
  getValidMoves(board) {
    const moves = [];
    if (!this.position) return moves;

    const { row, col } = this.position;
    const direction = this.color === 'white' ? -1 : 1; // White moves up, black moves down
    const startRow = this.color === 'white' ? 6 : 1;

    // Move forward one square
    const oneStep = row + direction;
    if (board.isValidPosition(oneStep, col) && board.isEmpty(oneStep, col)) {
      moves.push({ row: oneStep, col });

      // Move forward two squares from starting position
      if (!this.hasMoved && row === startRow) {
        const twoSteps = row + (direction * 2);
        if (board.isValidPosition(twoSteps, col) && board.isEmpty(twoSteps, col)) {
          moves.push({ row: twoSteps, col });
        }
      }
    }

    // Capture diagonally
    const capturePositions = [
      { row: oneStep, col: col - 1 },
      { row: oneStep, col: col + 1 }
    ];

    for (const pos of capturePositions) {
      if (board.isValidPosition(pos.row, pos.col)) {
        const targetPiece = board.getPiece(pos.row, pos.col);
        if (targetPiece && targetPiece.color !== this.color) {
          moves.push(pos);
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
    return this.color === 'white' ? '♙' : '♟';
  }

  /**
   * Check if pawn can be promoted
   */
  canPromote() {
    if (!this.position) return false;
    const promotionRow = this.color === 'white' ? 0 : 7;
    return this.position.row === promotionRow;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Pawn;
}
