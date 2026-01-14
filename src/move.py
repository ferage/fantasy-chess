"""Move class for representing and validating chess moves"""

from typing import Tuple, Optional
from src.piece import Piece


class Move:
    """Represents a chess move"""
    
    def __init__(
        self,
        piece: Piece,
        from_pos: Tuple[int, int],
        to_pos: Tuple[int, int],
        is_capture: bool = False,
        is_castling: bool = False,
        is_en_passant: bool = False,
        promotion_type: Optional[str] = None
    ):
        """
        Initialize a move
        
        Args:
            piece: The piece being moved
            from_pos: Starting position (row, col)
            to_pos: Destination position (row, col)
            is_capture: Whether this move captures a piece
            is_castling: Whether this is a castling move
            is_en_passant: Whether this is an en passant capture
            promotion_type: Type of piece for pawn promotion
        """
        self.piece = piece
        self.from_pos = from_pos
        self.to_pos = to_pos
        self.is_capture = is_capture
        self.is_castling = is_castling
        self.is_en_passant = is_en_passant
        self.promotion_type = promotion_type
        self.timestamp = None
        
    def is_valid(self, board) -> bool:
        """
        Check if the move is valid
        
        Args:
            board: The game board
            
        Returns:
            True if move is valid
        """
        # Check if destination is in possible moves
        possible_moves = self.piece.get_possible_moves(board)
        if self.to_pos not in possible_moves:
            return False
        
        # Additional validation can be added here
        # (e.g., check if move would put own king in check)
        
        return True
    
    def execute(self, board) -> bool:
        """
        Execute the move on the board
        
        Args:
            board: The game board
            
        Returns:
            True if move was executed successfully
        """
        if not self.is_valid(board):
            return False
        
        return board.move_piece(self.from_pos, self.to_pos)
    
    def to_algebraic(self) -> str:
        """
        Convert move to algebraic notation
        
        Returns:
            Move in algebraic notation (e.g., "e2e4", "Nf3")
        """
        from_row, from_col = self.from_pos
        to_row, to_col = self.to_pos
        
        from_square = f"{chr(97 + from_col)}{8 - from_row}"
        to_square = f"{chr(97 + to_col)}{8 - to_row}"
        
        piece_symbol = ""
        if self.piece.piece_type.value != "pawn":
            piece_symbol = self.piece.piece_type.value[0].upper()
        
        capture_symbol = "x" if self.is_capture else ""
        
        return f"{piece_symbol}{from_square}{capture_symbol}{to_square}"
    
    def __repr__(self):
        return f"Move({self.piece} from {self.from_pos} to {self.to_pos})"
