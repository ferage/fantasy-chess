// Board and special tile definitions

const TileTypes = {
  NORMAL: 'normal',
  PROTECTED: 'protected',
  OBJECTIVE: 'objective'
};

const TileColors = {
  LIGHT: 'light',
  DARK: 'dark'
};

class Board {
  constructor() {
    this.size = 8;
    this.tiles = this.initializeBoard();
  }

  initializeBoard() {
    const board = [];
    for (let y = 0; y < this.size; y++) {
      const row = [];
      for (let x = 0; x < this.size; x++) {
        row.push(this.createTile(x, y));
      }
      board.push(row);
    }
    return board;
  }

  createTile(x, y) {
    const tile = {
      x,
      y,
      color: this.getTileColor(x, y),
      type: this.getTileType(x, y),
      piece: null,
      effects: [] // For spell effects
    };
    return tile;
  }

  getTileColor(x, y) {
    // Alternating pattern
    return (x + y) % 2 === 0 ? TileColors.LIGHT : TileColors.DARK;
  }

  getTileType(x, y) {
    // Protected zones on edges (first and last rows/columns)
    if (y === 0 || y === 7 || x === 0 || x === 7) {
      return TileTypes.PROTECTED;
    }
    
    // Objective tiles in center (3,3), (3,4), (4,3), (4,4)
    if ((x === 3 || x === 4) && (y === 3 || y === 4)) {
      return TileTypes.OBJECTIVE;
    }
    
    return TileTypes.NORMAL;
  }

  isValidPosition(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  getTile(x, y) {
    if (!this.isValidPosition(x, y)) {
      return null;
    }
    return this.tiles[y][x];
  }

  setPiece(x, y, piece) {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.piece = piece;
      if (piece) {
        piece.position = {x, y};
      }
    }
  }

  getPiece(x, y) {
    const tile = this.getTile(x, y);
    return tile ? tile.piece : null;
  }

  removePiece(x, y) {
    const tile = this.getTile(x, y);
    if (tile) {
      const piece = tile.piece;
      tile.piece = null;
      return piece;
    }
    return null;
  }

  movePiece(fromX, fromY, toX, toY) {
    const piece = this.removePiece(fromX, fromY);
    if (piece) {
      this.setPiece(toX, toY, piece);
      piece.hasMoved = true;
    }
    return piece;
  }

  addEffect(x, y, effect) {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.effects.push(effect);
    }
  }

  removeEffect(x, y, effectId) {
    const tile = this.getTile(x, y);
    if (tile) {
      tile.effects = tile.effects.filter(e => e.id !== effectId);
    }
  }

  getEffects(x, y) {
    const tile = this.getTile(x, y);
    return tile ? tile.effects : [];
  }
}

module.exports = {
  Board,
  TileTypes,
  TileColors
};
