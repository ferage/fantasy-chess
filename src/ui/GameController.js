/**
 * GameController.js - Handles game logic and user interactions
 */

class GameController {
  constructor(game, board, renderer) {
    this.game = game;
    this.board = board;
    this.renderer = renderer;
    this.selectedPiece = null;
    this.selectedPosition = null;
  }

  /**
   * Initialize the game controller
   */
  initialize() {
    this.game.initialize(this.board);
    this.setupEventListeners();
    this.renderer.render(this.board);
    this.updateDisplay();
  }

  /**
   * Setup event listeners for user interactions
   */
  setupEventListeners() {
    // Board click handler
    const boardElement = document.getElementById('chess-board');
    if (boardElement) {
      boardElement.addEventListener('click', (e) => this.handleSquareClick(e));
    }

    // New game button
    const newGameBtn = document.getElementById('new-game-btn');
    if (newGameBtn) {
      newGameBtn.addEventListener('click', () => this.startNewGame());
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetGame());
    }
  }

  /**
   * Handle click on a board square
   */
  handleSquareClick(event) {
    const square = event.target.closest('.square');
    if (!square) return;

    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);

    if (this.selectedPiece) {
      // Try to move the selected piece
      this.attemptMove(row, col);
    } else {
      // Try to select a piece
      this.selectPiece(row, col);
    }
  }

  /**
   * Select a piece at the given position
   */
  selectPiece(row, col) {
    const piece = this.board.getPiece(row, col);

    if (!piece) {
      return;
    }

    if (piece.color !== this.game.currentPlayer) {
      this.renderer.updateGameStatus('Not your piece!');
      return;
    }

    this.selectedPiece = piece;
    this.selectedPosition = { row, col };
    this.renderer.selectSquare(row, col);

    const validMoves = piece.getValidMoves(this.board);
    this.renderer.highlightValidMoves(validMoves);
    this.renderer.updateGameStatus(`Selected ${piece.name}. Choose destination.`);
  }

  /**
   * Attempt to move the selected piece
   */
  attemptMove(toRow, toCol) {
    if (!this.selectedPiece || !this.selectedPosition) {
      return;
    }

    const { row: fromRow, col: fromCol } = this.selectedPosition;

    // If clicking the same square, deselect
    if (fromRow === toRow && fromCol === toCol) {
      this.clearSelection();
      return;
    }

    // Attempt the move
    const result = this.game.makeMove(fromRow, fromCol, toRow, toCol);

    if (result.success) {
      this.renderer.render(this.board);
      this.updateDisplay();
      this.renderer.addMoveToHistory(
        this.game.moveHistory[this.game.moveHistory.length - 1],
        this.game.moveHistory.length
      );
      this.clearSelection();
    } else {
      this.renderer.updateGameStatus(`Invalid move: ${result.error}`);
      // Allow selecting a different piece
      this.clearSelection();
      this.selectPiece(toRow, toCol);
    }
  }

  /**
   * Clear piece selection
   */
  clearSelection() {
    this.selectedPiece = null;
    this.selectedPosition = null;
    this.renderer.clearSelection();
    this.renderer.updateGameStatus('Select a piece to move');
  }

  /**
   * Update all display elements
   */
  updateDisplay() {
    const status = this.game.getStatus();
    this.renderer.updatePlayerDisplay(status.currentPlayer);
    this.renderer.updateCapturedPieces(status.capturedPieces);

    let statusText = 'Your turn';
    if (this.game.isGameOver()) {
      statusText = `Game Over: ${status.gameState}`;
    }
    this.renderer.updateGameStatus(statusText);
  }

  /**
   * Start a new game
   */
  startNewGame() {
    this.resetGame();
    this.setupInitialPosition();
    this.renderer.updateGameStatus('New game started!');
  }

  /**
   * Reset the game
   */
  resetGame() {
    this.game.reset();
    this.board.clear();
    this.clearSelection();
    this.renderer.render(this.board);
    this.updateDisplay();
    
    // Clear move history
    const movesList = document.getElementById('moves-list');
    if (movesList) {
      movesList.innerHTML = '<p class="empty-message">No moves yet</p>';
    }
  }

  /**
   * Setup initial piece positions (simplified setup)
   */
  setupInitialPosition() {
    // Setup white pieces (bottom)
    this.board.setPiece(7, 0, new Rook('white'));
    this.board.setPiece(7, 1, new Knight('white'));
    this.board.setPiece(7, 2, new Bishop('white'));
    this.board.setPiece(7, 3, new Queen('white'));
    this.board.setPiece(7, 4, new King('white'));
    this.board.setPiece(7, 5, new Bishop('white'));
    this.board.setPiece(7, 6, new Knight('white'));
    this.board.setPiece(7, 7, new Rook('white'));
    
    // White pawns
    for (let col = 0; col < 8; col++) {
      this.board.setPiece(6, col, new Pawn('white'));
    }
    
    // Setup black pieces (top)
    this.board.setPiece(0, 0, new Rook('black'));
    this.board.setPiece(0, 1, new Knight('black'));
    this.board.setPiece(0, 2, new Bishop('black'));
    this.board.setPiece(0, 3, new Queen('black'));
    this.board.setPiece(0, 4, new King('black'));
    this.board.setPiece(0, 5, new Bishop('black'));
    this.board.setPiece(0, 6, new Knight('black'));
    this.board.setPiece(0, 7, new Rook('black'));
    
    // Black pawns
    for (let col = 0; col < 8; col++) {
      this.board.setPiece(1, col, new Pawn('black'));
    }

    this.game.initialize(this.board);
    this.renderer.render(this.board);
    this.updateDisplay();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameController;
}
