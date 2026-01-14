# Quick Start Guide for Fantasy Chess

## Prerequisites
- Node.js v14+ installed
- MongoDB installed and running (optional - game works without database for testing)
- A modern web browser

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/ferage/fantasy-chess.git
cd fantasy-chess
```

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (optional - defaults will work)
cp .env.example .env

# Start the server
npm start
```

The backend server will start on `http://localhost:3001`

**Note:** If MongoDB is not running, the server will still start and work for local games. MongoDB is only needed for player profiles and match history.

### 3. Set Up Frontend

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 4. Play the Game!

Open your browser to `http://localhost:3000` and start playing!

## Quick Test

To verify everything is working without starting the full servers:

```bash
# Test game logic
cd backend
node test/game-logic-test.js

# Test visual board display
node test/visual-board-test.js
```

## Game Modes

1. **AI Game (Easy)** - Good for learning the game
2. **AI Game (Medium)** - Balanced challenge
3. **AI Game (Hard)** - Strategic AI using minimax algorithm
4. **Multiplayer** - Play against another player (requires both players to connect)

## Troubleshooting

### Backend won't start
- Check if port 3001 is already in use
- Make sure Node.js is installed: `node --version`
- Try: `cd backend && npm install` again

### Frontend won't start
- Check if port 3000 is already in use
- Make sure Node.js is installed: `node --version`
- Try: `cd frontend && npm install` again

### MongoDB connection issues
- The game works without MongoDB for testing
- To use player profiles, ensure MongoDB is running: `mongod`
- Check the MONGODB_URI in backend/.env

### Can't connect to game
- Make sure both backend and frontend are running
- Check browser console for errors (F12)
- Ensure backend is on port 3001 and frontend on port 3000

## Next Steps

- Read the full [README.md](../README.md) for detailed game rules
- Check out piece abilities and spell descriptions
- Try different AI difficulty levels
- Explore the code in `backend/src/game/` for game mechanics

Enjoy playing Fantasy Chess! 🧙♟️
