# Design System & UX Principles

## 1. Research Insights & UX Philosophy
Based on the analysis of Codédex, Duolingo, Kahoot, Chess.com, and LeetCode, we prioritize **Clarity, Progression, and Low-Stress Competition**.

-   **Codédex**: 8-bit/retro charm reduces "scary" factor of coding. *Principle: Make learning feel like a game world.*
-   **Duolingo**: Immediate feedback and streak mechanics. *Principle: Visual progress is mandatory (bars, paths, flames).*
-   **Kahoot**: Big buttons, simple shapes. *Principle: Low cognitive load interfaces for high-energy moments.*
-   **Chess.com**: Clean functional board, distinct player states. *Principle: Clarity in competitive states.*
-   **LeetCode**: Minimalist problem focus. *Principle: Distraction-free learning zones.*

**Core Pillars:**
1.  **Clarity over Flash**: No decorative noise. Every element serves an action.
2.  **Motivation through Progression**: Always show "Where I am" and "Where I'm going".
3.  **Competition without Stress**: Celebrate winners, encourage learners. No "shame" for losing.

---

## 2. Color Palette (Strict)
This palette is designed to be **vibrant yet focused**. It minimizes eye strain (avoiding pure #000/#FFF) and uses color to denote state clearly.

| Role | Color Name | Hex Code | Justification |
| :--- | :--- | :--- | :--- |
| **Primary** | **Electric Violet** | `#6366F1` | Energetic, modern feel. Used for primary CTAs and active states. Represents "Magic/Digital" learning. |
| **Secondary** | **Success Fern** | `#22C55E` | Distinct from standard "tech green". Biophilic and calming. Used for correct answers and completion. |
| **Accent** | **Spark Orange** | `#F59E0B` | Warm and urgent but not alarming. Used for Streaks, XP, and "Hot" items. |
| **Background** | **Cloud Mist** | `#F8FAFC` | Low-contrast off-white. Reduces glare compared to pure white. |
| **Surface** | **Card White** | `#FFFFFF` | For cards and modal layers. Creates depth against Cloud Mist. |
| **Text Primary**| **Ink Slate** | `#1E293B` | High reliability. Softer than pure black for long reading sessions. |
| **Text Muted** | **Stone Gray** | `#64748B` | For secondary labels and hints. |
| **Error** | **Soft Rose** | `#F43F5E` | Noticeable but not aggressive. "Try again" rather than "FAILURE". |

**Usage Rules:**
-   **60-30-10 Rule**: 60% Background/Surface, 30% Text, 10% Accents (Primary/Secondary).
-   NEVER use gradients for text (legibility).
-   Gradients allowed ONLY on Primary Action Buttons and Hero Cards.

---

## 3. Typography
**Font Family**: `Inter` or `Nunito` (Rounded sans-serif).
*Why? High readability on screens, rounded edges feel friendlier and less "academic".*

-   **Headings (H1-H3)**: Bold, tight letter spacing. used for impact.
-   **Body**: Regular weight, 1.5 line height for readability.
-   **Labels/Buttons**: Semi-Bold or Bold, often Uppercase for short actions.

**Hierarchy:**
-   **Level 1**: Page Titles (24px+)
-   **Level 2**: Section Headers / Card Titles (20px)
-   **Level 3**: Body Text / Questions (16px)
-   **Level 4**: Captions / Metadata (14px - Muted)

---

## 4. Spacing & Layout
**Grid System**: 8px (0.5rem) base unit.
-   Margins: 16px (Mobile), 32px (Desktop).
-   Card Padding: 16px or 24px.
-   Gap: 8px, 16px, 32px.

**Container Philosophy**:
-   **Cards**: All content lives in "Cards" (White surface, border-radius 12px or 16px, subtle shadow).
-   **Focus Mode**: In learning/quiz pages, hide navigation. Center the content.

---

## 5. Interaction & Feedback
-   **Buttons**:
    -   *Primary*: Solid Violet, 100% width on mobile. High elevation on hover.
    -   *Secondary*: Outline or Ghost.
-   **Feedback components**:
    -   *Success*: Pop-in animation, Green border glow, Sound effect (optional).
    -   *Error*: Shake animation, Red border glow, "Don't worry, try again" text.
-   **Micro-interactions**:
    -   Hovers: Lift up 2px.
    -   Clicks: Scale down 0.98.
    -   Progress Bars: Fill animation must be smooth (>300ms).
