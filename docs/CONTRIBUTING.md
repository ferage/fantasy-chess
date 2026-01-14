# Contributing to Fantasy Chess

Thank you for your interest in contributing to Fantasy Chess! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the problem
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (browser, OS, etc.)

### Suggesting Features

We welcome feature suggestions! Please open an issue with:
- A clear description of the feature
- Why it would be useful
- Possible implementation ideas
- Examples from other projects (if applicable)

### Pull Requests

1. **Fork the repository**
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test your changes** thoroughly
5. **Commit your changes** with clear messages:
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## Development Guidelines

### Code Style

- Use consistent indentation (2 spaces)
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Follow existing code patterns in the project

### JavaScript Guidelines

- Use ES6+ features where appropriate
- Keep functions small and focused
- Avoid global variables
- Use meaningful variable names
- Add JSDoc comments for public functions

Example:
```javascript
/**
 * Calculate valid moves for a piece
 * @param {Board} board - The game board
 * @returns {Array} Array of valid move positions
 */
getValidMoves(board) {
  // Implementation
}
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Test edge cases

Run tests:
```bash
npm test
```

### Commit Messages

Write clear commit messages:
- Use present tense ("Add feature" not "Added feature")
- Start with a capital letter
- Keep first line under 50 characters
- Add detailed description if needed

Good examples:
```
Add knight piece movement validation
Fix board rendering bug in mobile view
Update README with installation instructions
```

## Project Structure

Understanding the project structure will help you contribute effectively:

```
src/
├── core/           # Game logic (Board, Game, Pieces)
├── ui/             # User interface components
└── utils/          # Utility functions

tests/              # Test files
public/             # Static assets
docs/               # Documentation
```

## Areas for Contribution

### High Priority
- Implement castling logic
- Add en passant move
- Implement pawn promotion
- Add check and checkmate detection

### Medium Priority
- Create AI opponent
- Add move animation
- Implement undo/redo
- Save game state

### Nice to Have
- Multiplayer support
- Different board themes
- Sound effects
- Piece animation effects
- Game replay feature
- Opening move database

## Getting Help

If you need help:
- Check existing issues and documentation
- Ask questions in issue comments
- Reach out to maintainers

## Recognition

Contributors will be recognized in the project. Thank you for helping make Fantasy Chess better!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
