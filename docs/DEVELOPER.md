# Fantasy Chess - Developer Guide

## Project Structure

```
fantasy-chess/
├── src/                    # Source code
│   ├── __init__.py        # Package initialization
│   ├── board.py           # Board implementation
│   ├── piece.py           # Piece classes
│   ├── player.py          # Player management
│   ├── move.py            # Move validation
│   └── game.py            # Game controller
├── config/                # Configuration files
│   ├── pieces.json        # Piece definitions
│   ├── board.json         # Board settings
│   └── game_settings.json # Game rules
├── assets/                # Game assets
│   ├── images/           # Piece and board images
│   └── sounds/           # Sound effects
├── tests/                 # Unit tests
│   ├── test_piece.py
│   ├── test_board.py
│   └── test_game.py
├── docs/                  # Documentation
├── main.py               # Entry point
├── requirements.txt      # Dependencies
└── README.md            # Project overview
```

## Setup Development Environment

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation
```bash
# Clone the repository
git clone https://github.com/ferage/fantasy-chess.git
cd fantasy-chess

# Install dependencies
pip install -r requirements.txt
```

## Running the Game

```bash
# Run the main game
python main.py

# Run tests
python -m pytest tests/

# Run specific test file
python -m pytest tests/test_board.py

# Run with coverage
python -m pytest --cov=src tests/
```

## Code Style

This project follows PEP 8 style guidelines:
- 4 spaces for indentation
- Maximum line length: 100 characters
- Use descriptive variable names
- Add docstrings to all classes and functions

## Adding New Features

### Adding a New Piece Type

1. Define the piece in `config/pieces.json`
2. Add movement logic in `src/piece.py`
3. Add tests in `tests/test_piece.py`

Example:
```python
def _get_wizard_moves(self, board, row: int, col: int):
    """Get possible wizard moves"""
    # Implement movement logic
    pass
```

### Adding Fantasy Elements

1. Define element in config files
2. Implement logic in relevant class
3. Update game controller to handle element
4. Add tests

## Testing

### Running Tests
```bash
# All tests
python -m unittest discover tests

# Specific test
python -m unittest tests.test_board.TestBoard.test_standard_setup

# With coverage
coverage run -m unittest discover tests
coverage report
```

### Writing Tests
- Use unittest framework
- Follow naming convention: `test_<feature>`
- Include setup and teardown methods
- Test both success and failure cases

## Architecture

### Board Class
Manages the game board state:
- Piece placement
- Move validation
- Portal and special square management

### Piece Class
Defines piece behavior:
- Movement rules
- Special abilities
- Capture logic

### Game Class
Controls game flow:
- Turn management
- Game state (check, checkmate, etc.)
- Win condition checking

### Player Class
Manages player data:
- Score tracking
- Time control
- Special abilities

### Move Class
Handles move operations:
- Move validation
- Algebraic notation
- Move execution

## Configuration

### Modifying Game Rules
Edit `config/game_settings.json`:
```json
{
  "rules": {
    "time_control": {
      "enabled": true,
      "minutes_per_player": 10
    }
  }
}
```

### Adding Custom Pieces
Edit `config/pieces.json`:
```json
{
  "fantasy_pieces": {
    "new_piece": {
      "name": "New Piece",
      "value": 5,
      "moves": "custom movement",
      "special_ability": "description"
    }
  }
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## Debugging

### Common Issues

**Import errors:**
- Ensure you're in the project root directory
- Check Python path includes src directory

**Test failures:**
- Check that board is properly initialized
- Verify piece positions are correct
- Ensure game state is reset between tests

### Debug Mode
```python
# Enable verbose output
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Performance Optimization

- Use efficient data structures
- Cache possible moves when appropriate
- Minimize board copying operations
- Profile code to identify bottlenecks

## License

See LICENSE file for details.
