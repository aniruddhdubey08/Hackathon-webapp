# Page Design: Student Dashboard

## 1. UX Goal
**"Your Command Center"**
Show progress instantly and guide the user to their next learning action. "What should I do next?" should be answered in <1s.

## 2. Sections
1.  **Header**: Profile + Streak + Currency.
2.  **Daily Goal / Streak**: High visibility progress.
3.  **Subject Carousel**: Main entry point to learning.
4.  **Battle Arena Entry**: Secondary entry point.

## 3. Components
-   **Header Bar**:
    -   *Surface*: `Card White`, Sticky top.
    -   *Streak Icon*: Fire emoji + Number in `Spark Orange`.
    -   *Avatar*: Circle with border `Electric Violet`.
-   **"Up Next" Card**:
    -   Large Card at top.
    -   "Continue Physics: Newton's Laws".
    -   *Progress Bar*: `Success Fern` filled 40%.
    -   *Button*: "Resume" (`Electric Violet`).
-   **Subject Cards (Grid)**:
    -   Icon + Subject Name.
    -   "Level 3".
    -   Simple visual indicates mastery (Stars).

## 4. Primary User Actions
1.  **Resume Learning**: Click big top card.
2.  **Choose Subject**: Click subject card to go to Map.
3.  **Check Leaderboard**: Tab navigation or link.

## 5. Feedback & Interaction
-   **Streak**: Tooltip on hover explaining how to keep it.
-   **Card Hover**: Lift effect + subtle shadow increase.
-   **Progress**: Animate bars from 0 to current value on load.

## 6. Color References
-   **Streak**: `Spark Orange` (#F59E0B)
-   **Primary Action**: `Electric Violet` (#6366F1)
-   **Completion/Good**: `Success Fern` (#22C55E)
