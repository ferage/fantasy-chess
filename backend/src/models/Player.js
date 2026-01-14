// Player model for MongoDB

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 1000
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  draws: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
playerSchema.index({ rating: -1 });
playerSchema.index({ username: 1 }, { unique: true });
playerSchema.index({ email: 1 }, { unique: true });

// Methods
playerSchema.methods.updateStats = function(result) {
  this.gamesPlayed++;
  
  if (result === 'win') {
    this.wins++;
    this.rating += 20;
  } else if (result === 'loss') {
    this.losses++;
    this.rating = Math.max(0, this.rating - 20);
  } else if (result === 'draw') {
    this.draws++;
  }
  
  this.lastActive = Date.now();
  return this.save();
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
