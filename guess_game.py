#!/usr/bin/env python3
"""Number guessing game: guess the random number between 1 and 100."""

import random
import sys


def read_guess() -> int | None:
    """Read and validate a guess from the user."""
    raw = input("Enter your guess (1-100): ").strip()
    if not raw:
        print("Please enter a number.")
        return None
    try:
        value = int(raw)
    except ValueError:
        print("Invalid input. Please enter a whole number.")
        return None
    if value < 1 or value > 100:
        print("Your guess must be between 1 and 100.")
        return None
    return value


def play() -> None:
    target = random.randint(1, 100)
    guesses = 0

    print("I'm thinking of a number between 1 and 100.")
    print("Can you guess it?\n")

    while True:
        guess = read_guess()
        if guess is None:
            continue

        guesses += 1
        print(f"You guessed: {guess}")

        if guess < target:
            print("Too low! Try again.\n")
        elif guess > target:
            print("Too high! Try again.\n")
        else:
            print(f"\nCorrect! The number was {target}.")
            print(f"You got it in {guesses} guess{'es' if guesses != 1 else ''}.")
            break


def main() -> None:
    try:
        play()
    except (KeyboardInterrupt, EOFError):
        print("\nGame over. Goodbye!")
        sys.exit(0)


if __name__ == "__main__":
    main()
