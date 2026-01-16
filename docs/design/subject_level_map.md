# Page Design: Subject Level Map

## 1. UX Goal
**" The Adventure Path"**
Visualize the curriculum as a journey. The user should feel the urge to "unlock" the next node.

## 2. Sections
1.  **Header**: Back button, Subject Title, Total Stars/XP in this subject.
2.  **Scrollable Map**: The core interaction area.
3.  **Floating Action Button (FAB)**: Rapid "Practice" or "Battle" entry.

## 3. Components
-   **Map Node**:
    -   *Circle*: 64px.
    -   *State - Locked*: Grey, Padlock icon.
    -   *State - Active*: `Electric Violet` Pulse animation. Bounce effect.
    -   *State - Completed*: `Success Fern`, Gold Crown or 3 Stars above it.
-   **Path Line**:
    -   Connects nodes.
    -   Becomes colored (`Electric Violet`) when the previous node is done.
-   **Checkpoint Chest**:
    -   Every 5 levels, a bigger box node. Unlocks bonus XP.

## 4. Primary User Actions
1.  **Start Level**: Tap the big pulsing active node.
2.  **Review Level**: Tap a completed node to re-practice.

## 5. Feedback & Interaction
-   **Scroll**: The map should start scrolled to the user's current active level (bottom-to-top progression often feels better for climbing).
-   **Unlock Animation**: When a level is beaten, the path fills to the next node, and the lock unlocks (Sound: Click-Clack).

## 6. Color References
-   **Active Node**: `Electric Violet` (#6366F1)
-   **Locked Node**: `Stone Gray` (#64748B) opacity 0.3.
-   **Path**: `Electric Violet` (Active) / `Stone Gray` (Inactive).
