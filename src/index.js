/**
 * index.js - Main entry point for Fantasy Chess
 */

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Fantasy Chess - Initializing...');

  // Create game instances
  const board = new Board();
  const game = new Game();
  const boardElement = document.getElementById('chess-board');
  const renderer = new BoardRenderer(boardElement);
  const controller = new GameController(game, board, renderer);

  // Initialize the game
  controller.initialize();

  // Setup initial board position
  controller.setupInitialPosition();

  console.log('✅ Fantasy Chess - Ready to play!');
  console.log('⚔️ Select a piece to begin your magical adventure!');
});
