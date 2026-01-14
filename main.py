#!/usr/bin/env python3
"""
Fantasy Chess - Main Entry Point

A chess game with fantasy elements including portals, special abilities, and custom pieces.
"""

import sys
from src.game import Game
from src.piece import PieceColor


def print_menu():
    """Display the main menu"""
    print("\n" + "="*50)
    print("         FANTASY CHESS")
    print("="*50)
    print("\n1. New Game")
    print("2. Load Game")
    print("3. Instructions")
    print("4. Exit")
    print("\nEnter your choice: ", end="")


def print_instructions():
    """Display game instructions"""
    print("\n" + "="*50)
    print("         INSTRUCTIONS")
    print("="*50)
    print("""
Fantasy Chess is played like regular chess with exciting additions:

BASIC RULES:
- Standard chess rules apply for piece movement
- White moves first
- Capture opponent's king to win

FANTASY ELEMENTS:
- Portals: Step on a portal entry to teleport to its exit
- Special Squares: Some squares grant temporary abilities
- Special Abilities: Pieces may have unique powers

NOTATION:
- Squares are identified by column (a-h) and row (1-8)
- Example: e2e4 moves piece from e2 to e4

PIECE SYMBOLS:
- K: King    - Q: Queen   - R: Rook
- B: Bishop  - N: Knight  - P: Pawn
- Uppercase = White, Lowercase = Black

Press Enter to continue...
""")
    input()


def play_game():
    """Main game loop"""
    game = Game()
    
    # Get player names
    print("\nEnter player names:")
    player1 = input("White player: ").strip() or "White"
    player2 = input("Black player: ").strip() or "Black"
    
    # Setup the game
    game.setup_game(player1, player2)
    
    # Optional: Add fantasy elements
    print("\nAdd fantasy elements? (y/n): ", end="")
    if input().lower() == 'y':
        print("\nAdding sample portal from d4 to f6...")
        game.add_fantasy_element("portal", entry=(4, 3), exit=(2, 5))
        game.add_fantasy_element("special_square", position=(3, 3), effect="power_boost")
    
    # Main game loop
    while game.state not in ["checkmate", "stalemate", "draw"]:
        game.display_board()
        
        try:
            # Get move from current player
            print(f"\n{game.current_player.name}, enter your move (e.g., e2e4) or 'quit': ", end="")
            move_input = input().strip().lower()
            
            if move_input == 'quit':
                print("Game ended by player.")
                break
            
            if move_input == 'help':
                print_instructions()
                continue
            
            # Parse move input
            if len(move_input) != 4:
                print("Invalid move format. Use format like 'e2e4'")
                continue
            
            from_col = ord(move_input[0]) - ord('a')
            from_row = 8 - int(move_input[1])
            to_col = ord(move_input[2]) - ord('a')
            to_row = 8 - int(move_input[3])
            
            if not (0 <= from_col < 8 and 0 <= from_row < 8 and 
                   0 <= to_col < 8 and 0 <= to_row < 8):
                print("Invalid square. Use columns a-h and rows 1-8.")
                continue
            
            # Make the move
            if not game.make_move((from_row, from_col), (to_row, to_col)):
                print("Invalid move! Try again.")
                continue
            
        except (ValueError, IndexError) as e:
            print(f"Error: {e}. Please try again.")
            continue
        except KeyboardInterrupt:
            print("\n\nGame interrupted by user.")
            break
    
    # Game over
    game.display_board()
    print("\n" + "="*50)
    print(f"         GAME OVER")
    print("="*50)
    print(f"\n{game.get_game_status()}")


def main():
    """Main entry point"""
    print("\nWelcome to Fantasy Chess!")
    
    while True:
        print_menu()
        choice = input().strip()
        
        if choice == '1':
            play_game()
        elif choice == '2':
            print("\nGame loading not yet implemented.")
        elif choice == '3':
            print_instructions()
        elif choice == '4':
            print("\nThanks for playing Fantasy Chess!")
            sys.exit(0)
        else:
            print("\nInvalid choice. Please try again.")


if __name__ == "__main__":
    main()
