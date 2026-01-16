# Page Design: Target Acquisition (Battle Lobby)

## 1. UX Goal
**"Locking on Target"**
Building tension.

## 2. Sections
1.  **Radar Screen**: Central visual pulsating.
2.  **Operator Card**: Your loadout/stats.
3.  **Enemy Signal**: The opponent finding state.

## 3. Components
-   **VS Badge**: None. Replaced by a "VS" Crosshair overlay.
-   **Radar**:
    -   Scanning animation script. Green "ping" circles.
-   **Status Text**: "SCANNING FREQUENCIES..." (Blinking Orange).

## 4. Primary User Actions
1.  **Abort Scan**: "Red" text button at bottom.
2.  **Engage**: Automates when match found.

## 5. Feedback & Interaction
-   **Match Found**: "TARGET ACQUIRED". Siren sound. Screen turns Red alert state for 1 second, then transitions.

## 6. Color References
-   **Radar**: `Signal Green` (#10b981)
-   **Alert**: `Critical Red` (#ef4444)
