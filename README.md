# Fantasy Chess

A chess-like web-based strategy game featuring fantasy creatures, magic spells, and unique gameplay mechanics.

## Features

### Game Mechanics
- **8x8 Chess Board** with alternating light and dark brown squares
- **Protected Zones** on edges (light/dark gray)
- **Objective Tiles** in the center (blue) for special objectives
- **Fantasy Pieces**: Wizard, Beast, Dwarf, Archer, Knight, and Rook
- **Multiple Attack Types**: Melee attacks, ranged attacks, and shooting
- **Visual Indicators**: Green for movement, Red for attacks, Purple for shooting

### Magic System
- **5 Unique Spells**: Firewall, Freeze, Poison, Shield, Lightning
- Cast one spell per turn
- Spells can affect tiles, allies, or enemies
- Strategic spell usage is key to victory

### Win Conditions
- Capture the enemy Wizard
- Control protected zone tiles

### Game Modes
- **AI Opponent**: Three difficulty levels (Easy, Medium, Hard)
- **Multiplayer**: Real-time matches via WebSocket

## Tech Stack

### Frontend
- **React.js** - Interactive UI
- **Vite** - Fast build tooling
- **Socket.IO Client** - Real-time communication
- **CSS3** - Custom styling with gradients and animations

### Backend
- **Node.js** with **Express.js** - Server and API
- **Socket.IO** - WebSocket for multiplayer
- **MongoDB** with **Mongoose** - Database for players and rankings
- **Custom AI Engine** - Minimax algorithm with alpha-beta pruning

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or remote connection)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/fantasy-chess
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

5. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## How to Play

### Basic Gameplay

1. **Select a Piece**: Click on one of your pieces (matching your color)
2. **See Valid Moves**: 
   - Green highlights = movement squares
   - Red highlights = attack squares (enemy piece present)
   - Purple highlights = shooting range (for Archers)
3. **Make Your Move**: Click on a highlighted square
4. **Cast a Spell** (optional): Choose a spell from the spell panel
5. **End Your Turn**: Click "End Turn" button

### Piece Types and Movement

| Piece | Movement | Special Ability |
|-------|----------|----------------|
| 🧙 **Wizard** | 1 square in any direction | Win condition - protect at all costs! |
| 🐺 **Beast** | Up to 2 squares in any direction | High mobility |
| ⛏️ **Dwarf** | 1 square horizontally/vertically | Strong defender |
| 🏹 **Archer** | 1 square in any direction | Can shoot up to 3 squares away |
| 🗡️ **Knight** | L-shape (like chess knight) | Can jump over pieces |
| 🏰 **Rook** | Any number of squares straight | Powerful ranged movement |

### Spell Descriptions

| Spell | Icon | Effect | Target |
|-------|------|--------|--------|
| **Firewall** | 🔥 | Damages pieces moving through tile (3 turns) | Tile |
| **Freeze** | ❄️ | Prevents enemy movement (2 turns) | Enemy piece |
| **Poison** | ☠️ | Deals damage over time (3 turns) | Enemy piece |
| **Shield** | 🛡️ | Protects from 1 attack | Your piece |
| **Lightning** | ⚡ | Instant 3 damage | Enemy piece |

### Strategy Tips

1. **Protect Your Wizard** - Losing your wizard means losing the game
2. **Use Archers Wisely** - They can attack from range without moving
3. **Control the Center** - Objective tiles provide strategic advantages
4. **Time Your Spells** - One spell per turn, make it count
5. **Watch for Frozen Pieces** - Frozen pieces can't move but can be captured

## API Endpoints

### REST API

- `GET /api/health` - Server health check
- `GET /api/leaderboard` - Get top 50 players
- `POST /api/player/register` - Register a new player
- `GET /api/player/:playerId/stats` - Get player statistics

### WebSocket Events

**Client → Server:**
- `register` - Register player connection
- `createGame` - Create a new game
- `joinGame` - Join an existing game
- `makeMove` - Make a move
- `makeShot` - Fire a ranged attack
- `castSpell` - Cast a spell
- `endTurn` - End current turn

**Server → Client:**
- `gameCreated` - Game successfully created
- `gameState` - Updated game state
- `gameEnded` - Game finished with winner
- `error` - Error message

## Project Structure

```
fantasy-chess/
├── backend/
│   ├── src/
│   │   ├── ai/
│   │   │   └── aiPlayer.js       # AI opponent logic
│   │   ├── game/
│   │   │   ├── board.js          # Board and tile management
│   │   │   ├── gameState.js      # Main game logic
│   │   │   ├── pieces.js         # Piece definitions
│   │   │   └── spells.js         # Magic system
│   │   └── models/
│   │       ├── Player.js         # Player database model
│   │       └── GameMatch.js      # Game match model
│   ├── server.js                 # Express + Socket.IO server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.jsx         # Game board component
│   │   │   ├── Board.css
│   │   │   ├── GameInfo.jsx      # Game information panel
│   │   │   ├── GameInfo.css
│   │   │   ├── GameControls.jsx  # Control buttons
│   │   │   ├── GameControls.css
│   │   │   ├── SpellPanel.jsx    # Magic spell interface
│   │   │   └── SpellPanel.css
│   │   ├── App.jsx               # Main app component
│   │   ├── App.css
│   │   ├── main.jsx              # App entry point
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Development

### Running Tests
```bash
# Backend tests (when implemented)
cd backend
npm test

# Frontend tests (when implemented)
cd frontend
npm test
```

### Building for Production
```bash
# Backend (already production-ready)
cd backend
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

## Modular Architecture

The project is designed with modularity in mind:

- **Game Logic** is completely separated from presentation
- **AI System** can be easily extended with new algorithms
- **Spell System** allows easy addition of new spells
- **Piece System** enables creation of new piece types
- **Database Models** are independent and extensible

## Future Enhancements

- [ ] Add more piece types
- [ ] Implement additional spells
- [ ] Add player profiles and avatars
- [ ] Create tournament system
- [ ] Add replay functionality
- [ ] Implement spectator mode
- [ ] Add chat functionality
- [ ] Create mobile-responsive design
- [ ] Add sound effects and music
- [ ] Implement advanced AI with machine learning

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License

## Credits

Developed as a modern take on chess with fantasy elements and strategic magic gameplay.
