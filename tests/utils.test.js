/**
 * utils.test.js - Tests for utility functions
 */

const {
  positionToNotation,
  notationToPosition,
  isSamePosition,
  calculateDistance,
  getPositionsBetween
} = require('../src/utils/utils');

describe('Utility Functions', () => {
  describe('positionToNotation', () => {
    test('should convert position to chess notation', () => {
      expect(positionToNotation(0, 0)).toBe('a8');
      expect(positionToNotation(7, 7)).toBe('h1');
      expect(positionToNotation(0, 4)).toBe('e8');
      expect(positionToNotation(7, 4)).toBe('e1');
    });
  });

  describe('notationToPosition', () => {
    test('should convert chess notation to position', () => {
      expect(notationToPosition('a8')).toEqual({ row: 0, col: 0 });
      expect(notationToPosition('h1')).toEqual({ row: 7, col: 7 });
      expect(notationToPosition('e4')).toEqual({ row: 4, col: 4 });
    });

    test('should return null for invalid notation', () => {
      expect(notationToPosition('')).toBeNull();
      expect(notationToPosition('z9')).toBeNull();
      expect(notationToPosition('a0')).toBeNull();
    });
  });

  describe('isSamePosition', () => {
    test('should correctly identify same positions', () => {
      expect(isSamePosition({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(true);
      expect(isSamePosition({ row: 3, col: 4 }, { row: 3, col: 4 })).toBe(true);
    });

    test('should correctly identify different positions', () => {
      expect(isSamePosition({ row: 0, col: 0 }, { row: 0, col: 1 })).toBe(false);
      expect(isSamePosition({ row: 0, col: 0 }, { row: 1, col: 0 })).toBe(false);
    });
  });

  describe('calculateDistance', () => {
    test('should calculate distance between positions', () => {
      expect(calculateDistance({ row: 0, col: 0 }, { row: 0, col: 0 })).toBe(0);
      expect(calculateDistance({ row: 0, col: 0 }, { row: 0, col: 3 })).toBe(3);
      expect(calculateDistance({ row: 0, col: 0 }, { row: 3, col: 0 })).toBe(3);
      expect(calculateDistance({ row: 0, col: 0 }, { row: 3, col: 4 })).toBe(4);
    });
  });

  describe('getPositionsBetween', () => {
    test('should get positions between two points horizontally', () => {
      const positions = getPositionsBetween({ row: 0, col: 0 }, { row: 0, col: 3 });
      expect(positions).toEqual([
        { row: 0, col: 1 },
        { row: 0, col: 2 }
      ]);
    });

    test('should get positions between two points vertically', () => {
      const positions = getPositionsBetween({ row: 0, col: 0 }, { row: 3, col: 0 });
      expect(positions).toEqual([
        { row: 1, col: 0 },
        { row: 2, col: 0 }
      ]);
    });

    test('should get positions between two points diagonally', () => {
      const positions = getPositionsBetween({ row: 0, col: 0 }, { row: 3, col: 3 });
      expect(positions).toEqual([
        { row: 1, col: 1 },
        { row: 2, col: 2 }
      ]);
    });

    test('should return empty array for adjacent positions', () => {
      const positions = getPositionsBetween({ row: 0, col: 0 }, { row: 0, col: 1 });
      expect(positions).toEqual([]);
    });
  });
});
