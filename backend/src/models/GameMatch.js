// Game match model for MongoDB

const mongoose = require('mongoose');

const gameMatchSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true
  },
  whitePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  blackPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  isAIGame: {
    type: Boolean,
    default: false
  },
  aiDifficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['waiting', 'active', 'completed', 'abandoned'],
    default: 'waiting'
  },
  winner: {
    type: String,
    enum: ['white', 'black', 'draw', null],
    default: null
  },
  moves: [{
    piece: String,
    from: {
      x: Number,
      y: Number
    },
    to: {
      x: Number,
      y: Number
    },
    captured: String,
    turn: String,
    timestamp: Date
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// Add indexes
gameMatchSchema.index({ gameId: 1 }, { unique: true });
gameMatchSchema.index({ whitePlayer: 1 });
gameMatchSchema.index({ blackPlayer: 1 });
gameMatchSchema.index({ status: 1 });

const GameMatch = mongoose.model('GameMatch', gameMatchSchema);

module.exports = GameMatch;
