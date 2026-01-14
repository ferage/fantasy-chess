// Piece definitions and movement rules for Fantasy Chess

const PieceTypes = {
  WIZARD: 'wizard',
  BEAST: 'beast',
  DWARF: 'dwarf',
  ARCHER: 'archer',
  KNIGHT: 'knight',
  ROOK: 'rook'
};

const AttackTypes = {
  MELEE: 'melee',
  RANGED: 'ranged',
  SHOOTING: 'shooting'
};

class Piece {
  constructor(type, color, position) {
    this.type = type;
    this.color = color; // 'white' or 'black'
    this.position = position; // {x, y}
    this.hasMoved = false;
    this.isAlive = true;
  }

  getMovementPattern() {
    const patterns = {
      [PieceTypes.WIZARD]: this.getWizardMoves(),
      [PieceTypes.BEAST]: this.getBeastMoves(),
      [PieceTypes.DWARF]: this.getDwarfMoves(),
      [PieceTypes.ARCHER]: this.getArcherMoves(),
      [PieceTypes.KNIGHT]: this.getKnightMoves(),
      [PieceTypes.ROOK]: this.getRookMoves()
    };
    return patterns[this.type] || [];
  }

  getWizardMoves() {
    // Wizard can move 1 square in any direction (like a king)
    return [
      {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1},
      {dx: -1, dy: 0}, {dx: 1, dy: 0},
      {dx: -1, dy: 1}, {dx: 0, dy: 1}, {dx: 1, dy: 1}
    ];
  }

  getBeastMoves() {
    // Beast can move 2 squares in any direction
    const moves = [];
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        if (dx !== 0 || dy !== 0) {
          moves.push({dx, dy});
        }
      }
    }
    return moves;
  }

  getDwarfMoves() {
    // Dwarf can move 1 square horizontally or vertically
    return [
      {dx: 0, dy: -1}, {dx: 0, dy: 1},
      {dx: -1, dy: 0}, {dx: 1, dy: 0}
    ];
  }

  getArcherMoves() {
    // Archer can move 1 square in any direction
    return [
      {dx: -1, dy: -1}, {dx: 0, dy: -1}, {dx: 1, dy: -1},
      {dx: -1, dy: 0}, {dx: 1, dy: 0},
      {dx: -1, dy: 1}, {dx: 0, dy: 1}, {dx: 1, dy: 1}
    ];
  }

  getKnightMoves() {
    // Knight moves in L-shape
    return [
      {dx: -2, dy: -1}, {dx: -2, dy: 1},
      {dx: -1, dy: -2}, {dx: -1, dy: 2},
      {dx: 1, dy: -2}, {dx: 1, dy: 2},
      {dx: 2, dy: -1}, {dx: 2, dy: 1}
    ];
  }

  getRookMoves() {
    // Rook can move any number of squares horizontally or vertically
    const moves = [];
    for (let i = 1; i <= 7; i++) {
      moves.push({dx: i, dy: 0}, {dx: -i, dy: 0});
      moves.push({dx: 0, dy: i}, {dx: 0, dy: -i});
    }
    return moves;
  }

  getAttackType() {
    const attackTypes = {
      [PieceTypes.WIZARD]: AttackTypes.MELEE,
      [PieceTypes.BEAST]: AttackTypes.MELEE,
      [PieceTypes.DWARF]: AttackTypes.MELEE,
      [PieceTypes.ARCHER]: AttackTypes.RANGED,
      [PieceTypes.KNIGHT]: AttackTypes.MELEE,
      [PieceTypes.ROOK]: AttackTypes.MELEE
    };
    return attackTypes[this.type];
  }

  getShootingRange() {
    // Only archers and some pieces can shoot
    if (this.type === PieceTypes.ARCHER) {
      return 3; // Can shoot up to 3 squares away
    }
    return 0;
  }

  canShoot() {
    return this.getShootingRange() > 0;
  }
}

// Initial board setup
function getInitialPieceSetup() {
  const pieces = [];
  
  // White pieces (bottom)
  pieces.push(new Piece(PieceTypes.ROOK, 'white', {x: 0, y: 7}));
  pieces.push(new Piece(PieceTypes.KNIGHT, 'white', {x: 1, y: 7}));
  pieces.push(new Piece(PieceTypes.DWARF, 'white', {x: 2, y: 7}));
  pieces.push(new Piece(PieceTypes.WIZARD, 'white', {x: 3, y: 7}));
  pieces.push(new Piece(PieceTypes.BEAST, 'white', {x: 4, y: 7}));
  pieces.push(new Piece(PieceTypes.DWARF, 'white', {x: 5, y: 7}));
  pieces.push(new Piece(PieceTypes.KNIGHT, 'white', {x: 6, y: 7}));
  pieces.push(new Piece(PieceTypes.ROOK, 'white', {x: 7, y: 7}));
  
  // White archers (second row)
  for (let i = 0; i < 8; i++) {
    pieces.push(new Piece(PieceTypes.ARCHER, 'white', {x: i, y: 6}));
  }
  
  // Black pieces (top)
  pieces.push(new Piece(PieceTypes.ROOK, 'black', {x: 0, y: 0}));
  pieces.push(new Piece(PieceTypes.KNIGHT, 'black', {x: 1, y: 0}));
  pieces.push(new Piece(PieceTypes.DWARF, 'black', {x: 2, y: 0}));
  pieces.push(new Piece(PieceTypes.WIZARD, 'black', {x: 3, y: 0}));
  pieces.push(new Piece(PieceTypes.BEAST, 'black', {x: 4, y: 0}));
  pieces.push(new Piece(PieceTypes.DWARF, 'black', {x: 5, y: 0}));
  pieces.push(new Piece(PieceTypes.KNIGHT, 'black', {x: 6, y: 0}));
  pieces.push(new Piece(PieceTypes.ROOK, 'black', {x: 7, y: 0}));
  
  // Black archers (second row)
  for (let i = 0; i < 8; i++) {
    pieces.push(new Piece(PieceTypes.ARCHER, 'black', {x: i, y: 1}));
  }
  
  return pieces;
}

module.exports = {
  Piece,
  PieceTypes,
  AttackTypes,
  getInitialPieceSetup
};
