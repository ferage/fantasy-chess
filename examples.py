#!/usr/bin/env python3
"""
Example: Using Fantasy Chess programmatically

This example demonstrates how to use the Fantasy Chess library
to create custom games and scenarios.
"""

from src.game import Game
from src.piece import PieceColor

def example_basic_game():
    """Example: Basic game setup and moves"""
    print("=== Example 1: Basic Game ===\n")
    
    # Create and setup a new game
    game = Game()
    game.setup_game("Alice", "Bob")
    
    # Display initial board
    game.display_board()
    
    # Make some moves
    moves = [
        ((6, 4), (4, 4)),  # e2e4 - white pawn
        ((1, 4), (3, 4)),  # e7e5 - black pawn
        ((7, 6), (5, 5)),  # g1f3 - white knight
        ((0, 1), (2, 2)),  # b8c6 - black knight
    ]
    
    for from_pos, to_pos in moves:
        if game.make_move(from_pos, to_pos):
            print(f"\nMove successful: {from_pos} -> {to_pos}")
            game.display_board()
        else:
            print(f"\nMove failed: {from_pos} -> {to_pos}")
    
    print(f"Game status: {game.get_game_status()}")
    print(f"Moves made: {len(game.move_history)}")


def example_fantasy_game():
    """Example: Game with fantasy elements"""
    print("\n=== Example 2: Fantasy Game with Portals ===\n")
    
    # Create a game with fantasy elements
    game = Game()
    game.setup_game("Wizard", "Warrior")
    
    # Add a portal
    print("Adding portal from d4 to f6...")
    game.add_fantasy_element("portal", entry=(4, 3), exit=(2, 5))
    
    # Add special squares
    print("Adding power boost square at e4...")
    game.add_fantasy_element("special_square", position=(4, 4), effect="power_boost")
    
    print("Adding freeze square at d5...")
    game.add_fantasy_element("special_square", position=(3, 3), effect="freeze")
    
    # Display board
    game.display_board()
    
    # Show portals and special squares
    print(f"\nPortals: {len(game.board.portals)}")
    for i, portal in enumerate(game.board.portals, 1):
        print(f"  Portal {i}: {portal['entry']} -> {portal['exit']}")
    
    print(f"\nSpecial Squares: {len(game.board.special_squares)}")
    for pos, effect in game.board.special_squares.items():
        print(f"  {pos}: {effect}")


def example_custom_scenario():
    """Example: Custom board setup"""
    print("\n=== Example 3: Custom Scenario ===\n")
    
    from src.board import Board
    from src.piece import Piece, PieceType, PieceColor
    
    # Create custom board
    board = Board()
    
    # Place specific pieces for endgame scenario
    board.set_piece(7, 4, Piece(PieceColor.WHITE, PieceType.KING, (7, 4)))
    board.set_piece(7, 3, Piece(PieceColor.WHITE, PieceType.QUEEN, (7, 3)))
    board.set_piece(7, 0, Piece(PieceColor.WHITE, PieceType.ROOK, (7, 0)))
    
    board.set_piece(0, 4, Piece(PieceColor.BLACK, PieceType.KING, (0, 4)))
    board.set_piece(1, 3, Piece(PieceColor.BLACK, PieceType.PAWN, (1, 3)))
    
    print("Custom endgame scenario:")
    board.display()
    
    # Check piece positions
    white_king = board.find_king(PieceColor.WHITE)
    black_king = board.find_king(PieceColor.BLACK)
    
    print(f"White King at: {white_king.position}")
    print(f"Black King at: {black_king.position}")
    
    # Count pieces
    white_pieces = board.get_all_pieces(PieceColor.WHITE)
    black_pieces = board.get_all_pieces(PieceColor.BLACK)
    
    print(f"\nWhite pieces: {len(white_pieces)}")
    print(f"Black pieces: {len(black_pieces)}")


def example_move_validation():
    """Example: Move validation and piece movement"""
    print("\n=== Example 4: Move Validation ===\n")
    
    from src.board import Board
    from src.piece import Piece, PieceType, PieceColor
    
    board = Board()
    board.setup_standard_board()
    
    # Test pawn moves
    pawn = board.get_piece(6, 4)  # e2 white pawn
    possible_moves = pawn.get_possible_moves(board)
    
    print(f"White pawn at {pawn.position} can move to:")
    for move in possible_moves:
        row, col = move
        square = f"{chr(97 + col)}{8 - row}"
        print(f"  - {square} {move}")
    
    # Test knight moves
    knight = board.get_piece(7, 1)  # b1 white knight
    possible_moves = knight.get_possible_moves(board)
    
    print(f"\nWhite knight at {knight.position} can move to:")
    for move in possible_moves:
        row, col = move
        square = f"{chr(97 + col)}{8 - row}"
        print(f"  - {square} {move}")


def example_game_statistics():
    """Example: Game statistics and tracking"""
    print("\n=== Example 5: Game Statistics ===\n")
    
    game = Game()
    game.setup_game("Player 1", "Player 2")
    
    # Simulate some moves
    game.make_move((6, 4), (4, 4))  # e2e4
    game.make_move((1, 4), (3, 4))  # e7e5
    game.make_move((6, 3), (4, 3))  # d2d4
    game.make_move((3, 4), (4, 3))  # e5xd4 (capture)
    
    print(f"Turn number: {game.turn_number}")
    print(f"Current player: {game.current_player.name}")
    print(f"Total moves: {len(game.move_history)}")
    
    # Show captured pieces
    print("\nCaptured pieces:")
    for color, pieces in game.board.captured_pieces.items():
        if pieces:
            print(f"  {color.value}: {len(pieces)} pieces")
            for piece in pieces:
                print(f"    - {piece.piece_type.value}")
    
    # Show move history
    print("\nMove history:")
    for i, move in enumerate(game.move_history, 1):
        print(f"  {i}. {move.to_algebraic()}")


def main():
    """Run all examples"""
    print("Fantasy Chess - Code Examples\n")
    print("These examples demonstrate how to use the Fantasy Chess library.\n")
    
    examples = [
        example_basic_game,
        example_fantasy_game,
        example_custom_scenario,
        example_move_validation,
        example_game_statistics,
    ]
    
    for example in examples:
        try:
            example()
            print("\n" + "="*60 + "\n")
        except Exception as e:
            print(f"Error in {example.__name__}: {e}")
            import traceback
            traceback.print_exc()
    
    print("Examples completed!")


if __name__ == "__main__":
    main()
