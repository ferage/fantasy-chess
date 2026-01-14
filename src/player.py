"""Player class for managing player state and actions"""

from typing import Optional
from src.piece import PieceColor


class Player:
    """Represents a player in the game"""
    
    def __init__(self, name: str, color: PieceColor):
        """
        Initialize a player
        
        Args:
            name: Player's name
            color: Player's piece color (WHITE or BLACK)
        """
        self.name = name
        self.color = color
        self.score = 0
        self.time_remaining = None
        self.special_abilities_available = []
        
    def add_score(self, points: int):
        """Add points to player's score"""
        self.score += points
    
    def use_special_ability(self, ability_name: str) -> bool:
        """
        Use a special ability if available
        
        Args:
            ability_name: Name of the ability to use
            
        Returns:
            True if ability was used successfully
        """
        if ability_name in self.special_abilities_available:
            self.special_abilities_available.remove(ability_name)
            return True
        return False
    
    def grant_special_ability(self, ability_name: str):
        """Grant a special ability to the player"""
        if ability_name not in self.special_abilities_available:
            self.special_abilities_available.append(ability_name)
    
    def set_time_control(self, seconds: int):
        """Set time control for the player"""
        self.time_remaining = seconds
    
    def update_time(self, seconds_elapsed: int):
        """Update remaining time"""
        if self.time_remaining is not None:
            self.time_remaining -= seconds_elapsed
    
    def __repr__(self):
        return f"Player({self.name}, {self.color.value}, score={self.score})"
