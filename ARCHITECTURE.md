# Fantasy Chess Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Board     │  │   GameInfo   │  │ SpellPanel   │         │
│  │  Component   │  │  Component   │  │  Component   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │           GameControls Component                  │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
│                        ↕ Socket.IO                               │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                 WebSocket Server                         │   │
│  │  - createGame    - makeMove    - castSpell             │   │
│  │  - joinGame      - makeShot    - endTurn               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   REST API                               │   │
│  │  - /api/health          - /api/leaderboard              │   │
│  │  - /api/player/register - /api/player/:id/stats         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐    │
│  │  Game Engine   │  │   AI System    │  │ Spell System  │    │
│  │                │  │                │  │               │    │
│  │ - Board        │  │ - Easy AI      │  │ - Firewall    │    │
│  │ - Pieces       │  │ - Medium AI    │  │ - Freeze      │    │
│  │ - GameState    │  │ - Hard AI      │  │ - Poison      │    │
│  │ - Validation   │  │ - Minimax      │  │ - Shield      │    │
│  └────────────────┘  └────────────────┘  │ - Lightning   │    │
│                                           └───────────────┘    │
│                          ↓                                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │  Player Model    │              │ GameMatch Model  │        │
│  │                  │              │                  │        │
│  │ - username       │              │ - gameId         │        │
│  │ - email          │              │ - players        │        │
│  │ - rating         │              │ - moves          │        │
│  │ - wins/losses    │              │ - status         │        │
│  │ - stats          │              │ - winner         │        │
│  └──────────────────┘              └──────────────────┘        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### Game Creation Flow
```
User → Frontend → WebSocket → Backend
                                  ↓
                          Create GameState
                                  ↓
                          Store in Memory
                                  ↓
                          Save to MongoDB
                                  ↓
                     Emit gameCreated event
                                  ↓
                    Frontend ← WebSocket ← Backend
```

### Move Flow
```
User clicks tile → Frontend validates
                        ↓
                  Emit makeMove
                        ↓
              Backend validates move
                        ↓
              Update GameState
                        ↓
           Check win conditions
                        ↓
          Broadcast new state
                        ↓
         All clients receive update
```

### AI Move Flow
```
Player ends turn → Frontend
                       ↓
                  Backend detects AI turn
                       ↓
                  AI analyzes board
                       ↓
              Generate best move (Minimax)
                       ↓
                  Execute move
                       ↓
                  Update state
                       ↓
             Broadcast to clients
```

## Component Communication

### Frontend Components
- **App.jsx**: Main coordinator, manages Socket.IO connection
- **Board.jsx**: Displays game state, handles tile clicks
- **GameInfo.jsx**: Shows turn, status, active spells
- **GameControls.jsx**: Action buttons, instructions
- **SpellPanel.jsx**: Spell selection and casting

### Backend Modules
- **server.js**: Express + Socket.IO setup, route handlers
- **game/gameState.js**: Core game logic and validation
- **game/pieces.js**: Piece types and movement rules
- **game/board.js**: Board state and tile management
- **game/spells.js**: Magic system implementation
- **ai/aiPlayer.js**: AI opponent with difficulty levels
- **models/*.js**: Database schemas

## Technology Stack

```
┌──────────────────────────────────────┐
│           Frontend Stack              │
├──────────────────────────────────────┤
│ React.js 18+                         │
│ Vite (Build Tool)                    │
│ Socket.IO Client                     │
│ CSS3 (Gradients, Animations)         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│           Backend Stack               │
├──────────────────────────────────────┤
│ Node.js 14+                          │
│ Express.js 4+                        │
│ Socket.IO Server                     │
│ Mongoose (MongoDB ORM)               │
│ express-rate-limit                   │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│            Database                   │
├──────────────────────────────────────┤
│ MongoDB                              │
│ Indexes on username, rating, gameId │
└──────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│              Load Balancer              │
│              (nginx/Apache)             │
└─────────────────────────────────────────┘
                    ↓
        ┌──────────────────────┐
        │                      │
    ┌───────┐            ┌───────┐
    │ App 1 │            │ App 2 │
    └───────┘            └───────┘
        │                      │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │   MongoDB Cluster    │
        │   (Replica Set)      │
        └──────────────────────┘
```

## Security Layers

```
┌──────────────────────────────────────┐
│     Rate Limiting (API & Auth)       │
├──────────────────────────────────────┤
│     CORS Configuration               │
├──────────────────────────────────────┤
│     Input Validation                 │
├──────────────────────────────────────┤
│     Server-side Move Validation      │
├──────────────────────────────────────┤
│     MongoDB Connection Auth          │
└──────────────────────────────────────┘
```

---

This modular architecture allows for:
- Easy testing of individual components
- Independent scaling of frontend/backend
- Simple addition of new features
- Clear separation of concerns
- Maintainable codebase
