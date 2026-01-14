/**
 * utils.js - Utility functions for Fantasy Chess
 */

/**
 * Convert board position to chess notation
 */
function positionToNotation(row, col) {
  const file = String.fromCharCode(97 + col); // a-h
  const rank = 8 - row; // 1-8
  return `${file}${rank}`;
}

/**
 * Convert chess notation to board position
 */
function notationToPosition(notation) {
  if (!notation || notation.length < 2) {
    return null;
  }
  
  const file = notation[0].toLowerCase();
  const rank = parseInt(notation[1]);
  
  if (file < 'a' || file > 'h' || rank < 1 || rank > 8) {
    return null;
  }
  
  const col = file.charCodeAt(0) - 97;
  const row = 8 - rank;
  
  return { row, col };
}

/**
 * Check if two positions are the same
 */
function isSamePosition(pos1, pos2) {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Calculate distance between two positions
 */
function calculateDistance(pos1, pos2) {
  const rowDiff = Math.abs(pos1.row - pos2.row);
  const colDiff = Math.abs(pos1.col - pos2.col);
  return Math.max(rowDiff, colDiff);
}

/**
 * Get all positions between two points (for sliding pieces)
 */
function getPositionsBetween(from, to) {
  const positions = [];
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;
  
  const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
  const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
  
  let currentRow = from.row + rowStep;
  let currentCol = from.col + colStep;
  
  while (currentRow !== to.row || currentCol !== to.col) {
    positions.push({ row: currentRow, col: currentCol });
    currentRow += rowStep;
    currentCol += colStep;
  }
  
  return positions;
}

/**
 * Deep clone an object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    positionToNotation,
    notationToPosition,
    isSamePosition,
    calculateDistance,
    getPositionsBetween,
    deepClone
  };
}
