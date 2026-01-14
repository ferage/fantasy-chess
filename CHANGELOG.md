# Changelog

All notable changes to the Fantasy Chess project will be documented in this file.

## [0.1.0] - 2026-01-14

### Added
- Initial project structure and file organization
- Core game logic implementation:
  - Board class with 8x8 grid
  - Piece classes with movement rules for all standard pieces
  - Player management system
  - Move validation and execution
  - Game controller with turn management
- Fantasy elements support:
  - Portal system for piece teleportation
  - Special squares with various effects
  - Special ability framework for pieces
- Text-based user interface:
  - Main menu system
  - Interactive gameplay
  - Move input via algebraic notation
  - Board display in terminal
- Configuration system:
  - JSON files for pieces, board, and game settings
  - Customizable rules and scoring
- Complete test suite:
  - Unit tests for Board, Piece, and Game classes
  - 19 passing tests with good coverage
- Documentation:
  - Comprehensive README with quick start guide
  - Design document explaining game mechanics
  - Developer guide for contributors
  - Asset guidelines
- Project infrastructure:
  - .gitignore for Python projects
  - MIT License
  - requirements.txt for dependencies
  - Organized folder structure

### Features
- Standard chess rules implementation
- All piece movements (pawn, rook, knight, bishop, queen, king)
- Check and checkmate detection
- Stalemate detection
- Turn-based gameplay
- Move history tracking
- Capture tracking
- Portal teleportation system
- Special square effects framework

### Technical Details
- Python 3.8+ compatible
- Object-oriented design
- Modular architecture
- Extensible for future features
- No external dependencies for basic version

## Future Releases

### Planned for [0.2.0]
- AI opponent with difficulty levels
- Save/load game functionality
- Enhanced move validation (en passant, castling)
- Pawn promotion implementation

### Planned for [0.3.0]
- Graphical user interface with Pygame
- Sound effects and music
- Animated piece movements
- Custom themes

### Planned for [0.4.0]
- Online multiplayer support
- Network protocol
- Game lobby system
- Player matchmaking

### Planned for [0.5.0]
- Additional fantasy pieces (Wizard, Dragon, Paladin)
- Advanced special abilities
- More fantasy elements
- Custom piece creator
