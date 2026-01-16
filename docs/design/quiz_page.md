# Page Design: Quiz Page

## 1. UX Goal
**"Flow State"**
Answer questions rapidly. Instant validation. No waiting.

## 2. Sections
1.  **Progress Header**: "Question 3 of 5". Life/Hearts counter (optional).
2.  **Question Area**: Big text.
3.  **Options Area**: Stacked buttons.
4.  **Feedback Sheet**: Slides up from bottom after answer.

## 3. Components
-   **Question Text**: H3, Centered.
-   **Option Button**:
    -   Large hit area (min-height 50px).
    -   Default: White background, Gray border.
    -   Hover: Light Violet background.
    -   *Selected*: Thick Violet border.
-   **Check Button**: "Check" (`Electric Violet`). Becomes "Continue" after checking.

## 4. Primary User Actions
1.  **Select Option**: Taps an answer (visual state change).
2.  **Submit**: Taps "Check".
3.  **Advance**: Taps "Continue".

## 5. Feedback & Interaction
-   **Correct Answer**:
    -   Option turns `Success Fern` background.
    -   Bottom sheet slides up: "Nice job!" (Green).
    -   Sound: Happy chime.
-   **Wrong Answer**:
    -   Option turns `Soft Rose` background.
    -   Bottom sheet slides up: "Correct answer is..." (Red).
    -   Sound: Soft thud.

## 6. Color References
-   **Correct**: `Success Fern` (#22C55E)
-   **Wrong**: `Soft Rose` (#F43F5E)
-   **Selected**: `Electric Violet` (#6366F1)
