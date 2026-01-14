/**
 * BoardRenderer.js - Handles rendering the chess board to the DOM
 */

class BoardRenderer {
  constructor(boardElement) {
    this.boardElement = boardElement;
    this.selectedSquare = null;
    this.validMoves = [];
  }

  /**
   * Render the entire chess board
   */
  render(board) {
    this.boardElement.innerHTML = '';

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.createSquare(row, col, board);
        this.boardElement.appendChild(square);
      }
    }
  }

  /**
   * Create a single square element
   */
  createSquare(row, col, board) {
    const square = document.createElement('div');
    square.className = 'square';
    square.dataset.row = row;
    square.dataset.col = col;

    // Add light/dark coloring
    const isLight = (row + col) % 2 === 0;
    square.classList.add(isLight ? 'light' : 'dark');

    // Add piece if present
    const piece = board.getPiece(row, col);
    if (piece) {
      square.textContent = piece.getSymbol();
      square.dataset.piece = piece.type;
      square.dataset.color = piece.color;
    }

    return square;
  }

  /**
   * Highlight a square as selected
   */
  selectSquare(row, col) {
    this.clearSelection();
    const square = this.getSquareElement(row, col);
    if (square) {
      square.classList.add('selected');
      this.selectedSquare = { row, col };
    }
  }

  /**
   * Clear all selections and highlights
   */
  clearSelection() {
    const selected = this.boardElement.querySelectorAll('.selected');
    selected.forEach(sq => sq.classList.remove('selected'));
    
    const validMoves = this.boardElement.querySelectorAll('.valid-move');
    validMoves.forEach(sq => sq.classList.remove('valid-move'));
    
    this.selectedSquare = null;
    this.validMoves = [];
  }

  /**
   * Highlight valid moves for a piece
   */
  highlightValidMoves(moves) {
    this.validMoves = moves;
    moves.forEach(move => {
      const square = this.getSquareElement(move.row, move.col);
      if (square) {
        square.classList.add('valid-move');
      }
    });
  }

  /**
   * Get square element by position
   */
  getSquareElement(row, col) {
    return this.boardElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }

  /**
   * Update captured pieces display
   */
  updateCapturedPieces(capturedPieces) {
    const whiteList = document.querySelector('#captured-white .pieces-list');
    const blackList = document.querySelector('#captured-black .pieces-list');

    if (whiteList) {
      whiteList.innerHTML = capturedPieces.white.map(p => p.getSymbol()).join(' ');
    }

    if (blackList) {
      blackList.innerHTML = capturedPieces.black.map(p => p.getSymbol()).join(' ');
    }
  }

  /**
   * Update current player display
   */
  updatePlayerDisplay(player) {
    const playerElement = document.getElementById('current-player');
    if (playerElement) {
      playerElement.textContent = player.charAt(0).toUpperCase() + player.slice(1);
      playerElement.style.color = player === 'white' ? '#fff' : '#333';
    }
  }

  /**
   * Update game status display
   */
  updateGameStatus(status) {
    const statusElement = document.getElementById('game-status');
    if (statusElement) {
      statusElement.textContent = status;
    }
  }

  /**
   * Add move to history display
   */
  addMoveToHistory(move, moveNumber) {
    const movesList = document.getElementById('moves-list');
    if (!movesList) return;

    // Remove empty message
    const emptyMsg = movesList.querySelector('.empty-message');
    if (emptyMsg) {
      emptyMsg.remove();
    }

    const moveElement = document.createElement('p');
    const fromPos = `${String.fromCharCode(97 + move.from.col)}${8 - move.from.row}`;
    const toPos = `${String.fromCharCode(97 + move.to.col)}${8 - move.to.row}`;
    const captureSymbol = move.captured ? 'x' : '-';
    
    moveElement.textContent = `${moveNumber}. ${move.player}: ${move.piece} ${fromPos}${captureSymbol}${toPos}`;
    movesList.appendChild(moveElement);
    
    // Scroll to bottom
    movesList.scrollTop = movesList.scrollHeight;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BoardRenderer;
}
