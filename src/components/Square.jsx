import React from 'react'
import './Square.css'

function Square({ piece, row, col, isHighlighted, isSelected, onClick }) {
  const isDark = (row + col) % 2 === 1
  
  const getPieceSymbol = (piece) => {
    if (!piece) return null
    
    const symbols = {
      'pawn': '💣',
      'bishop': '🏹',
      'king': '⚡',
      'hobbit': '🪨',
      'dwarf': '🪓'
    }
    
    return symbols[piece.toLowerCase()] || piece
  }

  return (
    <div
      className={`square ${isDark ? 'dark' : 'light'} ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {piece && <div className="piece">{getPieceSymbol(piece)}</div>}
    </div>
  )
}

export default Square
