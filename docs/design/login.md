# Page Design: Login / Signup

## 1. UX Goal
**"Frictionless Entry"**
Reduce drop-off. Allow users to enter with minimal effort.

## 2. Sections
1.  **Centered Card**: The main interaction area.
2.  **Background**: Simple pattern or solid color to keep focus on the card.

## 3. Components
-   **Auth Card**:
    -   *Surface*: `Card White`, Shadow-lg.
    -   *Tabs*: "Login" vs "Signup" (Segmented Control style).
    -   *Input Fields*:
        -   Border: 1px solid `Stone Gray` (Light). Focus: `Electric Violet`.
        -   Label: Small, Uppercase `Stone Gray`.
    -   *Submit Button*: Full width `Electric Violet`. "Let's Go!".
    -   *Social Auth*: "Continue with Google" (Outline Button, `Ink Slate` text).

## 4. Primary User Actions
1.  **Switch Mode**: Toggle between Login/Signup.
2.  **Submit Form**: Validate and enter Dashboard.
3.  **Forgot Password**: Text link `Element Violet`.

## 5. Feedback & Interaction
-   **Input Focus**: Border changes to `Electric Violet` (#6366F1).
-   **Error State**: Shake card, Turn border `Soft Rose` (#F43F5E), show text below input.
-   **Success**: Button turns `Success Fern` (#22C55E) and says "Success!", then redirects.

## 6. Color References
-   **Card**: `Card White` (#FFFFFF)
-   **Active Border**: `Electric Violet` (#6366F1)
-   **Error**: `Soft Rose` (#F43F5E)
