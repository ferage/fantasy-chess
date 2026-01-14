# Fantasy Chess - Shooting Animations Implementation

## Overview
This project implements a fantasy chess game with minimalistic shooting animations for five different chess-like pieces. Each piece has unique shooting capabilities and visual effects.

## Implemented Features

### 1. Game Board
- 8x8 chess board with alternating light and dark squares
- Professional chess board styling with brown border
- Responsive piece placement and movement

### 2. Chess Pieces

#### Pawn (💣 - Robbanó lötty / Bomb)
- **Movement**: Shoots forward and diagonally (one square)
- **Animation**: Bomb-like trajectory with arc motion
- **Effect**: Red glowing projectile that arcs upward before reaching target
- **Visual**: Radial gradient with red/dark red colors and glow effect

#### Bishop (🏹 - Arrow)
- **Movement**: Shoots diagonally in all four directions
- **Animation**: Arrow flight animation
- **Effect**: Brown arrow with pointed tip travels in straight line
- **Visual**: Linear gradient with arrow shape using CSS clip-path

#### King (⚡ - Light Beam)
- **Movement**: Shoots in all 8 directions (one square each)
- **Animation**: Light beam effect with expanding glow
- **Effect**: Yellow/orange energy beam that expands and fades
- **Visual**: Radial gradient with multi-layered box-shadow for glow

#### Hobbit (🪨 - Sling Projectile)
- **Movement**: Shoots 2 squares in cardinal directions (up, down, left, right)
- **Animation**: Sling projectile with arc and rotation
- **Effect**: Gray stone that spins and arcs before hitting target
- **Visual**: Circular stone with rotation and arc trajectory

#### Dwarf (🪓 - Axe Throw)
- **Movement**: Throws axe in straight lines (all four cardinal directions)
- **Animation**: Spinning axe throw
- **Effect**: Diamond-shaped axe rotates 720 degrees while traveling
- **Visual**: Gray diamond shape using clip-path with rotation animation

### 3. User Interface Features

#### Selection System
- **Blue highlight**: Selected piece
- **Purple pulsing highlight**: Valid target squares
- **Hover effects**: Pieces scale up on hover
- **Smooth transitions**: All state changes are animated

#### Animation System
- **Trigger**: Animations play when clicking a highlighted purple square
- **Duration**: 1 second animation time
- **Disappearing effect**: All projectiles fade and shrink at the end
- **CSS Variables**: Dynamic positioning using CSS custom properties

### 4. Technical Implementation

#### Components
- **App.jsx**: Main application container
- **Board.jsx**: Game board with state management and animation overlay
- **Square.jsx**: Individual square with piece rendering

#### State Management
- Board state: 8x8 array tracking piece positions
- Selected square: Currently selected piece position
- Possible moves: Array of valid target squares
- Animation state: Current animation configuration

#### Styling
- **Board.css**: Board layout and animation keyframes
- **Square.css**: Square styling and selection states
- **App.css**: Application-level styling

## Animation Details

### CSS Keyframes
Each piece type has custom keyframe animations:

1. **shoot-bomb**: Arc trajectory with scaling
2. **shoot** (arrow): Linear movement with rotation
3. **shoot-beam**: Expanding glow with opacity fade
4. **shoot-sling**: Arc with 720° rotation
5. **shoot-axe**: Linear with 720° rotation

### CSS Custom Properties
Dynamic animation values:
- `--start-x`: Starting X position in pixels
- `--start-y`: Starting Y position in pixels
- `--end-x`: Ending X position in pixels
- `--end-y`: Ending Y position in pixels
- `--angle`: Rotation angle for directional projectiles

## How to Use

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Game Rules

1. Click on a piece to select it (shown with blue highlight)
2. Valid shooting targets are highlighted in purple with pulsing effect
3. Click on a highlighted square to shoot and move the piece
4. Animation plays showing the projectile traveling to the target
5. After animation completes, the piece moves to the new position

## Technologies Used

- **React 19**: Component-based UI framework
- **Vite**: Fast build tool and dev server
- **CSS3**: Animations and visual effects
- **Modern JavaScript**: ES6+ features

## Browser Compatibility

The application uses modern CSS features including:
- CSS Custom Properties (CSS Variables)
- CSS Animations
- CSS Grid/Flexbox
- CSS clip-path

Recommended browsers: Chrome, Firefox, Safari, Edge (latest versions)

## Future Enhancements

Potential improvements:
- Add opponent AI
- Implement capture mechanics
- Add sound effects
- Multiple board themes
- Multiplayer support
- Move history and undo
- Win/lose conditions
