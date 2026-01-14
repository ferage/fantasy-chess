/**
 * Board.test.js - Tests for the Board class
 */

const Board = require('../src/core/Board');

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  test('should initialize an 8x8 board', () => {
    expect(board.size).toBe(8);
    expect(board.squares.length).toBe(8);
    expect(board.squares[0].length).toBe(8);
  });

  test('should start with all empty squares', () => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        expect(board.getPiece(row, col)).toBeNull();
      }
    }
  });

  test('should validate positions correctly', () => {
    expect(board.isValidPosition(0, 0)).toBe(true);
    expect(board.isValidPosition(7, 7)).toBe(true);
    expect(board.isValidPosition(-1, 0)).toBe(false);
    expect(board.isValidPosition(0, 8)).toBe(false);
    expect(board.isValidPosition(8, 0)).toBe(false);
  });

  test('should check if square is empty', () => {
    expect(board.isEmpty(0, 0)).toBe(true);
    
    const mockPiece = { type: 'king', color: 'white' };
    board.setPiece(0, 0, mockPiece);
    
    expect(board.isEmpty(0, 0)).toBe(false);
  });

  test('should set and get pieces correctly', () => {
    const mockPiece = { type: 'king', color: 'white', position: null };
    board.setPiece(3, 4, mockPiece);
    
    const retrievedPiece = board.getPiece(3, 4);
    expect(retrievedPiece).toBe(mockPiece);
    expect(retrievedPiece.position).toEqual({ row: 3, col: 4 });
  });

  test('should remove pieces correctly', () => {
    const mockPiece = { type: 'king', color: 'white', position: null };
    board.setPiece(3, 4, mockPiece);
    
    const removedPiece = board.removePiece(3, 4);
    expect(removedPiece).toBe(mockPiece);
    expect(board.getPiece(3, 4)).toBeNull();
  });

  test('should clear the board', () => {
    const mockPiece1 = { type: 'king', color: 'white', position: null };
    const mockPiece2 = { type: 'queen', color: 'black', position: null };
    
    board.setPiece(0, 0, mockPiece1);
    board.setPiece(7, 7, mockPiece2);
    
    board.clear();
    
    expect(board.getPiece(0, 0)).toBeNull();
    expect(board.getPiece(7, 7)).toBeNull();
  });

  test('should get pieces by color', () => {
    const whitePiece1 = { type: 'king', color: 'white', position: null };
    const whitePiece2 = { type: 'queen', color: 'white', position: null };
    const blackPiece = { type: 'king', color: 'black', position: null };
    
    board.setPiece(0, 0, whitePiece1);
    board.setPiece(1, 1, whitePiece2);
    board.setPiece(7, 7, blackPiece);
    
    const whitePieces = board.getPiecesByColor('white');
    const blackPieces = board.getPiecesByColor('black');
    
    expect(whitePieces.length).toBe(2);
    expect(blackPieces.length).toBe(1);
    expect(whitePieces).toContain(whitePiece1);
    expect(whitePieces).toContain(whitePiece2);
    expect(blackPieces).toContain(blackPiece);
  });
});
