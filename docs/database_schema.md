# Database Schema Design

This document defines the SQLite database schema for the Gamified Learning Platform. It is designed to be hackathon-friendly, minimizing complexity while supporting all MVP features and the API contract.

## 1. Tables Overview

### 1. `users`
**Purpose**: Stores authentication and profile details for students.
- **id** (`TEXT` PK): UUID v4.
- **username** (`TEXT`): Unique display name.
- **email** (`TEXT`): Unique email address.
- **password_hash** (`TEXT`): Hashed password (e.g., bcrypt).
- **created_at** (`DATETIME`): Account creation timestamp.

### 2. `subjects`
**Purpose**: Represents high-level learning categories (e.g., "Cyber Security").
- **id** (`TEXT` PK): UUID v4.
- **name** (`TEXT`): Name of the subject.
- **description** (`TEXT`): Brief description for the UI.

### 3. `levels`
**Purpose**: Ordered learning modules within a subject. Contains both learning content and quiz data.
- **id** (`TEXT` PK): UUID v4.
- **subject_id** (`TEXT` FK -> `subjects.id`): Parent subject.
- **title** (`TEXT`): Display title (e.g., "Phishing Basics").
- **level_order** (`INTEGER`): Sequencing order (1, 2, 3...).
- **content_markdown** (`TEXT`): The learning material in Markdown format.
- **questions_json** (`TEXT`): JSON array of quiz questions.
  - *Schema*: `[{ "id": "q1", "question": "...", "options": [...], "correctAnswer": "...", "explanation": "...", "topic": "...", "difficulty": "easy" }]`

### 4. `user_progress`
**Purpose**: Tracks unlock status and high scores for each user-level pair.
- **user_id** (`TEXT` FK -> `users.id`): The student.
- **level_id** (`TEXT` FK -> `levels.id`): The level.
- **status** (`TEXT`): 'LOCKED', 'UNLOCKED', 'COMPLETED'.
- **high_score** (`INTEGER`): Best score achieved in the quiz.
- **unlocked_at** (`DATETIME`): When the level became accessible.
- **completed_at** (`DATETIME`): When the level was first completed.
- **Primary Key**: (`user_id`, `level_id`)

### 5. `quiz_attempts`
**Purpose**: Logs every quiz attempt for history, analytics, and AI personalization.
- **id** (`TEXT` PK): UUID v4.
- **user_id** (`TEXT` FK -> `users.id`): The student.
- **level_id** (`TEXT` FK -> `levels.id`): The level attempted.
- **score** (`INTEGER`): Score achieved (0-100 or raw points).
- **total_questions** (`INTEGER`): Number of questions in the quiz.
- **correct_count** (`INTEGER`): Number of correct answers.
- **answers_log** (`TEXT`): JSON record of user's answers vs correct answers.
  - *Schema*: `[{ "questionId": "q1", "selected": "A", "correct": true, "topic": "phishing" }]`
- **completed_at** (`DATETIME`): Timestamp of completion.

### 6. `battles`
**Purpose**: Records 1-vs-1 (or 1-vs-AI) battle sessions.
- **id** (`TEXT` PK): UUID v4.
- **subject_id** (`TEXT` FK -> `subjects.id`): The context of the battle.
- **level_id** (`TEXT` FK -> `levels.id`): Specific level/topic (optional if battle is subject-wide).
- **player1_id** (`TEXT` FK -> `users.id`): Challenger.
- **player2_id** (`TEXT` FK -> `users.id`): Opponent (or NULL/system ID for AI).
- **player1_score** (`INTEGER`): Score of player 1.
- **player2_score** (`INTEGER`): Score of player 2.
- **winner_id** (`TEXT` FK -> `users.id`): ID of the winner (or 'DRAW').
- **status** (`TEXT`): 'active', 'completed'.
- **created_at** (`DATETIME`): Start time.
- **battle_log** (`TEXT`): JSON log of questions and turns for verification.

---

## 2. Seed Data Examples

### Users
| id | username | email |
|----|----------|-------|
| `u-1` | `student1` | `student1@example.com` |
| `u-2` | `student2` | `student2@example.com` |

### Subjects
| id | name |
|----|------|
| `s-1` | `Cyber Security Basics` |

### Levels (Sample)
| id | subject_id | title | level_order |
|----|------------|-------|-------------|
| `l-1` | `s-1` | `Phishing` | 1 |
| `l-2` | `s-1` | `Passwords` | 2 |
| `l-3` | `s-1` | `Firewalls` | 3 |
| `l-4` | `s-1` | `Encryption` | 4 |
| `l-5` | `s-1` | `Social Engineering` | 5 |

### User Progress (Student 1)
| user_id | level_id | status | high_score |
|---------|----------|--------|------------|
| `u-1` | `l-1` | `completed` | 90 |
| `u-1` | `l-2` | `unlocked` | 0 |

### Quiz Attempts
| id | user_id | level_id | score | answers_log |
|----|---------|----------|-------|-------------|
| `qa-1` | `u-1` | `l-1` | 90 | `[{"questionId":"q1", "correct":true}, ...]` |

### Battles
| id | player1_id | player2_id | winner_id | player1_score | player2_score |
|----|------------|------------|-----------|---------------|---------------|
| `b-1` | `u-1` | `u-2` | `u-1` | 120 | 100 |

---

## 3. Support for Personalization
This schema supports future AI features without needing structural changes:

1.  **Weak Topic Identification**: The `quiz_attempts` table stores a detailed `answers_log`. By querying this JSON data, we can aggregate incorrect answers by `topic` (stored in the question metadata) to identify weak areas.
2.  **Adaptive Difficulty**: The `user_progress` and `quiz_attempts` history allow the AI generation endpoint (`/api/ai/generate-question`) to fetch the user's current proficiency.
3.  **Content Recommendations**: By joining `user_progress` with `subjects`, we can recommend the next best locked level or remedial practice for failed quizzes.
