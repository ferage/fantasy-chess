# Assets Directory

This directory contains game assets for Fantasy Chess.

## Structure

```
assets/
├── images/         # Image files (piece sprites, backgrounds, icons)
└── sounds/         # Sound effects (move sounds, capture sounds, etc.)
```

## Images

Place custom piece images here if you want to use graphical sprites instead of Unicode chess symbols.

### Recommended Image Formats
- PNG with transparency for pieces
- SVG for scalable graphics
- JPG for backgrounds

### Naming Convention
- `piece_color_type.png` (e.g., `king_white.png`, `queen_black.png`)

## Sounds

Add sound effects to enhance the gaming experience:

- `move.mp3` - Piece movement sound
- `capture.mp3` - Piece capture sound
- `check.mp3` - Check notification
- `checkmate.mp3` - Checkmate notification
- `castle.mp3` - Castling move
- `promotion.mp3` - Pawn promotion

### Audio Format
- MP3 or OGG for broad browser support
- Keep file sizes small for faster loading

## Usage

To use custom assets in the game:

1. Add your files to the appropriate subdirectory
2. Update the game code to reference the new assets
3. Ensure proper attribution for any third-party assets

## Attribution

If using third-party assets, provide proper attribution here:

- [Asset name] by [Creator] - [License] - [Source URL]
