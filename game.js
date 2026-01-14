// Fantasy Chess Game Engine
// Constants
const TURN_TIME_SECONDS = 15;
const CENTER_CONTROL_TURNS_REQUIRED = 3;
const FREEZE_DURATION = 2;
const POISON_DURATION = 1;

class FantasyChess {
    constructor() {
        this.canvas = document.getElementById('gameBoard');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 80;
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.selectedSpell = null;
        this.gameMode = 'local';
        this.turnTime = TURN_TIME_SECONDS;
        this.turnTimer = null;
        this.gameState = 'playing';
        
        // Win condition tracking
        this.whiteCenterControl = 0;
        this.blackCenterControl = 0;
        this.centerControlTurns = { white: 0, black: 0 };
        
        // Special tiles
        this.centralTiles = [[3, 3], [4, 4]];
        this.whiteProtectedZone = [0, 1]; // rows 0-1
        this.blackProtectedZone = [6, 7]; // rows 6-7
        
        // Status effects
        this.statusEffects = {}; // {position: {type, duration, player}}
        this.shields = {}; // {position: boolean}
        this.fireWalls = []; // [position]
        
        // Move history
        this.moveHistory = [];
        
        this.initializeBoard();
        this.setupEventListeners();
        this.startTurnTimer();
        this.render();
    }
    
    initializeBoard() {
        // White pieces (bottom)
        this.board[0] = [
            new Rook('white', 0, 0),
            new Knight('white', 0, 1),
            new Bishop('white', 0, 2),
            new Queen('white', 0, 3),
            new King('white', 0, 4),
            new Bishop('white', 0, 5),
            new Knight('white', 0, 6),
            new Rook('white', 0, 7)
        ];
        
        for (let col = 0; col < 8; col++) {
            this.board[1][col] = new Pawn('white', 1, col);
        }
        
        // Black pieces (top)
        this.board[7] = [
            new Rook('black', 7, 0),
            new Knight('black', 7, 1),
            new Bishop('black', 7, 2),
            new Queen('black', 7, 3),
            new King('black', 7, 4),
            new Bishop('black', 7, 5),
            new Knight('black', 7, 6),
            new Rook('black', 7, 7)
        ];
        
        for (let col = 0; col < 8; col++) {
            this.board[6][col] = new Pawn('black', 6, col);
        }
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        document.querySelectorAll('.spell-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSpellSelect(e));
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.undoMove());
        document.getElementById('gameMode').addEventListener('change', (e) => {
            this.gameMode = e.target.value;
            this.newGame();
        });
        
        // Spell descriptions
        document.querySelectorAll('.spell-btn').forEach(btn => {
            btn.addEventListener('mouseenter', (e) => {
                const spell = e.target.dataset.spell;
                this.showSpellDescription(spell);
            });
        });
    }
    
    showSpellDescription(spell) {
        const descriptions = {
            firewall: 'Creates a wall that prevents movement on the targeted tile.',
            freeze: `Immobilizes an enemy piece for ${FREEZE_DURATION} turns.`,
            poison: `Disables enemy attacks for ${POISON_DURATION} turn${POISON_DURATION !== 1 ? 's' : ''}.`,
            dispel: 'Removes all status effects from a targeted piece.',
            shield: 'Protects an allied piece from one attack.',
            transform: 'Transforms an enemy piece into a friendly piece.'
        };
        document.getElementById('spellDescription').textContent = descriptions[spell] || 'Select a spell';
    }
    
    handleSpellSelect(e) {
        const spell = e.target.dataset.spell;
        
        // Deselect all spell buttons
        document.querySelectorAll('.spell-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Toggle spell selection
        if (this.selectedSpell === spell) {
            this.selectedSpell = null;
        } else {
            this.selectedSpell = spell;
            e.target.classList.add('selected');
            this.updateGameStatus(`Spell ${spell} selected. Click a tile to cast.`);
        }
    }
    
    handleClick(e) {
        if (this.gameState !== 'playing') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.floor(x / this.tileSize);
        const row = Math.floor(y / this.tileSize);
        
        if (row < 0 || row >= 8 || col < 0 || col >= 8) return;
        
        // Handle spell casting
        if (this.selectedSpell) {
            this.castSpell(row, col);
            return;
        }
        
        // Handle piece selection and movement
        if (this.selectedPiece) {
            this.attemptMove(row, col);
        } else {
            this.selectPiece(row, col);
        }
    }
    
    selectPiece(row, col) {
        const piece = this.board[row][col];
        
        if (piece && piece.color === this.currentPlayer) {
            // Check if piece is frozen
            const key = `${row},${col}`;
            if (this.statusEffects[key]?.type === 'freeze') {
                this.updateGameStatus('This piece is frozen!');
                return;
            }
            
            this.selectedPiece = { piece, row, col };
            this.updateGameStatus(`${piece.type} selected. Choose where to move.`);
            this.render();
        }
    }
    
    attemptMove(targetRow, targetCol) {
        const { piece, row, col } = this.selectedPiece;
        const moves = piece.getPossibleMoves(this.board, row, col);
        const attacks = piece.getPossibleAttacks(this.board, row, col);
        const shoots = piece.canShoot ? piece.getShootTargets(this.board, row, col) : [];
        
        // Check if piece is poisoned and trying to attack
        const pieceKey = `${row},${col}`;
        if (this.statusEffects[pieceKey]?.type === 'poison') {
            if (attacks.some(m => m[0] === targetRow && m[1] === targetCol) || 
                shoots.some(m => m[0] === targetRow && m[1] === targetCol)) {
                this.updateGameStatus('This piece is poisoned and cannot attack!');
                this.selectedPiece = null;
                this.render();
                return;
            }
        }
        
        // Check if target is a firewall
        if (this.fireWalls.some(pos => pos[0] === targetRow && pos[1] === targetCol)) {
            this.updateGameStatus('Cannot move to a fire wall tile!');
            this.selectedPiece = null;
            this.render();
            return;
        }
        
        let moveType = null;
        if (moves.some(m => m[0] === targetRow && m[1] === targetCol)) {
            moveType = 'move';
        } else if (attacks.some(m => m[0] === targetRow && m[1] === targetCol)) {
            moveType = 'attack';
        } else if (shoots.some(m => m[0] === targetRow && m[1] === targetCol)) {
            moveType = 'shoot';
        }
        
        if (moveType) {
            // Check shield before capturing
            const targetKey = `${targetRow},${targetCol}`;
            if (moveType === 'attack' || moveType === 'shoot') {
                if (this.shields[targetKey]) {
                    delete this.shields[targetKey];
                    this.updateGameStatus('Attack blocked by shield!');
                    this.selectedPiece = null;
                    this.render();
                    return;
                }
            }
            
            // Save move for undo
            this.moveHistory.push({
                from: [row, col],
                to: [targetRow, targetCol],
                piece: piece,
                captured: this.board[targetRow][targetCol],
                moveType: moveType
            });
            
            // Execute move
            if (moveType === 'attack' || moveType === 'move') {
                this.board[targetRow][targetCol] = piece;
                this.board[row][col] = null;
                piece.row = targetRow;
                piece.col = targetCol;
                piece.hasMoved = true;
            } else if (moveType === 'shoot') {
                // Shoot action - piece stays in place but shoots depleted
                const targetPiece = this.board[targetRow][targetCol];
                if (targetPiece) {
                    this.board[targetRow][targetCol] = null;
                }
                piece.hasShot = true;
            }
            
            this.selectedPiece = null;
            this.checkWinConditions();
            this.nextTurn();
        } else {
            this.updateGameStatus('Invalid move. Select a valid target.');
        }
        
        this.render();
    }
    
    castSpell(row, col) {
        const spell = this.selectedSpell;
        const key = `${row},${col}`;
        const targetPiece = this.board[row][col];
        
        switch (spell) {
            case 'firewall':
                if (!targetPiece && !this.fireWalls.some(pos => pos[0] === row && pos[1] === col)) {
                    this.fireWalls.push([row, col]);
                    this.updateGameStatus('Fire wall created!');
                }
                break;
                
            case 'freeze':
                if (targetPiece && targetPiece.color !== this.currentPlayer) {
                    this.statusEffects[key] = { type: 'freeze', duration: FREEZE_DURATION, player: this.currentPlayer };
                    this.updateGameStatus(`Enemy ${targetPiece.type} frozen!`);
                }
                break;
                
            case 'poison':
                if (targetPiece && targetPiece.color !== this.currentPlayer) {
                    this.statusEffects[key] = { type: 'poison', duration: POISON_DURATION, player: this.currentPlayer };
                    this.updateGameStatus(`Enemy ${targetPiece.type} poisoned!`);
                }
                break;
                
            case 'dispel':
                if (this.statusEffects[key]) {
                    delete this.statusEffects[key];
                    this.updateGameStatus('Status effects removed!');
                }
                break;
                
            case 'shield':
                if (targetPiece && targetPiece.color === this.currentPlayer) {
                    this.shields[key] = true;
                    this.updateGameStatus(`${targetPiece.type} shielded!`);
                }
                break;
                
            case 'transform':
                if (targetPiece && targetPiece.color !== this.currentPlayer) {
                    targetPiece.color = this.currentPlayer;
                    this.updateGameStatus(`Enemy ${targetPiece.type} transformed!`);
                }
                break;
        }
        
        // Clear spell selection
        this.selectedSpell = null;
        document.querySelectorAll('.spell-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        this.render();
    }
    
    checkWinConditions() {
        // Check for King elimination
        let whiteKing = false, blackKing = false;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.type === 'King') {
                    if (piece.color === 'white') whiteKing = true;
                    if (piece.color === 'black') blackKing = true;
                }
            }
        }
        
        if (!whiteKing) {
            this.endGame('Black wins by eliminating the White King!');
            return;
        }
        if (!blackKing) {
            this.endGame('White wins by eliminating the Black King!');
            return;
        }
        
        // Check central tile control
        let whiteCentral = 0, blackCentral = 0;
        for (const [row, col] of this.centralTiles) {
            const piece = this.board[row][col];
            if (piece) {
                if (piece.color === 'white') whiteCentral++;
                if (piece.color === 'black') blackCentral++;
            }
        }
        
        if (whiteCentral === 2) {
            this.centerControlTurns.white++;
        } else {
            this.centerControlTurns.white = 0;
        }
        
        if (blackCentral === 2) {
            this.centerControlTurns.black++;
        } else {
            this.centerControlTurns.black = 0;
        }
        
        document.getElementById('whiteCenterTurns').textContent = this.centerControlTurns.white;
        document.getElementById('blackCenterTurns').textContent = this.centerControlTurns.black;
        
        if (this.centerControlTurns.white >= CENTER_CONTROL_TURNS_REQUIRED) {
            this.endGame('White wins by controlling the center!');
            return;
        }
        if (this.centerControlTurns.black >= CENTER_CONTROL_TURNS_REQUIRED) {
            this.endGame('Black wins by controlling the center!');
            return;
        }
        
        // Check protected zone reach (must have moved to reach)
        for (let col = 0; col < 8; col++) {
            for (let row of this.blackProtectedZone) {
                const piece = this.board[row][col];
                // White piece reaching black's protected zone (rows 6-7)
                if (piece && piece.color === 'white' && piece.type !== 'Pawn' && piece.hasMoved) {
                    this.endGame('White wins by reaching the protected zone!');
                    return;
                }
            }
            for (let row of this.whiteProtectedZone) {
                const piece = this.board[row][col];
                // Black piece reaching white's protected zone (rows 0-1)
                if (piece && piece.color === 'black' && piece.type !== 'Pawn' && piece.hasMoved) {
                    this.endGame('Black wins by reaching the protected zone!');
                    return;
                }
            }
        }
    }
    
    nextTurn() {
        // Decrease status effect durations
        for (const key in this.statusEffects) {
            this.statusEffects[key].duration--;
            if (this.statusEffects[key].duration <= 0) {
                delete this.statusEffects[key];
            }
        }
        
        // Reset shooting ability at end of turn
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === this.currentPlayer) {
                    piece.hasShot = false;
                }
            }
        }
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateGameStatus(`${this.currentPlayer}'s turn`);
        document.getElementById('currentPlayer').textContent = 
            `${this.currentPlayer.charAt(0).toUpperCase() + this.currentPlayer.slice(1)}'s Turn`;
        
        this.resetTurnTimer();
        
        // AI move
        if (this.gameMode.startsWith('ai-') && this.currentPlayer === 'black') {
            setTimeout(() => this.makeAIMove(), 500);
        }
    }
    
    makeAIMove() {
        const difficulty = this.gameMode.split('-')[1];
        const pieces = [];
        
        // Collect all AI pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece && piece.color === 'black') {
                    pieces.push({ piece, row, col });
                }
            }
        }
        
        if (pieces.length === 0) return;
        
        // Select a random piece with valid moves
        const validMoves = [];
        for (const { piece, row, col } of pieces) {
            const moves = piece.getPossibleMoves(this.board, row, col);
            const attacks = piece.getPossibleAttacks(this.board, row, col);
            const shoots = piece.canShoot && !piece.hasShot ? 
                piece.getShootTargets(this.board, row, col) : [];
            
            const allMoves = [...moves, ...attacks, ...shoots];
            if (allMoves.length > 0) {
                validMoves.push({ piece, row, col, moves: allMoves });
            }
        }
        
        if (validMoves.length === 0) {
            this.nextTurn();
            return;
        }
        
        // Choose move based on difficulty
        let selectedMove;
        if (difficulty === 'easy') {
            selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        } else {
            // Prioritize attacks for medium/hard
            const attackMoves = validMoves.filter(m => 
                m.moves.some(pos => this.board[pos[0]][pos[1]] !== null)
            );
            selectedMove = attackMoves.length > 0 ? 
                attackMoves[Math.floor(Math.random() * attackMoves.length)] :
                validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        
        const targetMove = selectedMove.moves[Math.floor(Math.random() * selectedMove.moves.length)];
        
        this.selectedPiece = { 
            piece: selectedMove.piece, 
            row: selectedMove.row, 
            col: selectedMove.col 
        };
        this.attemptMove(targetMove[0], targetMove[1]);
    }
    
    startTurnTimer() {
        this.resetTurnTimer();
    }
    
    resetTurnTimer() {
        if (this.turnTimer) clearInterval(this.turnTimer);
        this.turnTime = TURN_TIME_SECONDS;
        this.updateTimer();
        
        this.turnTimer = setInterval(() => {
            this.turnTime--;
            this.updateTimer();
            
            if (this.turnTime <= 0) {
                // Auto-pass turn on timeout
                this.nextTurn();
            }
        }, 1000);
    }
    
    updateTimer() {
        document.getElementById('timer').textContent = `Time: ${this.turnTime}s`;
    }
    
    updateGameStatus(message) {
        document.getElementById('gameStatus').textContent = message;
    }
    
    endGame(message) {
        this.gameState = 'ended';
        if (this.turnTimer) clearInterval(this.turnTimer);
        this.updateGameStatus(message);
        alert(message);
    }
    
    undoMove() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        const { from, to, piece, captured } = lastMove;
        
        this.board[from[0]][from[1]] = piece;
        this.board[to[0]][to[1]] = captured;
        piece.row = from[0];
        piece.col = from[1];
        
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.render();
    }
    
    newGame() {
        this.board = Array(8).fill(null).map(() => Array(8).fill(null));
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.selectedSpell = null;
        this.gameState = 'playing';
        this.statusEffects = {};
        this.shields = {};
        this.fireWalls = [];
        this.moveHistory = [];
        this.centerControlTurns = { white: 0, black: 0 };
        
        document.getElementById('whiteCenterTurns').textContent = '0';
        document.getElementById('blackCenterTurns').textContent = '0';
        
        this.initializeBoard();
        this.resetTurnTimer();
        this.updateGameStatus('New game started!');
        this.render();
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.drawTile(row, col);
            }
        }
        
        // Draw pieces
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.board[row][col];
                if (piece) {
                    this.drawPiece(piece, row, col);
                }
            }
        }
        
        // Draw status indicators
        this.drawStatusIndicators();
        
        // Draw possible moves if piece selected
        if (this.selectedPiece) {
            this.drawPossibleMoves();
        }
    }
    
    drawTile(row, col) {
        const x = col * this.tileSize;
        const y = row * this.tileSize;
        
        // Base color (alternating brown)
        const isLight = (row + col) % 2 === 0;
        let color = isLight ? '#D2B48C' : '#8B4513';
        
        // Protected zones
        if (this.whiteProtectedZone.includes(row)) {
            color = isLight ? '#D3D3D3' : '#A9A9A9';
        } else if (this.blackProtectedZone.includes(row)) {
            color = isLight ? '#D3D3D3' : '#A9A9A9';
        }
        
        // Central tiles
        if (this.centralTiles.some(([r, c]) => r === row && c === col)) {
            color = '#87CEEB';
        }
        
        // Fire walls
        if (this.fireWalls.some(([r, c]) => r === row && c === col)) {
            color = '#FF4500';
        }
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
        
        // Grid lines
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
    }
    
    drawPiece(piece, row, col) {
        const x = col * this.tileSize + this.tileSize / 2;
        const y = row * this.tileSize + this.tileSize / 2;
        
        // Draw circle background
        this.ctx.fillStyle = piece.color === 'white' ? '#FFFFFF' : '#000000';
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.tileSize / 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = piece.color === 'white' ? '#000000' : '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw piece symbol
        this.ctx.fillStyle = piece.color === 'white' ? '#000000' : '#FFFFFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const symbols = {
            'King': '♔',
            'Queen': '♕',
            'Rook': '♖',
            'Bishop': '♗',
            'Knight': '♘',
            'Pawn': '♙'
        };
        
        this.ctx.fillText(symbols[piece.type] || piece.type[0], x, y);
        
        // Draw shot indicator
        if (piece.canShoot && piece.hasShot) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.beginPath();
            this.ctx.arc(x + 20, y - 20, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    drawStatusIndicators() {
        // Draw shields
        for (const key in this.shields) {
            const [row, col] = key.split(',').map(Number);
            const x = col * this.tileSize + 10;
            const y = row * this.tileSize + 10;
            
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            this.ctx.fillRect(x, y, 15, 15);
        }
        
        // Draw status effects
        for (const key in this.statusEffects) {
            const [row, col] = key.split(',').map(Number);
            const effect = this.statusEffects[key];
            const x = col * this.tileSize + 10;
            const y = row * this.tileSize + 30;
            
            const colors = {
                freeze: 'rgba(0, 191, 255, 0.7)',
                poison: 'rgba(128, 0, 128, 0.7)'
            };
            
            this.ctx.fillStyle = colors[effect.type] || 'rgba(255, 255, 0, 0.7)';
            this.ctx.fillRect(x, y, 15, 15);
        }
    }
    
    drawPossibleMoves() {
        const { piece, row, col } = this.selectedPiece;
        
        const moves = piece.getPossibleMoves(this.board, row, col);
        const attacks = piece.getPossibleAttacks(this.board, row, col);
        const shoots = piece.canShoot && !piece.hasShot ? 
            piece.getShootTargets(this.board, row, col) : [];
        
        // Draw move tiles (green)
        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        for (const [r, c] of moves) {
            this.ctx.fillRect(c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize);
        }
        
        // Draw attack tiles (red)
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
        for (const [r, c] of attacks) {
            this.ctx.fillRect(c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize);
        }
        
        // Draw shoot tiles (purple)
        this.ctx.fillStyle = 'rgba(128, 0, 128, 0.4)';
        for (const [r, c] of shoots) {
            this.ctx.fillRect(c * this.tileSize, r * this.tileSize, this.tileSize, this.tileSize);
        }
        
        // Highlight selected piece
        this.ctx.strokeStyle = 'yellow';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(col * this.tileSize, row * this.tileSize, this.tileSize, this.tileSize);
    }
}

// Piece Classes
class Piece {
    constructor(color, row, col) {
        this.color = color;
        this.row = row;
        this.col = col;
        this.hasMoved = false;
        this.canShoot = false;
        this.hasShot = false;
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }
    
    getPossibleMoves(board, row, col) {
        return [];
    }
    
    getPossibleAttacks(board, row, col) {
        return [];
    }
    
    getShootTargets(board, row, col) {
        return [];
    }
}

class King extends Piece {
    constructor(color, row, col) {
        super(color, row, col);
        this.type = 'King';
        this.canShoot = true;
    }
    
    getPossibleMoves(board, row, col) {
        const moves = [];
        const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol) && !board[newRow][newCol]) {
                moves.push([newRow, newCol]);
            }
        }
        
        return moves;
    }
    
    getPossibleAttacks(board, row, col) {
        const attacks = [];
        const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol)) {
                const target = board[newRow][newCol];
                if (target && target.color !== this.color) {
                    attacks.push([newRow, newCol]);
                }
            }
        }
        
        return attacks;
    }
    
    getShootTargets(board, row, col) {
        const shoots = [];
        // Light beam 1-2 squares straight ahead
        const direction = this.color === 'white' ? 1 : -1;
        
        for (let i = 1; i <= 2; i++) {
            const newRow = row + (direction * i);
            if (this.isValidPosition(newRow, col)) {
                const target = board[newRow][col];
                if (target && target.color !== this.color) {
                    shoots.push([newRow, col]);
                    break;
                }
            }
        }
        
        return shoots;
    }
}

class Queen extends Piece {
    constructor(color, row, col) {
        super(color, row, col);
        this.type = 'Queen';
        this.canShoot = true;
    }
    
    getPossibleMoves(board, row, col) {
        const moves = [];
        const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        
        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                if (board[newRow][newCol]) break;
                
                moves.push([newRow, newCol]);
            }
        }
        
        return moves;
    }
    
    getPossibleAttacks(board, row, col) {
        const attacks = [];
        const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        
        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const target = board[newRow][newCol];
                if (target) {
                    if (target.color !== this.color) {
                        attacks.push([newRow, newCol]);
                    }
                    break;
                }
            }
        }
        
        return attacks;
    }
    
    getShootTargets(board, row, col) {
        // Queen can shoot in straight lines
        return this.getPossibleAttacks(board, row, col).slice(0, 3);
    }
}

class Rook extends Piece {
    constructor(color, row, col) {
        super(color, row, col);
        this.type = 'Rook';
        this.canShoot = false;
    }
    
    getPossibleMoves(board, row, col) {
        const moves = [];
        const directions = [[-1,0],[1,0],[0,-1],[0,1]];
        
        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                if (board[newRow][newCol]) break;
                
                moves.push([newRow, newCol]);
            }
        }
        
        return moves;
    }
    
    getPossibleAttacks(board, row, col) {
        const attacks = [];
        const directions = [[-1,0],[1,0],[0,-1],[0,1]];
        
        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const target = board[newRow][newCol];
                if (target) {
                    if (target.color !== this.color) {
                        attacks.push([newRow, newCol]);
                    }
                    break;
                }
            }
        }
        
        return attacks;
    }
}

class Bishop extends Piece {
    constructor(color, row, col) {
        super(color, row, col);
        this.type = 'Bishop';
        this.canShoot = false;
    }
    
    getPossibleMoves(board, row, col) {
        const moves = [];
        const directions = [[-1,-1],[-1,1],[1,-1],[1,1]];
        
        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                if (board[newRow][newCol]) break;
                
                moves.push([newRow, newCol]);
            }
        }
        
        return moves;
    }
    
    getPossibleAttacks(board, row, col) {
        const attacks = [];
        const directions = [[-1,-1],[-1,1],[1,-1],[1,1]];
        
        for (const [dr, dc] of directions) {
            for (let i = 1; i < 8; i++) {
                const newRow = row + dr * i;
                const newCol = col + dc * i;
                
                if (!this.isValidPosition(newRow, newCol)) break;
                
                const target = board[newRow][newCol];
                if (target) {
                    if (target.color !== this.color) {
                        attacks.push([newRow, newCol]);
                    }
                    break;
                }
            }
        }
        
        return attacks;
    }
}

class Knight extends Piece {
    constructor(color, row, col) {
        super(color, row, col);
        this.type = 'Knight';
        this.canShoot = false;
    }
    
    getPossibleMoves(board, row, col) {
        const moves = [];
        const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        
        for (const [dr, dc] of jumps) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol) && !board[newRow][newCol]) {
                moves.push([newRow, newCol]);
            }
        }
        
        return moves;
    }
    
    getPossibleAttacks(board, row, col) {
        const attacks = [];
        const jumps = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        
        for (const [dr, dc] of jumps) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol)) {
                const target = board[newRow][newCol];
                if (target && target.color !== this.color) {
                    attacks.push([newRow, newCol]);
                }
            }
        }
        
        return attacks;
    }
}

class Pawn extends Piece {
    constructor(color, row, col) {
        super(color, row, col);
        this.type = 'Pawn';
        this.canShoot = true;
    }
    
    getPossibleMoves(board, row, col) {
        const moves = [];
        const direction = this.color === 'white' ? 1 : -1;
        
        // Move forward 1
        const newRow = row + direction;
        if (this.isValidPosition(newRow, col) && !board[newRow][col]) {
            moves.push([newRow, col]);
            
            // Move forward 2 on first move
            if (!this.hasMoved) {
                const newRow2 = row + direction * 2;
                if (this.isValidPosition(newRow2, col) && !board[newRow2][col]) {
                    moves.push([newRow2, col]);
                }
            }
        }
        
        return moves;
    }
    
    getPossibleAttacks(board, row, col) {
        const attacks = [];
        const direction = this.color === 'white' ? 1 : -1;
        
        // Diagonal attacks
        for (const dc of [-1, 1]) {
            const newRow = row + direction;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol)) {
                const target = board[newRow][newCol];
                if (target && target.color !== this.color) {
                    attacks.push([newRow, newCol]);
                }
            }
        }
        
        return attacks;
    }
    
    getShootTargets(board, row, col) {
        const shoots = [];
        // L-shaped shooting pattern (like knight)
        const patterns = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
        
        for (const [dr, dc] of patterns) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol)) {
                const target = board[newRow][newCol];
                if (target && target.color !== this.color) {
                    shoots.push([newRow, newCol]);
                }
            }
        }
        
        return shoots;
    }
}

// Initialize game when page loads
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new FantasyChess();
});
