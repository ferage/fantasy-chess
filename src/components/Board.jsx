import React, { useState } from 'react'
import Square from './Square'
import './Board.css'

const INITIAL_BOARD = [
  ['bishop', null, null, null, 'king', null, null, 'bishop'],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  [null, null, null, null, null, null, null, null],
  [null, 'hobbit', null, null, null, null, 'dwarf', null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN', 'PAWN'],
  ['BISHOP', null, null, null, 'KING', null, null, 'BISHOP'],
]

function Board() {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [possibleMoves, setPossibleMoves] = useState([])
  const [animation, setAnimation] = useState(null)

  const getPieceType = (piece) => {
    if (!piece) return null
    return piece.toLowerCase()
  }

  const isOwnPiece = (piece) => {
    return piece && piece === piece.toUpperCase()
  }

  const calculatePossibleMoves = (row, col, piece) => {
    const moves = []
    const pieceType = getPieceType(piece)

    switch (pieceType) {
      case 'pawn':
        // Pawns shoot forward and diagonally
        if (isOwnPiece(piece)) {
          if (row > 0) moves.push([row - 1, col]) // forward
          if (row > 0 && col > 0) moves.push([row - 1, col - 1]) // diagonal
          if (row > 0 && col < 7) moves.push([row - 1, col + 1]) // diagonal
        } else {
          if (row < 7) moves.push([row + 1, col]) // forward
          if (row < 7 && col > 0) moves.push([row + 1, col - 1]) // diagonal
          if (row < 7 && col < 7) moves.push([row + 1, col + 1]) // diagonal
        }
        break
      
      case 'bishop':
        // Bishops shoot diagonally
        for (let i = 1; i < 8; i++) {
          if (row + i < 8 && col + i < 8) moves.push([row + i, col + i])
          if (row + i < 8 && col - i >= 0) moves.push([row + i, col - i])
          if (row - i >= 0 && col + i < 8) moves.push([row - i, col + i])
          if (row - i >= 0 && col - i >= 0) moves.push([row - i, col - i])
        }
        break
      
      case 'king':
        // King shoots in all directions (one square)
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue
            const newRow = row + dr
            const newCol = col + dc
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
              moves.push([newRow, newCol])
            }
          }
        }
        break
      
      case 'hobbit':
        // Hobbit shoots in a sling pattern (2 squares in cardinal directions)
        if (row >= 2) moves.push([row - 2, col])
        if (row <= 5) moves.push([row + 2, col])
        if (col >= 2) moves.push([row, col - 2])
        if (col <= 5) moves.push([row, col + 2])
        break
      
      case 'dwarf':
        // Dwarf throws axe in straight lines
        for (let i = 1; i < 8; i++) {
          if (row + i < 8) moves.push([row + i, col])
          if (row - i >= 0) moves.push([row - i, col])
          if (col + i < 8) moves.push([row, col + i])
          if (col - i >= 0) moves.push([row, col - i])
        }
        break
    }

    return moves
  }

  const handleSquareClick = (row, col) => {
    const piece = board[row][col]

    // If clicking on a highlighted move square
    if (selectedSquare && possibleMoves.some(([r, c]) => r === row && c === col)) {
      const [fromRow, fromCol] = selectedSquare
      const fromPiece = board[fromRow][fromCol]
      const pieceType = getPieceType(fromPiece)

      // Trigger animation
      setAnimation({
        type: pieceType,
        from: { row: fromRow, col: fromCol },
        to: { row, col }
      })

      // Execute the move after animation
      setTimeout(() => {
        const newBoard = board.map(row => [...row])
        newBoard[row][col] = fromPiece
        newBoard[fromRow][fromCol] = null
        setBoard(newBoard)
        setAnimation(null)
      }, 1000) // Animation duration

      setSelectedSquare(null)
      setPossibleMoves([])
      return
    }

    // If clicking on own piece
    if (piece && isOwnPiece(piece)) {
      setSelectedSquare([row, col])
      setPossibleMoves(calculatePossibleMoves(row, col, piece))
    } else {
      setSelectedSquare(null)
      setPossibleMoves([])
    }
  }

  const isHighlighted = (row, col) => {
    return possibleMoves.some(([r, c]) => r === row && c === col)
  }

  const isSelected = (row, col) => {
    return selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col
  }

  return (
    <div className="board-container">
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((piece, colIndex) => (
              <Square
                key={`${rowIndex}-${colIndex}`}
                piece={piece}
                row={rowIndex}
                col={colIndex}
                isHighlighted={isHighlighted(rowIndex, colIndex)}
                isSelected={isSelected(rowIndex, colIndex)}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
      {animation && (
        <AnimationOverlay animation={animation} />
      )}
    </div>
  )
}

function AnimationOverlay({ animation }) {
  const { type, from, to } = animation
  
  // Calculate position and angle
  const startX = from.col * 60 + 30
  const startY = from.row * 60 + 30
  const endX = to.col * 60 + 30
  const endY = to.row * 60 + 30
  
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI

  return (
    <div className="animation-overlay">
      <div
        className={`projectile projectile-${type}`}
        style={{
          '--start-x': `${startX}px`,
          '--start-y': `${startY}px`,
          '--end-x': `${endX}px`,
          '--end-y': `${endY}px`,
          '--angle': `${angle}deg`,
        }}
      />
    </div>
  )
}

export default Board
