// Visual board display test
const GameState = require('../src/game/gameState');

console.log('Fantasy Chess - Board Display Test\n');

const game = new GameState('demo-game', { white: 'player1', black: 'ai' });

// Function to display the board
function displayBoard(game) {
  console.log('\n   0  1  2  3  4  5  6  7');
  console.log('  ┌──┬──┬──┬──┬──┬──┬──┬──┐');
  
  for (let y = 0; y < 8; y++) {
    let rowStr = `${y} │`;
    for (let x = 0; x < 8; x++) {
      const piece = game.pieces.find(p => 
        p.position.x === x && p.position.y === y && p.isAlive
      );
      
      if (piece) {
        const symbols = {
          wizard: piece.color === 'white' ? '🧙' : '🧙🏿',
          beast: piece.color === 'white' ? '🐺' : '🐻',
          dwarf: piece.color === 'white' ? '⛏️' : '⚒️',
          archer: piece.color === 'white' ? '🏹' : '🎯',
          knight: piece.color === 'white' ? '🗡️' : '⚔️',
          rook: piece.color === 'white' ? '🏰' : '🏛️'
        };
        rowStr += symbols[piece.type] || '?';
      } else {
        const tile = game.board.getTile(x, y);
        if (tile.type === 'objective') {
          rowStr += '🔵';
        } else if (tile.type === 'protected') {
          rowStr += '🛡️';
        } else {
          rowStr += '  ';
        }
      }
      rowStr += '│';
    }
    console.log(rowStr);
    if (y < 7) {
      console.log('  ├──┼──┼──┼──┼──┼──┼──┼──┤');
    }
  }
  console.log('  └──┴──┴──┴──┴──┴──┴──┴──┘');
}

console.log('Initial Board Setup:');
displayBoard(game);

console.log('\n\nPiece Legend:');
console.log('White pieces: 🧙 Wizard, 🐺 Beast, ⛏️  Dwarf, 🏹 Archer, 🗡️  Knight, 🏰 Rook');
console.log('Black pieces: 🧙🏿 Wizard, 🐻 Beast, ⚒️  Dwarf, 🎯 Archer, ⚔️  Knight, 🏛️  Rook');
console.log('Special tiles: 🔵 Objective, 🛡️  Protected Zone');

console.log('\n\nTesting a few moves...\n');

// Move white archer forward
console.log('1. Moving white archer from (0,6) to (0,5)');
game.makeMove(0, 6, 0, 5);
displayBoard(game);

game.endTurn();
console.log('\n\nTurn: ' + game.currentTurn);

// AI makes a move
const AIPlayer = require('../src/ai/aiPlayer');
const ai = new AIPlayer('black', 'medium');
console.log('\n2. AI (black) makes a move...');
const aiMove = ai.makeMove(game);
if (aiMove && aiMove.type === 'move') {
  game.makeMove(aiMove.from.x, aiMove.from.y, aiMove.to.x, aiMove.to.y);
  console.log(`   AI moved ${aiMove.piece.type} from (${aiMove.from.x},${aiMove.from.y}) to (${aiMove.to.x},${aiMove.to.y})`);
}
displayBoard(game);

console.log('\n\n✅ Visual board test complete!');
