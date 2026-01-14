"""Unit tests for the Board class"""

import unittest
from src.board import Board
from src.piece import Piece, PieceColor, PieceType


class TestBoard(unittest.TestCase):
    """Test cases for Board class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.board = Board()
    
    def test_board_creation(self):
        """Test creating a board"""
        self.assertEqual(self.board.size, 8)
        self.assertEqual(len(self.board.grid), 8)
        self.assertEqual(len(self.board.grid[0]), 8)
    
    def test_standard_setup(self):
        """Test standard board setup"""
        self.board.setup_standard_board()
        
        # Check white pieces
        self.assertIsNotNone(self.board.get_piece(7, 0))
        self.assertEqual(self.board.get_piece(7, 0).piece_type, PieceType.ROOK)
        self.assertEqual(self.board.get_piece(7, 4).piece_type, PieceType.KING)
        
        # Check black pieces
        self.assertIsNotNone(self.board.get_piece(0, 0))
        self.assertEqual(self.board.get_piece(0, 0).piece_type, PieceType.ROOK)
        self.assertEqual(self.board.get_piece(0, 4).piece_type, PieceType.KING)
        
        # Check pawns
        for col in range(8):
            self.assertEqual(self.board.get_piece(6, col).piece_type, PieceType.PAWN)
            self.assertEqual(self.board.get_piece(1, col).piece_type, PieceType.PAWN)
        
        # Check empty squares
        self.assertIsNone(self.board.get_piece(4, 4))
    
    def test_valid_position(self):
        """Test position validation"""
        self.assertTrue(self.board.is_valid_position(0, 0))
        self.assertTrue(self.board.is_valid_position(7, 7))
        self.assertFalse(self.board.is_valid_position(-1, 0))
        self.assertFalse(self.board.is_valid_position(8, 0))
        self.assertFalse(self.board.is_valid_position(0, 8))
    
    def test_move_piece(self):
        """Test moving a piece"""
        self.board.setup_standard_board()
        
        # Move white pawn
        result = self.board.move_piece((6, 4), (4, 4))
        self.assertTrue(result)
        self.assertIsNone(self.board.get_piece(6, 4))
        self.assertIsNotNone(self.board.get_piece(4, 4))
    
    def test_add_portal(self):
        """Test adding a portal"""
        self.board.add_portal((3, 3), (5, 5))
        self.assertEqual(len(self.board.portals), 1)
        self.assertEqual(self.board.portals[0]["entry"], (3, 3))
        self.assertEqual(self.board.portals[0]["exit"], (5, 5))
    
    def test_special_square(self):
        """Test adding a special square"""
        self.board.add_special_square((4, 4), "power_boost")
        self.assertIn((4, 4), self.board.special_squares)
        self.assertEqual(self.board.special_squares[(4, 4)], "power_boost")
    
    def test_find_king(self):
        """Test finding the king"""
        self.board.setup_standard_board()
        
        white_king = self.board.find_king(PieceColor.WHITE)
        self.assertIsNotNone(white_king)
        self.assertEqual(white_king.piece_type, PieceType.KING)
        self.assertEqual(white_king.color, PieceColor.WHITE)
        
        black_king = self.board.find_king(PieceColor.BLACK)
        self.assertIsNotNone(black_king)
        self.assertEqual(black_king.piece_type, PieceType.KING)
        self.assertEqual(black_king.color, PieceColor.BLACK)


if __name__ == '__main__':
    unittest.main()
