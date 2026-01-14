"""Chess board implementation with fantasy elements"""

from typing import List, Optional, Tuple, Dict
from src.piece import Piece, PieceColor, PieceType


class Board:
    """Chess board with fantasy elements support"""
    
    def __init__(self, size: int = 8):
        """
        Initialize the chess board
        
        Args:
            size: Size of the board (default 8x8)
        """
        self.size = size
        self.grid = [[None for _ in range(size)] for _ in range(size)]
        self.portals: List[Dict] = []
        self.special_squares: Dict[Tuple[int, int], str] = {}
        self.captured_pieces = {PieceColor.WHITE: [], PieceColor.BLACK: []}
        
    def setup_standard_board(self):
        """Setup the board with standard chess starting positions"""
        # Setup white pieces
        piece_order = [
            PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, PieceType.QUEEN,
            PieceType.KING, PieceType.BISHOP, PieceType.KNIGHT, PieceType.ROOK
        ]
        
        for col, piece_type in enumerate(piece_order):
            self.grid[7][col] = Piece(PieceColor.WHITE, piece_type, (7, col))
        
        for col in range(8):
            self.grid[6][col] = Piece(PieceColor.WHITE, PieceType.PAWN, (6, col))
        
        # Setup black pieces
        for col, piece_type in enumerate(piece_order):
            self.grid[0][col] = Piece(PieceColor.BLACK, piece_type, (0, col))
        
        for col in range(8):
            self.grid[1][col] = Piece(PieceColor.BLACK, PieceType.PAWN, (1, col))
    
    def is_valid_position(self, row: int, col: int) -> bool:
        """Check if position is within board bounds"""
        return 0 <= row < self.size and 0 <= col < self.size
    
    def is_empty(self, row: int, col: int) -> bool:
        """Check if a square is empty"""
        if not self.is_valid_position(row, col):
            return False
        return self.grid[row][col] is None
    
    def get_piece(self, row: int, col: int) -> Optional[Piece]:
        """Get piece at position"""
        if not self.is_valid_position(row, col):
            return None
        return self.grid[row][col]
    
    def set_piece(self, row: int, col: int, piece: Optional[Piece]):
        """Set piece at position"""
        if self.is_valid_position(row, col):
            self.grid[row][col] = piece
            if piece:
                piece.position = (row, col)
    
    def move_piece(self, from_pos: Tuple[int, int], to_pos: Tuple[int, int]) -> bool:
        """
        Move a piece from one position to another
        
        Args:
            from_pos: Starting position (row, col)
            to_pos: Destination position (row, col)
            
        Returns:
            True if move was successful, False otherwise
        """
        from_row, from_col = from_pos
        to_row, to_col = to_pos
        
        piece = self.get_piece(from_row, from_col)
        if not piece:
            return False
        
        # Check if destination has an opponent's piece
        target_piece = self.get_piece(to_row, to_col)
        if target_piece:
            if target_piece.color == piece.color:
                return False
            # Capture the piece
            self.captured_pieces[target_piece.color].append(target_piece)
        
        # Check for portal at destination
        portal_exit = self._check_portal(to_pos)
        if portal_exit:
            to_row, to_col = portal_exit
        
        # Move the piece
        self.grid[from_row][from_col] = None
        self.grid[to_row][to_col] = piece
        piece.move_to((to_row, to_col))
        
        return True
    
    def add_portal(self, entry: Tuple[int, int], exit: Tuple[int, int]):
        """
        Add a portal to the board
        
        Args:
            entry: Portal entry position (row, col)
            exit: Portal exit position (row, col)
        """
        self.portals.append({
            "entry": entry,
            "exit": exit
        })
    
    def _check_portal(self, position: Tuple[int, int]) -> Optional[Tuple[int, int]]:
        """Check if position is a portal entry and return exit"""
        for portal in self.portals:
            if portal["entry"] == position:
                return portal["exit"]
        return None
    
    def add_special_square(self, position: Tuple[int, int], effect: str):
        """
        Add a special square with an effect
        
        Args:
            position: Square position (row, col)
            effect: Effect type (e.g., "power_boost", "freeze", "teleport")
        """
        self.special_squares[position] = effect
    
    def get_all_pieces(self, color: Optional[PieceColor] = None) -> List[Piece]:
        """
        Get all pieces on the board
        
        Args:
            color: Optional color filter
            
        Returns:
            List of pieces
        """
        pieces = []
        for row in range(self.size):
            for col in range(self.size):
                piece = self.grid[row][col]
                if piece and (color is None or piece.color == color):
                    pieces.append(piece)
        return pieces
    
    def find_king(self, color: PieceColor) -> Optional[Piece]:
        """Find the king of the specified color"""
        for row in range(self.size):
            for col in range(self.size):
                piece = self.grid[row][col]
                if piece and piece.color == color and piece.piece_type == PieceType.KING:
                    return piece
        return None
    
    def is_under_attack(self, position: Tuple[int, int], by_color: PieceColor) -> bool:
        """
        Check if a position is under attack by pieces of a given color
        
        Args:
            position: Position to check (row, col)
            by_color: Color of attacking pieces
            
        Returns:
            True if position is under attack
        """
        attacking_pieces = self.get_all_pieces(by_color)
        for piece in attacking_pieces:
            if position in piece.get_possible_moves(self):
                return True
        return False
    
    def display(self):
        """Display the board in text format"""
        print("\n  ", end="")
        for col in range(self.size):
            print(f" {chr(97 + col)} ", end="")
        print()
        
        for row in range(self.size):
            print(f"{self.size - row} ", end="")
            for col in range(self.size):
                piece = self.grid[row][col]
                if piece:
                    print(f" {piece} ", end="")
                else:
                    print(" . ", end="")
            print(f" {self.size - row}")
        
        print("  ", end="")
        for col in range(self.size):
            print(f" {chr(97 + col)} ", end="")
        print("\n")
    
    def __repr__(self):
        return f"Board({self.size}x{self.size})"
