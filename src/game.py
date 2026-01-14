"""Main game controller for Fantasy Chess"""

from typing import Optional, List
from src.board import Board
from src.player import Player
from src.piece import PieceColor, PieceType
from src.move import Move


class GameState:
    """Enum-like class for game states"""
    SETUP = "setup"
    IN_PROGRESS = "in_progress"
    CHECK = "check"
    CHECKMATE = "checkmate"
    STALEMATE = "stalemate"
    DRAW = "draw"


class Game:
    """Main game controller"""
    
    def __init__(self):
        """Initialize a new game"""
        self.board = Board()
        self.players = {}
        self.current_player = None
        self.state = GameState.SETUP
        self.move_history = []
        self.turn_number = 1
        
    def setup_game(self, player1_name: str = "White", player2_name: str = "Black"):
        """
        Setup a new game with two players
        
        Args:
            player1_name: Name for white player
            player2_name: Name for black player
        """
        self.players[PieceColor.WHITE] = Player(player1_name, PieceColor.WHITE)
        self.players[PieceColor.BLACK] = Player(player2_name, PieceColor.BLACK)
        self.current_player = self.players[PieceColor.WHITE]
        
        # Setup the board
        self.board.setup_standard_board()
        self.state = GameState.IN_PROGRESS
    
    def make_move(self, from_pos: tuple, to_pos: tuple) -> bool:
        """
        Attempt to make a move
        
        Args:
            from_pos: Starting position (row, col)
            to_pos: Destination position (row, col)
            
        Returns:
            True if move was successful
        """
        if self.state not in [GameState.IN_PROGRESS, GameState.CHECK]:
            return False
        
        piece = self.board.get_piece(*from_pos)
        if not piece:
            return False
        
        if piece.color != self.current_player.color:
            return False
        
        # Check if destination has a piece (for capture)
        target_piece = self.board.get_piece(*to_pos)
        is_capture = target_piece is not None
        
        # Create and validate move
        move = Move(piece, from_pos, to_pos, is_capture=is_capture)
        
        if not move.is_valid(self.board):
            return False
        
        # Execute the move
        if move.execute(self.board):
            self.move_history.append(move)
            
            # Check game state after move
            self._update_game_state()
            
            # Switch players
            self._switch_player()
            
            return True
        
        return False
    
    def _switch_player(self):
        """Switch to the other player"""
        if self.current_player.color == PieceColor.WHITE:
            self.current_player = self.players[PieceColor.BLACK]
        else:
            self.current_player = self.players[PieceColor.WHITE]
            self.turn_number += 1
    
    def _update_game_state(self):
        """Update game state (check for check, checkmate, etc.)"""
        opponent_color = (PieceColor.BLACK if self.current_player.color == PieceColor.WHITE 
                         else PieceColor.WHITE)
        
        # Find opponent's king
        king = self.board.find_king(opponent_color)
        if not king:
            return
        
        # Check if king is under attack
        if self.board.is_under_attack(king.position, self.current_player.color):
            # Check if opponent has any valid moves
            if self._has_valid_moves(opponent_color):
                self.state = GameState.CHECK
            else:
                self.state = GameState.CHECKMATE
        else:
            # Check for stalemate
            if not self._has_valid_moves(opponent_color):
                self.state = GameState.STALEMATE
            else:
                self.state = GameState.IN_PROGRESS
    
    def _has_valid_moves(self, color: PieceColor) -> bool:
        """Check if a player has any valid moves"""
        pieces = self.board.get_all_pieces(color)
        for piece in pieces:
            moves = piece.get_possible_moves(self.board)
            if moves:
                return True
        return False
    
    def get_game_status(self) -> str:
        """Get current game status as string"""
        if self.state == GameState.CHECKMATE:
            winner = "White" if self.current_player.color == PieceColor.WHITE else "Black"
            return f"Checkmate! {winner} wins!"
        elif self.state == GameState.STALEMATE:
            return "Stalemate! Game is a draw."
        elif self.state == GameState.CHECK:
            return "Check!"
        elif self.state == GameState.DRAW:
            return "Game ended in a draw."
        else:
            return f"{self.current_player.name}'s turn"
    
    def display_board(self):
        """Display the current board state"""
        self.board.display()
        print(f"Turn {self.turn_number}: {self.get_game_status()}")
    
    def add_fantasy_element(self, element_type: str, **kwargs):
        """
        Add fantasy elements to the game
        
        Args:
            element_type: Type of fantasy element (portal, special_square, etc.)
            **kwargs: Additional parameters for the element
        """
        if element_type == "portal":
            entry = kwargs.get("entry")
            exit_pos = kwargs.get("exit")
            if entry and exit_pos:
                self.board.add_portal(entry, exit_pos)
        
        elif element_type == "special_square":
            position = kwargs.get("position")
            effect = kwargs.get("effect")
            if position and effect:
                self.board.add_special_square(position, effect)
    
    def save_game(self, filename: str):
        """Save game state to file"""
        # TODO: Implement game saving
        pass
    
    def load_game(self, filename: str):
        """Load game state from file"""
        # TODO: Implement game loading
        pass
    
    def __repr__(self):
        return f"Game(turn={self.turn_number}, state={self.state})"
