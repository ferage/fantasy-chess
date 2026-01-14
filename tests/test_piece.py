"""Unit tests for the Piece class"""

import unittest
from src.piece import Piece, PieceColor, PieceType
from src.board import Board


class TestPiece(unittest.TestCase):
    """Test cases for Piece class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.board = Board()
        self.board.setup_standard_board()
    
    def test_piece_creation(self):
        """Test creating a piece"""
        piece = Piece(PieceColor.WHITE, PieceType.PAWN, (6, 0))
        self.assertEqual(piece.color, PieceColor.WHITE)
        self.assertEqual(piece.piece_type, PieceType.PAWN)
        self.assertEqual(piece.position, (6, 0))
        self.assertFalse(piece.has_moved)
    
    def test_pawn_moves(self):
        """Test pawn movement"""
        pawn = self.board.get_piece(6, 0)
        moves = pawn.get_possible_moves(self.board)
        
        # Pawn should be able to move 1 or 2 squares forward from start
        self.assertIn((5, 0), moves)
        self.assertIn((4, 0), moves)
    
    def test_knight_moves(self):
        """Test knight movement"""
        knight = self.board.get_piece(7, 1)
        moves = knight.get_possible_moves(self.board)
        
        # Knight should be able to move in L-shape
        self.assertIn((5, 0), moves)
        self.assertIn((5, 2), moves)
    
    def test_piece_move(self):
        """Test moving a piece"""
        piece = self.board.get_piece(6, 4)
        original_pos = piece.position
        
        piece.move_to((4, 4))
        self.assertEqual(piece.position, (4, 4))
        self.assertTrue(piece.has_moved)
        self.assertNotEqual(piece.position, original_pos)
    
    def test_piece_representation(self):
        """Test piece string representation"""
        white_king = Piece(PieceColor.WHITE, PieceType.KING, (0, 0))
        self.assertEqual(str(white_king), "WK")
        
        black_queen = Piece(PieceColor.BLACK, PieceType.QUEEN, (0, 0))
        self.assertEqual(str(black_queen), "BQ")


if __name__ == '__main__':
    unittest.main()
