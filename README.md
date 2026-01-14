# ⚔️ Fantasy Chess ⚔️

A fantasy-themed chess game with magical pieces and special abilities. Experience traditional chess gameplay with a mystical twist!

## 🎮 Features

- **Fantasy-Themed Pieces**: Traditional chess pieces reimagined as fantasy characters
  - King → Royal Commander
  - Queen → Sorceress Queen
  - Rook → Tower Guardian
  - Knight → Dragon Rider
  - Bishop → Mystic Bishop
  - Pawn → Warrior

- **Special Abilities**: Each piece type has unique magical abilities
- **Interactive Board**: Click-to-move interface with move validation
- **Move History**: Track all moves throughout the game
- **Captured Pieces Display**: See captured pieces for both players
- **Responsive Design**: Play on desktop or mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ferage/fantasy-chess.git
cd fantasy-chess
```

2. Install dependencies:
```bash
npm install
```

### Running the Game

Start the development server:
```bash
npm start
```

Then open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
fantasy-chess/
├── src/
│   ├── core/           # Game logic
│   │   ├── Board.js    # Chess board management
│   │   ├── Piece.js    # Base piece class
│   │   ├── Game.js     # Game state controller
│   │   └── pieces/     # Individual piece types
│   │       ├── King.js
│   │       ├── Queen.js
│   │       ├── Rook.js
│   │       └── Knight.js
│   ├── ui/             # User interface
│   │   ├── BoardRenderer.js
│   │   └── GameController.js
│   ├── utils/          # Utility functions
│   └── index.js        # Main entry point
├── public/             # Static assets
│   ├── index.html      # Main HTML file
│   └── styles/
│       └── main.css    # Styles
├── assets/             # Game assets
│   ├── images/         # Image resources
│   └── sounds/         # Sound effects
├── tests/              # Test files
├── docs/               # Documentation
├── server.js           # Development server
├── package.json
└── README.md
```

## 🎯 How to Play

1. **Start a New Game**: Click the "New Game" button to set up the pieces
2. **Select a Piece**: Click on one of your pieces (white moves first)
3. **View Valid Moves**: Valid move squares will be highlighted in green
4. **Make a Move**: Click on a highlighted square to move your piece
5. **Capture Pieces**: Move to a square occupied by an opponent's piece to capture it
6. **Win the Game**: Capture the opponent's king or achieve checkmate

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 🎨 Customization

### Adding New Piece Types

1. Create a new piece class in `src/core/pieces/`
2. Extend the base `Piece` class
3. Implement the `getValidMoves()` method
4. Add the piece to the game setup

### Styling

Edit `public/styles/main.css` to customize the appearance:
- Board colors
- Piece symbols
- UI elements
- Animations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by traditional chess
- Fantasy theme elements
- Open source chess engines and libraries

## 🐛 Known Issues

- Advanced chess rules (castling, en passant) not yet implemented
- AI opponent coming in future updates
- Multiplayer support planned

## 📮 Contact

Project Link: [https://github.com/ferage/fantasy-chess](https://github.com/ferage/fantasy-chess)

---

**Enjoy your magical chess adventure!** ⚔️✨
