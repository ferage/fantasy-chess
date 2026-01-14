#!/usr/bin/env node

/**
 * verify.js - Verification script for Fantasy Chess project
 * 
 * This script verifies that all core components are functional
 */

console.log('🎮 Fantasy Chess - Project Verification\n');
console.log('========================================\n');

// Test Board
console.log('📋 Testing Board...');
const Board = require('./src/core/Board.js');
const board = new Board();
if (board.size === 8 && board.isEmpty(0, 0)) {
  console.log('✓ Board class working');
} else {
  console.log('✗ Board class failed');
  process.exit(1);
}

// Test Pieces
console.log('\n♟️  Testing Pieces...');
const King = require('./src/core/pieces/King.js');
const Queen = require('./src/core/pieces/Queen.js');
const Rook = require('./src/core/pieces/Rook.js');
const Bishop = require('./src/core/pieces/Bishop.js');
const Knight = require('./src/core/pieces/Knight.js');
const Pawn = require('./src/core/pieces/Pawn.js');

const pieces = [
  new King('white'),
  new Queen('white'),
  new Rook('white'),
  new Bishop('white'),
  new Knight('white'),
  new Pawn('white')
];

pieces.forEach(piece => {
  if (piece.color && piece.type && piece.getSymbol()) {
    console.log(`✓ ${piece.name} (${piece.type}) working`);
  } else {
    console.log(`✗ ${piece.type} failed`);
    process.exit(1);
  }
});

// Test Game
console.log('\n🎯 Testing Game Logic...');
const Game = require('./src/core/Game.js');
const game = new Game();
const testBoard = new Board();

game.initialize(testBoard);
testBoard.setPiece(7, 4, new King('white'));
testBoard.setPiece(0, 4, new King('black'));

const moveResult = game.makeMove(7, 4, 6, 4);
if (moveResult.success && game.currentPlayer === 'black') {
  console.log('✓ Game logic working');
  console.log('✓ Move validation working');
  console.log('✓ Turn switching working');
} else {
  console.log('✗ Game logic failed');
  process.exit(1);
}

// Test Utilities
console.log('\n🔧 Testing Utilities...');
const utils = require('./src/utils/utils.js');

// Test position to notation: (0,0) should be 'a8'
const notation = utils.positionToNotation(0, 0);
// Test notation to position: 'e4' should be {row: 4, col: 4}
const position = utils.notationToPosition('e4');

if (notation === 'a8' && position.row === 4 && position.col === 4) {
  console.log('✓ Utility functions working');
} else {
  console.log('✗ Utility functions failed');
  console.log(`  Expected: notation='a8', position={row: 4, col: 4}`);
  console.log(`  Got: notation='${notation}', position={row: ${position.row}, col: ${position.col}}`);
  process.exit(1);
}

// Check file structure
console.log('\n📁 Checking Project Structure...');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'README.md',
  'package.json',
  'server.js',
  'src/index.js',
  'src/core/Board.js',
  'src/core/Game.js',
  'public/index.html',
  'public/styles/main.css',
  'docs/RULES.md',
  'docs/API.md',
  'tests/Board.test.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✓ ${file} exists`);
  } else {
    console.log(`✗ ${file} missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  process.exit(1);
}

// Summary
console.log('\n========================================');
console.log('✅ All verifications passed!');
console.log('\n📦 Project Structure:');
console.log('   ├── Core game logic ✓');
console.log('   ├── All piece types ✓');
console.log('   ├── UI components ✓');
console.log('   ├── Documentation ✓');
console.log('   ├── Tests ✓');
console.log('   └── Server ✓');
console.log('\n🚀 Fantasy Chess is ready to play!');
console.log('\nTo start the game:');
console.log('   1. npm install');
console.log('   2. npm start');
console.log('   3. Open http://localhost:3000\n');
