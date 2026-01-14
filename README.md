# Fantasy Chess ♔

A strategic chess game with fantasy elements including portals, special abilities, and custom pieces.

## Features

- **Classic Chess**: All standard chess rules and pieces
- **Fantasy Mode**: Enhanced gameplay with special elements
  - 🌀 **Portals**: Teleport pieces across the board
  - ⭐ **Special Squares**: Squares with temporary effects
  - 🔮 **Special Abilities**: Unique piece powers
- **Text-based Interface**: Play in your terminal
- **Configurable**: Customize rules via JSON files
- **Extensible**: Easy to add new pieces and abilities

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/ferage/fantasy-chess.git
cd fantasy-chess

# Run the game
python main.py
```

### Requirements

- Python 3.8 or higher
- No additional dependencies for basic version

## How to Play

1. Run `python main.py` to start the game
2. Choose "New Game" from the menu
3. Enter player names
4. Optionally add fantasy elements
5. Enter moves in algebraic notation (e.g., `e2e4`)
6. Type `help` during game for instructions
7. Type `quit` to exit the game

### Move Notation

Moves are entered as four characters:
- First two: source square (column + row)
- Last two: destination square (column + row)

Examples:
- `e2e4` - Move piece from e2 to e4
- `g1f3` - Move knight from g1 to f3

### Board Layout

```
  a  b  c  d  e  f  g  h
8 BR BN BB BQ BK BB BN BR  8
7 BP BP BP BP BP BP BP BP  7
6  .  .  .  .  .  .  .  .  6
5  .  .  .  .  .  .  .  .  5
4  .  .  .  .  .  .  .  .  4
3  .  .  .  .  .  .  .  .  3
2 WP WP WP WP WP WP WP WP  2
1 WR WN WB WQ WK WB WN WR  1
  a  b  c  d  e  f  g  h
```

## Game Modes

### Standard Chess
Play regular chess with all traditional rules.

### Fantasy Chess
Includes special elements that add strategic depth:

- **Portals**: Automatic teleportation when landing on entry square
- **Power Boost Squares**: Enhanced capture abilities
- **Freeze Squares**: Immobilize pieces temporarily

## Project Structure

```
fantasy-chess/
├── src/              # Source code
│   ├── board.py      # Board implementation
│   ├── piece.py      # Piece classes
│   ├── player.py     # Player management
│   ├── move.py       # Move validation
│   └── game.py       # Game controller
├── config/           # Configuration files
├── assets/           # Game assets (images, sounds)
├── tests/            # Unit tests
├── docs/             # Documentation
├── main.py           # Entry point
└── README.md         # This file
```

## Configuration

Customize the game by editing configuration files in the `config/` directory:

- `pieces.json` - Define piece types and abilities
- `board.json` - Configure board layout and special elements
- `game_settings.json` - Set game rules and scoring

## Development

### Running Tests

```bash
# Run all tests
python -m unittest discover tests

# Run specific test file
python -m unittest tests.test_board

# Run with test runner
python tests/__init__.py
```

### Adding New Features

See `docs/DEVELOPER.md` for detailed development guidelines.

## Documentation

- [Design Document](docs/DESIGN.md) - Game design and mechanics
- [Developer Guide](docs/DEVELOPER.md) - Development guidelines
- [Asset Guidelines](assets/README.md) - Asset requirements

## Roadmap

- [ ] Graphical user interface (GUI) with Pygame
- [ ] AI opponent with multiple difficulty levels
- [ ] Online multiplayer support
- [ ] Move history and game replay
- [ ] Additional fantasy pieces (Wizard, Dragon, Paladin)
- [ ] Sound effects and animations
- [ ] Save/load game functionality
- [ ] Tournament mode

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

This project is open source. See LICENSE file for details.

## Credits

Created by the Fantasy Chess Team

## Support

For issues or questions, please open an issue on GitHub.

---

Enjoy playing Fantasy Chess! ♔♕♖♗♘♙
