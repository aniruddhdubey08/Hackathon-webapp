# Design System v2: Cyber Command

## 1. Visual Philosophy
**"The Intellectual Frontier"**
The interface is a high-tech tactical dashboard. The user is an operator in a futuristic command center.

**Core Pillars:**
1.  **Dark Mode First**: Deep space backgrounds, void blacks, and slate grays.
2.  **Neon Accents**: High-contrast Cyan (#06b6d4) and Electric Purple (#8b5cf6) against dark backgrounds.
3.  **Glassmorphism**: Translucent panels with subtle borders and blurs.
4.  **Tactical Typography**: Monospace headers for data, clean sans-serif for readability.

---

## 2. Color Palette (Cyber Compliance)

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | **Void Black** | `#020617` | Main page background. Deepest layer. |
| **Surface** | **Command Slate** | `#0f172a` | Card backgrounds, panels. |
| **Primary** | **Neon Cyan** | `#06b6d4` | Primary actions, active states, "Systems Online". |
| **Secondary** | **Plasma Purple** | `#a855f7` | Secondary actions, "XP/Data" resource. |
| **Text Primary** | **Hologram White** | `#f8fafc` | High readability text. |
| **Text Muted** | **Terminal Gray** | `#94a3b8` | Subtitles, metadata. |
| **Success** | **Signal Green** | `#10b981` | "Operation Successful", Correct Answer. |
| **Error** | **Critical Red** | `#ef4444` | "System Failure", Wrong Answer. |
| **Border** | **Glass Edge** | `#1e293b` | Subtle borders on cards (1px). |

**Gradients:**
-   *Cyber Glow*: `linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)`

---

## 3. Typography
**Font Family**: `Inter` (Body) + `JetBrains Mono` or `Roboto Mono` (Headers/Data).

-   **Headings**: Monospace, Uppercase, Letter-spacing `0.05em`.
    -   *H1*: "MISSION BRIEFING"
-   **Body**: Clean sans-serif, high legibility.
-   **Data/Numbers**: Monospace.

---

## 4. Spacing & Components

**Card Style (The "Module"):**
-   Background: `Command Slate` (#0f172a) at 90% opacity.
-   Border: 1px solid `Glass Edge` (#1e293b).
-   Shadow: `0 0 10px rgba(6, 182, 212, 0.1)` (Subtle Cyan Glow).
-   Corner Radius: 4px or 8px (Sharper, more industrial).

**Buttons:**
-   *Primary Protocol*: Solid Cyan gradient background, Black text (Bold). "GLOW" on hover.
-   *Tactical Outline*: Transparent background, Cyan border, Cyan text.
-   *Shape*: Cut corners (chamfered) or slightly rounded (2px).

**Decorations:**
-   **Scanlines**: Subtle horizontal lines overlay (optional).
-   **Grid**: Faint background grid pattern.
-   **Tech Markers**: Small corner brackets `[ ]` or `+` signs in corners of cards.

---

## 5. Interaction Principles
-   **Hover**: Elements "light up" (increase brightness/glow).
-   **Click**: Immediate mechanical response.
-   **Transitions**: Fast, snappy (0.2s). No "bouncy" springs to emphasize machine precision.
