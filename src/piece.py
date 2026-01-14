"""Chess piece classes with fantasy abilities"""

from enum import Enum
from typing import List, Tuple, Optional


class PieceColor(Enum):
    """Enum for piece colors"""
    WHITE = "white"
    BLACK = "black"


class PieceType(Enum):
    """Enum for piece types"""
    KING = "king"
    QUEEN = "queen"
    ROOK = "rook"
    BISHOP = "bishop"
    KNIGHT = "knight"
    PAWN = "pawn"


class Piece:
    """Base class for chess pieces"""
    
    def __init__(self, color: PieceColor, piece_type: PieceType, position: Tuple[int, int]):
        """
        Initialize a chess piece
        
        Args:
            color: Color of the piece (WHITE or BLACK)
            piece_type: Type of the piece
            position: Current position as (row, col) tuple
        """
        self.color = color
        self.piece_type = piece_type
        self.position = position
        self.has_moved = False
        self.special_ability = None
        
    def get_possible_moves(self, board) -> List[Tuple[int, int]]:
        """
        Get all possible moves for this piece
        
        Args:
            board: The game board
            
        Returns:
            List of valid move positions as (row, col) tuples
        """
        moves = []
        row, col = self.position
        
        if self.piece_type == PieceType.PAWN:
            moves = self._get_pawn_moves(board, row, col)
        elif self.piece_type == PieceType.ROOK:
            moves = self._get_rook_moves(board, row, col)
        elif self.piece_type == PieceType.KNIGHT:
            moves = self._get_knight_moves(board, row, col)
        elif self.piece_type == PieceType.BISHOP:
            moves = self._get_bishop_moves(board, row, col)
        elif self.piece_type == PieceType.QUEEN:
            moves = self._get_queen_moves(board, row, col)
        elif self.piece_type == PieceType.KING:
            moves = self._get_king_moves(board, row, col)
            
        return moves
    
    def _get_pawn_moves(self, board, row: int, col: int) -> List[Tuple[int, int]]:
        """Get possible pawn moves"""
        moves = []
        direction = -1 if self.color == PieceColor.WHITE else 1
        
        # Forward move
        if board.is_valid_position(row + direction, col) and board.is_empty(row + direction, col):
            moves.append((row + direction, col))
            
            # Double move from starting position
            if not self.has_moved:
                if board.is_valid_position(row + 2 * direction, col) and board.is_empty(row + 2 * direction, col):
                    moves.append((row + 2 * direction, col))
        
        # Capture moves
        for dc in [-1, 1]:
            new_row, new_col = row + direction, col + dc
            if board.is_valid_position(new_row, new_col):
                piece = board.get_piece(new_row, new_col)
                if piece and piece.color != self.color:
                    moves.append((new_row, new_col))
        
        return moves
    
    def _get_rook_moves(self, board, row: int, col: int) -> List[Tuple[int, int]]:
        """Get possible rook moves"""
        moves = []
        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
        
        for dr, dc in directions:
            for i in range(1, 8):
                new_row, new_col = row + dr * i, col + dc * i
                if not board.is_valid_position(new_row, new_col):
                    break
                    
                piece = board.get_piece(new_row, new_col)
                if piece:
                    if piece.color != self.color:
                        moves.append((new_row, new_col))
                    break
                else:
                    moves.append((new_row, new_col))
        
        return moves
    
    def _get_knight_moves(self, board, row: int, col: int) -> List[Tuple[int, int]]:
        """Get possible knight moves"""
        moves = []
        knight_moves = [
            (-2, -1), (-2, 1), (-1, -2), (-1, 2),
            (1, -2), (1, 2), (2, -1), (2, 1)
        ]
        
        for dr, dc in knight_moves:
            new_row, new_col = row + dr, col + dc
            if board.is_valid_position(new_row, new_col):
                piece = board.get_piece(new_row, new_col)
                if not piece or piece.color != self.color:
                    moves.append((new_row, new_col))
        
        return moves
    
    def _get_bishop_moves(self, board, row: int, col: int) -> List[Tuple[int, int]]:
        """Get possible bishop moves"""
        moves = []
        directions = [(1, 1), (1, -1), (-1, 1), (-1, -1)]
        
        for dr, dc in directions:
            for i in range(1, 8):
                new_row, new_col = row + dr * i, col + dc * i
                if not board.is_valid_position(new_row, new_col):
                    break
                    
                piece = board.get_piece(new_row, new_col)
                if piece:
                    if piece.color != self.color:
                        moves.append((new_row, new_col))
                    break
                else:
                    moves.append((new_row, new_col))
        
        return moves
    
    def _get_queen_moves(self, board, row: int, col: int) -> List[Tuple[int, int]]:
        """Get possible queen moves (combination of rook and bishop)"""
        moves = self._get_rook_moves(board, row, col)
        moves.extend(self._get_bishop_moves(board, row, col))
        return moves
    
    def _get_king_moves(self, board, row: int, col: int) -> List[Tuple[int, int]]:
        """Get possible king moves"""
        moves = []
        directions = [
            (-1, -1), (-1, 0), (-1, 1),
            (0, -1), (0, 1),
            (1, -1), (1, 0), (1, 1)
        ]
        
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            if board.is_valid_position(new_row, new_col):
                piece = board.get_piece(new_row, new_col)
                if not piece or piece.color != self.color:
                    moves.append((new_row, new_col))
        
        return moves
    
    def move_to(self, position: Tuple[int, int]):
        """Move piece to new position"""
        self.position = position
        self.has_moved = True
    
    def use_special_ability(self, board, target=None):
        """
        Use the piece's special fantasy ability
        
        Args:
            board: The game board
            target: Optional target for the ability
            
        Returns:
            Result of using the ability
        """
        if not self.special_ability:
            return None
        
        # Implement special ability logic here
        return f"Special ability {self.special_ability} used!"
    
    def __repr__(self):
        return f"{self.color.value[0].upper()}{self.piece_type.value[0].upper()}"
