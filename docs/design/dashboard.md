# Page Design: Command Center (Dashboard)

## 1. UX Goal
**"Operational Awareness"**
Everything is a data stream. The user feels like a commander overseeing their progress.

## 2. Sections
1.  **Top HUD**: Rank, XP, Credits (Cryptocurrency style UI).
2.  **Mission Log**: "Daily Objectives".
3.  **Active Modules**: Subject list.
4.  **Mini-Map**: Rapid access to the Subject Map.

## 3. Components
-   **HUD Bar**:
    -   Fixed top. Glassmorphism.
    -   *Rank*: "CADET [Level 4]". Monospace.
    -   *Streak*: "SYSTEM UPTIME: 5 DAYS".
-   **Active Module Card** (Subject):
    -   *Header*: "PHYSICS [MODULE A]".
    -   *Progress*: Thin Cyan line.
    -   *Button*: "RESUME UPLINK".
-   **Mission Log**:
    -   List of checkbox items.
    -   Checked = Green "COMPLETED" stamp.

## 4. Primary User Actions
1.  **Resume Uplink**: Continue active subject.
2.  **Scan Network**: Go to Subject Map.

## 5. Feedback & Interaction
-   **Hover on Card**: Corner brackets `[ ]` expand outwards.
-   **Numbers**: "Count up" animation on load.

## 6. Color References
-   **Progress**: `Neon Cyan` (#06b6d4)
-   **Text**: `Hologram White` (#f8fafc)
