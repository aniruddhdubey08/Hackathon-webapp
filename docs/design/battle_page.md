# Page Design: Battle Page

## 1. UX Goal
**"Adrenaline"**
High stakes, high speed. Clear visibility of "Who is winning?".

## 2. Sections
1.  **Header**: Timer + Score vs Score.
2.  **tug-of-War Bar**: Visual representation of the lead.
3.  **Question Area**: Similar to Quiz Page but more compact.
4.  **Power-up Bar** (Bonus): Freeze, Skip.

## 3. Components
-   **Tug-of-War Bar**:
    -   Full width bar at top.
    -   Split 50/50 initially.
    -   Pushes Left/Right based on correct speed.
    -   Colors: You (`Success Fern`) vs Enemy (`Soft Rose`).
-   **Timer**: Large, counting down. Colors Red when < 5s.

## 4. Primary User Actions
1.  **Answer**: Tap options (Rapid fire).
2.  **Use Power-up**: Tap icon.

## 5. Feedback & Interaction
-   **Correct/Wrong**: Faster feedback than standard quiz. No logic explanation sheet, just "Right/Wrong" flash to save time.
-   **Enemy Action**: When enemy answers correct, screen shakes slightly or bar pushes against you. "Opponent scored!" toast.

## 6. Color References
-   **My Score**: `Success Fern` (#22C55E)
-   **Enemy Score**: `Soft Rose` (#F43F5E)
-   **Timer**: `Ink Slate` -> `Spark Orange` -> `Soft Rose`.
