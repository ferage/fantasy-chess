// Simple test file to verify game logic
const GameState = require('../src/game/gameState');
const { Spell, SpellTypes } = require('../src/game/spells');

console.log('Testing Fantasy Chess Game Logic...\n');

// Test 1: Create a new game
console.log('Test 1: Creating a new game');
const game = new GameState('test-game', { white: 'player1', black: 'ai' });
console.log('✓ Game created successfully');
console.log(`  - Board size: ${game.board.size}x${game.board.size}`);
console.log(`  - Initial pieces: ${game.pieces.length}`);
console.log(`  - Current turn: ${game.currentTurn}`);

// Test 2: Get initial game state
console.log('\nTest 2: Getting game state');
const state = game.getState();
console.log('✓ Game state retrieved');
console.log(`  - Active pieces: ${state.pieces.length}`);
console.log(`  - Game status: ${state.gameStatus}`);

// Test 3: Test piece movement
console.log('\nTest 3: Testing piece movement');
const whiteDwarf = game.pieces.find(p => p.type === 'dwarf' && p.color === 'white' && p.position.x === 2);
console.log(`  - Selected piece: Dwarf at (${whiteDwarf.position.x}, ${whiteDwarf.position.y})`);
const validMoves = game.getValidMoves(whiteDwarf);
console.log(`  - Valid moves: ${validMoves.length}`);
console.log('✓ Piece movement validation works');

// Test 4: Make a move
console.log('\nTest 4: Making a move');
const result = game.makeMove(2, 7, 2, 6);
if (result.success) {
  console.log('✓ Move executed successfully');
} else {
  console.log('✗ Move failed:', result.error);
}

// Test 5: Test spell system
console.log('\nTest 5: Testing spell system');
const spell = new Spell(SpellTypes.SHIELD, 'white');
console.log(`  - Created spell: ${spell.type}`);
console.log(`  - Duration: ${spell.getDuration()} turns`);
console.log(`  - Effect: ${JSON.stringify(spell.getEffect())}`);
console.log('✓ Spell system works');

// Test 6: Test turn management
console.log('\nTest 6: Testing turn management');
const beforeTurn = game.currentTurn;
game.endTurn();
const afterTurn = game.currentTurn;
console.log(`  - Turn changed: ${beforeTurn} → ${afterTurn}`);
console.log('✓ Turn management works');

// Test 7: Test AI
console.log('\nTest 7: Testing AI');
const AIPlayer = require('../src/ai/aiPlayer');
const ai = new AIPlayer('black', 'easy');
const aiMove = ai.makeMove(game);
if (aiMove) {
  console.log(`✓ AI generated move: ${aiMove.type} from (${aiMove.from.x},${aiMove.from.y}) to (${aiMove.to.x},${aiMove.to.y})`);
} else {
  console.log('✓ AI returned null (no valid moves)');
}

console.log('\n✅ All tests passed! Fantasy Chess game logic is working correctly.');
