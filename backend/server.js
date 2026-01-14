// Main Express server with Socket.IO for Fantasy Chess

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const GameState = require('./src/game/gameState');
const AIPlayer = require('./src/ai/aiPlayer');
const Player = require('./src/models/Player');
const GameMatch = require('./src/models/GameMatch');
const { Spell, SpellTypes } = require('./src/game/spells');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory game storage (for active games)
const activeGames = new Map();
const playerSockets = new Map();

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fantasy-chess';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// REST API Routes

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fantasy Chess server is running' });
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const players = await Player.find()
      .sort({ rating: -1 })
      .limit(50)
      .select('-passwordHash');
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/player/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // In production, use proper password hashing (bcrypt)
    const passwordHash = password; // Simplified for MVP
    
    const player = new Player({
      username,
      email,
      passwordHash
    });
    
    await player.save();
    res.json({ success: true, playerId: player._id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/player/:playerId/stats', async (req, res) => {
  try {
    const player = await Player.findById(req.params.playerId).select('-passwordHash');
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('register', (playerId) => {
    playerSockets.set(playerId, socket.id);
    socket.playerId = playerId;
  });
  
  // Create new game
  socket.on('createGame', async ({ playerId, mode, difficulty }) => {
    try {
      const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      let players = { white: playerId };
      let isAIGame = false;
      
      if (mode === 'ai') {
        players.black = 'ai';
        isAIGame = true;
      }
      
      const gameState = new GameState(gameId, players);
      activeGames.set(gameId, {
        state: gameState,
        aiPlayer: isAIGame ? new AIPlayer('black', difficulty) : null
      });
      
      // Save to database
      const gameMatch = new GameMatch({
        gameId,
        whitePlayer: playerId,
        isAIGame,
        aiDifficulty: difficulty,
        status: 'active'
      });
      await gameMatch.save();
      
      socket.join(gameId);
      socket.emit('gameCreated', { gameId, state: gameState.getState() });
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
  
  // Join existing game
  socket.on('joinGame', async ({ playerId, gameId }) => {
    try {
      const game = activeGames.get(gameId);
      
      if (!game) {
        return socket.emit('error', { message: 'Game not found' });
      }
      
      if (game.state.players.black === null) {
        game.state.players.black = playerId;
        
        // Update database
        await GameMatch.findOneAndUpdate(
          { gameId },
          { blackPlayer: playerId, status: 'active' }
        );
      }
      
      socket.join(gameId);
      io.to(gameId).emit('gameState', game.state.getState());
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
  
  // Make move
  socket.on('makeMove', async ({ gameId, fromX, fromY, toX, toY }) => {
    try {
      const game = activeGames.get(gameId);
      
      if (!game) {
        return socket.emit('error', { message: 'Game not found' });
      }
      
      const result = game.state.makeMove(fromX, fromY, toX, toY);
      
      if (result.success) {
        // Update database
        await GameMatch.findOneAndUpdate(
          { gameId },
          { $push: { moves: game.state.moveHistory[game.state.moveHistory.length - 1] } }
        );
        
        io.to(gameId).emit('gameState', game.state.getState());
        
        // Check if game ended
        if (game.state.gameStatus === 'ended') {
          await handleGameEnd(game, gameId);
        }
      } else {
        socket.emit('error', { message: result.error });
      }
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
  
  // Make shot
  socket.on('makeShot', async ({ gameId, fromX, fromY, toX, toY }) => {
    try {
      const game = activeGames.get(gameId);
      
      if (!game) {
        return socket.emit('error', { message: 'Game not found' });
      }
      
      const result = game.state.makeShot(fromX, fromY, toX, toY);
      
      if (result.success) {
        io.to(gameId).emit('gameState', game.state.getState());
        
        if (game.state.gameStatus === 'ended') {
          await handleGameEnd(game, gameId);
        }
      } else {
        socket.emit('error', { message: result.error });
      }
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
  
  // Cast spell
  socket.on('castSpell', async ({ gameId, spellType, targetX, targetY }) => {
    try {
      const game = activeGames.get(gameId);
      
      if (!game) {
        return socket.emit('error', { message: 'Game not found' });
      }
      
      const spell = new Spell(spellType, game.state.currentTurn);
      const target = game.state.board.getTile(targetX, targetY);
      
      const result = game.state.castSpell(spell, target);
      
      if (result.success) {
        io.to(gameId).emit('gameState', game.state.getState());
      } else {
        socket.emit('error', { message: result.error });
      }
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
  
  // End turn
  socket.on('endTurn', async ({ gameId }) => {
    try {
      const game = activeGames.get(gameId);
      
      if (!game) {
        return socket.emit('error', { message: 'Game not found' });
      }
      
      game.state.endTurn();
      io.to(gameId).emit('gameState', game.state.getState());
      
      // If AI's turn, make AI move
      if (game.aiPlayer && game.state.currentTurn === 'black') {
        setTimeout(() => {
          makeAIMove(game, gameId);
        }, 1000);
      }
      
      if (game.state.gameStatus === 'ended') {
        await handleGameEnd(game, gameId);
      }
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    if (socket.playerId) {
      playerSockets.delete(socket.playerId);
    }
  });
});

// Helper function to make AI move
async function makeAIMove(game, gameId) {
  const aiMove = game.aiPlayer.makeMove(game.state);
  
  if (aiMove) {
    if (aiMove.type === 'move') {
      game.state.makeMove(aiMove.from.x, aiMove.from.y, aiMove.to.x, aiMove.to.y);
    } else if (aiMove.type === 'shoot') {
      game.state.makeShot(aiMove.from.x, aiMove.from.y, aiMove.to.x, aiMove.to.y);
    }
    
    // AI ends turn
    game.state.endTurn();
    io.to(gameId).emit('gameState', game.state.getState());
    
    if (game.state.gameStatus === 'ended') {
      await handleGameEnd(game, gameId);
    }
  }
}

// Helper function to handle game end
async function handleGameEnd(game, gameId) {
  try {
    await GameMatch.findOneAndUpdate(
      { gameId },
      { 
        status: 'completed',
        winner: game.state.winner,
        completedAt: Date.now()
      }
    );
    
    // Update player stats
    const whitePlayerId = game.state.players.white;
    const blackPlayerId = game.state.players.black;
    
    if (whitePlayerId && whitePlayerId !== 'ai') {
      const whitePlayer = await Player.findById(whitePlayerId);
      if (whitePlayer) {
        const result = game.state.winner === 'white' ? 'win' : 'loss';
        await whitePlayer.updateStats(result);
      }
    }
    
    if (blackPlayerId && blackPlayerId !== 'ai') {
      const blackPlayer = await Player.findById(blackPlayerId);
      if (blackPlayer) {
        const result = game.state.winner === 'black' ? 'win' : 'loss';
        await blackPlayer.updateStats(result);
      }
    }
    
    io.to(gameId).emit('gameEnded', { 
      winner: game.state.winner,
      gameId 
    });
    
  } catch (error) {
    console.error('Error handling game end:', error);
  }
}

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Fantasy Chess server running on port ${PORT}`);
});

module.exports = { app, server };
