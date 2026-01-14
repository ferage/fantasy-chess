# Fantasy Chess

A chess-like fantasy game with unique pieces, magical spells, and multiple win conditions.

## Features

### Board and Pieces
- **8x8 board** with alternating light and dark brown squares
- **Protected zones** (gray tiles) at rows 0-1 (white) and 6-7 (black)
- **Central objective tiles** (light blue) at positions (3,3) and (4,4)
- Six unique piece types with special abilities:
  - **King**: Moves 1 square in any direction, shoots a light beam 1-2 squares straight ahead
  - **Queen**: Moves any distance in any direction, can shoot along any line
  - **Rook**: Moves any distance horizontally or vertically
  - **Bishop**: Moves any distance diagonally
  - **Knight**: Moves in L-shape (2+1 squares)
  - **Pawn**: Moves forward 1 square (2 on first move), attacks diagonally, shoots in L-shape pattern

### Combat & Movement Mechanics
- **Green highlights**: Show possible movement tiles
- **Red highlights**: Show possible attack tiles
- **Purple highlights**: Show possible shooting tiles
- Shooting depletes a piece's ability until next turn (indicated by red dot)
- Pieces can move, attack, or shoot on their turn

### Spell System
Cast one spell per turn before moving/attacking/shooting:
- **Fire Wall**: Creates a barrier preventing movement on targeted tile
- **Freeze**: Immobilizes an enemy piece for 2 turns
- **Poison**: Disables enemy attacks for 1 turn
- **Dispel**: Removes all status effects from a piece
- **Shield**: Protects an allied piece from one attack
- **Transform**: Converts an enemy piece to your side

### Game Modes
- **Local 2 Player**: Play against a friend on the same device
- **AI Opponent**: Three difficulty levels (Easy, Medium, Hard)
  - AI makes intelligent moves prioritizing attacks
  - AI responds immediately after player's turn
- **Online Multiplayer**: Framework ready for real-time online play

### Gameplay Features
- **Turn Timer**: 15 seconds per turn with countdown display
- **Undo Move**: Take back your last move
- **Multiple Win Conditions**:
  1. Control both central tiles for 3 consecutive turns
  2. Reach opponent's protected zone with any non-pawn piece
  3. Eliminate the opponent's King piece

### How to Play

1. Open `index.html` in a web browser
2. Select your game mode (Local or AI)
3. Click on your pieces to see possible moves (green), attacks (red), and shoots (purple)
4. Optionally cast a spell before moving by clicking a spell button and then the target tile
5. Click a highlighted tile to execute your move
6. Try to achieve one of the three win conditions!

### Technology
- Pure HTML5, CSS3, and JavaScript
- Canvas-based rendering for smooth gameplay
- No external dependencies required

## Screenshots

### Game Board
![Fantasy Chess Board](https://github.com/user-attachments/assets/fd5cc21a-6e99-42db-a3a9-8a3b774c33ef)

The game features a fully functional chess board with:
- Protected zones (gray areas at top and bottom)
- Central objective tiles (light blue in the center)
- Chess pieces with Unicode symbols
- Spell panel on the left
- Game controls on the right

## Installation

No installation required! Simply open `index.html` in any modern web browser.

```bash
# Or run a local server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Future Enhancements
- Custom piece icons and animations
- Sound effects and music
- Online multiplayer with WebSocket support
- Player stats and leaderboard database
- Additional spell types and piece abilities
- Mobile-responsive design
