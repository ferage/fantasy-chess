# Fantasy Chess API Documentation

This document describes the main classes and methods available in the Fantasy Chess game.

## Core Classes

### Board

Represents the chess board and manages square states.

```javascript
const board = new Board();
```

#### Methods

- `initializeBoard()` - Creates an empty 8x8 board
- `getPiece(row, col)` - Returns the piece at the given position
- `setPiece(row, col, piece)` - Places a piece at the given position
- `removePiece(row, col)` - Removes and returns the piece at the given position
- `isValidPosition(row, col)` - Checks if position is within board bounds
- `isEmpty(row, col)` - Checks if the square is empty
- `clear()` - Removes all pieces from the board
- `getPiecesByColor(color)` - Returns all pieces of the specified color

### Game

Main game controller that manages game state and rules.

```javascript
const game = new Game();
```

#### Methods

- `initialize(board)` - Initializes a new game with the given board
- `makeMove(fromRow, fromCol, toRow, toCol)` - Attempts to move a piece
- `switchPlayer()` - Switches to the other player
- `isGameOver()` - Checks if the game has ended
- `getStatus()` - Returns current game status
- `reset()` - Resets the game to initial state

#### Properties

- `board` - The game board
- `currentPlayer` - Current player ('white' or 'black')
- `gameState` - Current state ('setup', 'playing', 'checkmate', 'stalemate', 'draw')
- `moveHistory` - Array of all moves made
- `capturedPieces` - Object containing captured pieces for each color

### Piece (Base Class)

Base class for all chess pieces.

```javascript
// Don't instantiate directly - use specific piece classes
```

#### Methods

- `getValidMoves(board)` - Returns array of valid move positions
- `canMoveTo(board, targetRow, targetCol)` - Checks if move to target is valid
- `moveTo(row, col)` - Moves piece to new position
- `isEnemy(board, row, col)` - Checks if target square has enemy piece
- `isFriendly(board, row, col)` - Checks if target square has friendly piece
- `getSymbol()` - Returns Unicode symbol for the piece
- `clone()` - Creates a copy of the piece

#### Properties

- `color` - Piece color ('white' or 'black')
- `type` - Piece type ('king', 'queen', 'rook', 'bishop', 'knight', 'pawn')
- `name` - Display name of the piece
- `position` - Current position {row, col}
- `hasMoved` - Boolean indicating if piece has moved
- `specialAbility` - Name of the piece's special ability

## Piece Classes

All piece classes extend the base `Piece` class and implement `getValidMoves(board)`.

### King

```javascript
const king = new King('white');
```

Moves one square in any direction.

### Queen

```javascript
const queen = new Queen('white');
```

Moves any number of squares in any direction.

### Rook

```javascript
const rook = new Rook('white');
```

Moves any number of squares horizontally or vertically.

### Bishop

```javascript
const bishop = new Bishop('white');
```

Moves any number of squares diagonally.

### Knight

```javascript
const knight = new Knight('white');
```

Moves in an L-shape (2 squares in one direction, 1 square perpendicular). Can jump over pieces.

### Pawn

```javascript
const pawn = new Pawn('white');
```

Moves forward one square (or two from starting position). Captures diagonally.

Additional method:
- `canPromote()` - Checks if pawn can be promoted

## UI Classes

### BoardRenderer

Handles rendering the chess board to the DOM.

```javascript
const renderer = new BoardRenderer(boardElement);
```

#### Methods

- `render(board)` - Renders the entire board
- `createSquare(row, col, board)` - Creates a single square element
- `selectSquare(row, col)` - Highlights a square as selected
- `clearSelection()` - Clears all selections and highlights
- `highlightValidMoves(moves)` - Highlights valid move squares
- `getSquareElement(row, col)` - Returns DOM element for square
- `updateCapturedPieces(capturedPieces)` - Updates captured pieces display
- `updatePlayerDisplay(player)` - Updates current player display
- `updateGameStatus(status)` - Updates game status text
- `addMoveToHistory(move, moveNumber)` - Adds move to history display

### GameController

Handles game logic and user interactions.

```javascript
const controller = new GameController(game, board, renderer);
```

#### Methods

- `initialize()` - Initializes the game controller
- `setupEventListeners()` - Sets up DOM event listeners
- `handleSquareClick(event)` - Handles clicks on board squares
- `selectPiece(row, col)` - Selects a piece
- `attemptMove(toRow, toCol)` - Attempts to move selected piece
- `clearSelection()` - Clears piece selection
- `updateDisplay()` - Updates all display elements
- `startNewGame()` - Starts a new game
- `resetGame()` - Resets the game
- `setupInitialPosition()` - Sets up initial piece positions

## Utility Functions

### Position Conversion

```javascript
// Convert board position to chess notation
const notation = positionToNotation(row, col); // Returns 'e4'

// Convert chess notation to board position
const position = notationToPosition('e4'); // Returns {row: 4, col: 4}
```

### Position Utilities

```javascript
// Check if two positions are the same
const same = isSamePosition(pos1, pos2);

// Calculate distance between positions
const distance = calculateDistance(pos1, pos2);

// Get positions between two points
const between = getPositionsBetween(from, to);
```

## Events

The game currently uses click events for user interaction. Future versions may include:

- Custom events for piece movement
- Game state change events
- Check/checkmate events

## Extension Points

To extend the game:

1. **Add new piece types**: Create a new class extending `Piece`
2. **Modify rules**: Update the `Game` class
3. **Change UI**: Modify `BoardRenderer` and CSS
4. **Add AI**: Implement move evaluation algorithms

## Example Usage

```javascript
// Create game instances
const board = new Board();
const game = new Game();
const renderer = new BoardRenderer(document.getElementById('chess-board'));
const controller = new GameController(game, board, renderer);

// Initialize and setup
controller.initialize();
controller.setupInitialPosition();

// The game is now ready to play!
```
