# Fantasy Chess - Game Design Document

## Overview
Fantasy Chess is a strategic board game that combines traditional chess rules with fantasy elements, including portals, special abilities, and custom pieces.

## Game Modes

### Standard Mode
Classic chess rules with all pieces starting in standard positions.

### Fantasy Mode
Includes special elements:
- **Portals**: Teleport pieces across the board
- **Special Squares**: Grant temporary abilities or effects
- **Custom Pieces**: Wizard, Dragon, Paladin with unique powers

## Pieces

### Standard Pieces
- **King**: Moves one square in any direction
- **Queen**: Moves any number of squares in any direction
- **Rook**: Moves horizontally or vertically
- **Bishop**: Moves diagonally
- **Knight**: Moves in L-shape, can jump over pieces
- **Pawn**: Moves forward, captures diagonally

### Fantasy Pieces (Optional)
- **Wizard**: Moves like a bishop, can teleport with friendly pieces
- **Dragon**: Enhanced knight movement, fire breath ability
- **Paladin**: Knight movement, shields adjacent allies

## Fantasy Elements

### Portals
- Entry and exit points on the board
- Pieces landing on entry automatically teleport to exit
- Can have cooldown periods
- Strategic placement affects gameplay

### Special Squares
- **Power Boost**: Next move has enhanced capabilities
- **Freeze**: Piece cannot move next turn
- **Shield**: Piece gains temporary protection
- **Double Move**: Can move twice in one turn

## Game Rules

### Basic Rules
1. White moves first
2. Players alternate turns
3. Capture opponent's king to win
4. Standard chess rules apply for basic movement

### Fantasy Rules
1. Portal teleportation is automatic and mandatory
2. Special square effects activate immediately
3. Special abilities can be used once per game (unless recharged)
4. Some abilities require cooldown periods

### Victory Conditions
- Checkmate opponent's king
- Opponent resigns
- Stalemate results in draw

## Scoring System
- Capture points based on piece values
- Bonus points for:
  - Checkmate: 10 points
  - Using portals strategically: 1 point
  - Special ability usage: 2 points

## Technical Implementation

### Architecture
- **Board**: Manages game state and piece positions
- **Pieces**: Individual piece logic and movement
- **Game**: Main controller for game flow
- **Player**: Player state and statistics
- **Move**: Move validation and execution

### Configuration
Game settings are configurable via JSON files:
- `config/pieces.json`: Piece definitions
- `config/board.json`: Board layout and special elements
- `config/game_settings.json`: Game rules and scoring

## Future Enhancements
- AI opponent with difficulty levels
- Multiplayer network play
- Tournament mode
- Save/load game functionality
- Move history and analysis
- Animated graphics
- Sound effects and music
