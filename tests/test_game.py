"""Unit tests for the Game class"""

import unittest
from src.game import Game, GameState
from src.piece import PieceColor


class TestGame(unittest.TestCase):
    """Test cases for Game class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.game = Game()
    
    def test_game_creation(self):
        """Test creating a game"""
        self.assertIsNotNone(self.game.board)
        self.assertEqual(self.game.state, GameState.SETUP)
        self.assertEqual(self.game.turn_number, 1)
    
    def test_game_setup(self):
        """Test setting up a game"""
        self.game.setup_game("Alice", "Bob")
        
        self.assertEqual(self.game.state, GameState.IN_PROGRESS)
        self.assertIn(PieceColor.WHITE, self.game.players)
        self.assertIn(PieceColor.BLACK, self.game.players)
        self.assertEqual(self.game.players[PieceColor.WHITE].name, "Alice")
        self.assertEqual(self.game.players[PieceColor.BLACK].name, "Bob")
        self.assertEqual(self.game.current_player.color, PieceColor.WHITE)
    
    def test_make_valid_move(self):
        """Test making a valid move"""
        self.game.setup_game()
        
        # Move white pawn from e2 to e4
        result = self.game.make_move((6, 4), (4, 4))
        self.assertTrue(result)
        self.assertEqual(len(self.game.move_history), 1)
        self.assertEqual(self.game.current_player.color, PieceColor.BLACK)
    
    def test_make_invalid_move(self):
        """Test making an invalid move"""
        self.game.setup_game()
        
        # Try to move black piece on white's turn
        result = self.game.make_move((1, 4), (3, 4))
        self.assertFalse(result)
        self.assertEqual(len(self.game.move_history), 0)
    
    def test_turn_switching(self):
        """Test that turns switch correctly"""
        self.game.setup_game()
        
        self.assertEqual(self.game.current_player.color, PieceColor.WHITE)
        
        # White moves
        self.game.make_move((6, 4), (4, 4))
        self.assertEqual(self.game.current_player.color, PieceColor.BLACK)
        
        # Black moves
        self.game.make_move((1, 4), (3, 4))
        self.assertEqual(self.game.current_player.color, PieceColor.WHITE)
        self.assertEqual(self.game.turn_number, 2)
    
    def test_add_fantasy_element(self):
        """Test adding fantasy elements"""
        self.game.setup_game()
        
        # Add portal
        self.game.add_fantasy_element("portal", entry=(3, 3), exit=(5, 5))
        self.assertEqual(len(self.game.board.portals), 1)
        
        # Add special square
        self.game.add_fantasy_element("special_square", position=(4, 4), effect="power_boost")
        self.assertIn((4, 4), self.game.board.special_squares)
    
    def test_game_status(self):
        """Test getting game status"""
        self.game.setup_game("Player1", "Player2")
        status = self.game.get_game_status()
        self.assertIn("Player1", status)


if __name__ == '__main__':
    unittest.main()
