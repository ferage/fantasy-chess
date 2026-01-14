# Development Guide for Fantasy Chess

## Architecture Overview

Fantasy Chess is built with a modular architecture to allow easy extension and maintenance.

### Backend Architecture

```
backend/
├── server.js              # Express + Socket.IO server
├── src/
│   ├── game/             # Core game logic (framework-agnostic)
│   │   ├── board.js      # Board state and tile management
│   │   ├── pieces.js     # Piece types and movement rules
│   │   ├── gameState.js  # Main game state and validation
│   │   └── spells.js     # Magic system
│   ├── ai/               # AI opponents
│   │   └── aiPlayer.js   # Minimax AI with difficulty levels
│   └── models/           # Database models
│       ├── Player.js     # Player accounts and stats
│       └── GameMatch.js  # Match history
└── test/                 # Test files
```

### Frontend Architecture

```
frontend/
├── src/
│   ├── App.jsx           # Main application component
│   ├── components/       # React components
│   │   ├── Board.jsx     # Interactive game board
│   │   ├── GameInfo.jsx  # Game status display
│   │   ├── GameControls.jsx  # Action buttons
│   │   └── SpellPanel.jsx    # Magic spell interface
│   └── hooks/            # Custom React hooks (future)
└── public/               # Static assets
```

## Key Design Patterns

### 1. Game State Management
- Centralized state in `GameState` class
- Immutable game history with move log
- Event-driven updates via Socket.IO

### 2. Piece System
- Each piece is a class instance with position and state
- Movement patterns defined per piece type
- Extensible system for adding new pieces

### 3. Spell System
- Spells as objects with type, duration, and effects
- Active spell tracking with turn-based expiration
- Effect application through board and piece state

### 4. AI System
- Three difficulty levels: Easy, Medium, Hard
- Minimax algorithm with alpha-beta pruning
- Position evaluation based on material and strategy

## Adding New Features

### Adding a New Piece Type

1. **Define the piece in `backend/src/game/pieces.js`:**

```javascript
// Add to PieceTypes
const PieceTypes = {
  // ... existing types
  PALADIN: 'paladin'
};

// Add movement pattern
getPaladinMoves() {
  // Define movement rules
  return [
    {dx: -1, dy: 0}, {dx: 1, dy: 0},
    {dx: 0, dy: -1}, {dx: 0, dy: 1}
  ];
}

// Add to getMovementPattern() method
```

2. **Update initial setup in `getInitialPieceSetup()`**

3. **Add piece symbol in `frontend/src/components/Board.jsx`:**

```javascript
const symbols = {
  // ... existing symbols
  paladin: '🛡️'
};
```

4. **Update AI evaluation in `backend/src/ai/aiPlayer.js`:**

```javascript
const values = {
  // ... existing values
  [PieceTypes.PALADIN]: 40
};
```

### Adding a New Spell

1. **Define spell in `backend/src/game/spells.js`:**

```javascript
const SpellTypes = {
  // ... existing types
  TELEPORT: 'teleport'
};

// Add to getDuration() and getEffect() methods
```

2. **Add spell to frontend `SpellPanel.jsx`:**

```javascript
const spells = [
  // ... existing spells
  {
    type: 'teleport',
    name: 'Teleport',
    icon: '✨',
    description: 'Teleport a piece to another location',
    targetType: 'piece'
  }
];
```

3. **Implement effect logic in `SpellSystem` class**

### Adding New AI Difficulty

Modify `backend/src/ai/aiPlayer.js`:

```javascript
makeMove(gameState) {
  const difficulty = this.difficulty;
  
  if (difficulty === 'expert') {
    return this.makeMinimaxMove(gameState, 5); // Deeper search
  }
  // ... existing logic
}
```

## Testing

### Running Tests

```bash
# Backend tests
cd backend
node test/game-logic-test.js
node test/visual-board-test.js

# Add new tests in backend/test/
```

### Manual Testing Checklist

- [ ] Create new game
- [ ] Move pieces (all types)
- [ ] Attack enemy pieces
- [ ] Use archer shooting
- [ ] Cast each spell
- [ ] End turn
- [ ] AI makes valid moves
- [ ] Win condition triggers
- [ ] Multiplayer sync works

## Code Style Guidelines

### JavaScript/JSX
- Use ES6+ features
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for complex functions

### React Components
- Use functional components with hooks
- Keep components focused and small
- Extract reusable logic into custom hooks
- Use CSS modules or styled-components for styling

### Backend
- Keep routes in server.js
- Business logic in src/game/
- Database operations in models/
- Use async/await for promises

## Performance Considerations

### Frontend
- Memoize expensive calculations
- Use React.memo for pure components
- Debounce rapid state updates
- Optimize re-renders with useCallback/useMemo

### Backend
- Cache game states efficiently
- Use MongoDB indexes for queries
- Limit AI search depth appropriately
- Implement game state cleanup for old games

## Security Best Practices

- Validate all user inputs
- Sanitize data before database storage
- Use proper authentication (implement JWT)
- Validate game moves server-side
- Rate limit socket connections
- Use HTTPS in production

## Deployment

### Backend Deployment
1. Set environment variables
2. Use a process manager (PM2)
3. Configure reverse proxy (nginx)
4. Set up MongoDB with authentication

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Serve static files with nginx or CDN
3. Configure CORS for backend API
4. Use environment variables for API URL

## Contributing Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and test thoroughly
4. Update documentation if needed
5. Commit with clear messages
6. Push and create a Pull Request

## Resources

- [React Documentation](https://react.dev)
- [Socket.IO Documentation](https://socket.io/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## Common Issues

### Game state desync
- Ensure all state updates go through Socket.IO
- Validate moves server-side
- Implement reconciliation logic

### AI taking too long
- Reduce minimax search depth
- Implement iterative deepening
- Add time limits to AI calculations

### Memory leaks
- Clean up socket listeners on disconnect
- Remove old games from memory
- Clear timers and intervals

## Future Enhancements

- WebRTC for peer-to-peer multiplayer
- Replay system with move navigation
- Tournament brackets
- Elo rating system
- Animations for moves and attacks
- Sound effects
- Mobile app with React Native
- Machine learning AI with TensorFlow.js

Happy coding! 🚀
