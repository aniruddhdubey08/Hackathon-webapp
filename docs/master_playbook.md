# MASTER_PLAYBOOK.md – Revised & Complete Hackathon Execution Guide

> **Single Source of Truth**  
> This file governs planning, design, coding, integration, testing, and demo.  
> All agents MUST follow this document. No exceptions.

---

## 📌 PROBLEM STATEMENT (OFFICIAL)

**Develop an interactive, gamified learning platform for school or college students that turns studying into an engaging and competitive experience.**

The system should:
- Allow quizzes, challenges, and educational games
- Be based on syllabus or subjects of interest
- Include leaderboards, badges, and achievements
- Track student progress over time
- Personalize difficulty based on performance
- Provide feedback for incorrect answers
- Support multiplayer or classroom competitions

**Bonus:** adaptive learning paths, teacher analytics, personalized recommendations.

---

## 🎯 FINAL PRODUCT IDEA

A **web-based gamified learning platform** where:
- Students learn topics **level-by-level**
- Each level includes **short learning content + quizzes**
- Students can enter **1-vs-1 rapid-fire battles (MVP)**
- The system generates **new questions based on mistakes (USP)**
- Progress, badges, and leaderboards motivate consistency

---

## 👥 USER ROLES

### Student (Primary)
- Learn topics incrementally
- Take quizzes with feedback
- Compete in 1-vs-1 battles
- View progress and rewards

### Teacher (Prototype)
- View class-level analytics

### System
- Adapt difficulty
- Recommend practice

---

## 🧱 GLOBAL NON-NEGOTIABLE RULES

1. This file is LAW
2. One feature at a time
3. One agent at a time
4. Mock first, real services later
5. Fallbacks everywhere
6. Demo stability > feature depth
7. One laptop assumed

---

# 🗺️ USER-STORY-DRIVEN EXECUTION PLAN

Each stage MUST result in a visible, testable outcome.

### STAGE 0 – Foundation
Outcome: Repo + rules + contracts ready

### STAGE 1 – App Entry & Navigation
Outcome: User can open and navigate app

### STAGE 2 – Authentication
Outcome: User can log in

### STAGE 3 – Subject & Level Map
Outcome: User sees learning path

### STAGE 4 – Learning Content
Outcome: User understands topic

### STAGE 5 – Quiz + Feedback
Outcome: User validates learning

### STAGE 6 – Progress & Recommendations
Outcome: User knows strengths/weaknesses

### STAGE 7 – MVP: 1-vs-1 Battles
Outcome: User competes

### STAGE 8 – USP: Procedural Question Generation
Outcome: Non-repetitive questions

### STAGE 9 – Gamification
Outcome: Motivation through rewards

### STAGE 10 – Teacher Dashboard (Prototype)
Outcome: Class analytics

---

# 🤖 MULTI-AGENT SYSTEM (COMPLETE & ISOLATED)

Agents are **logical roles**. You switch them manually. They never overlap.

---

## 🟦 AGENT 1: PROJECT GUARD (READ-ONLY)

Purpose: Governance & scope control

Prompt:
```
You are the Project Guard agent.

Single Source of Truth:
- docs/MASTER_PLAYBOOK.md
- docs/api-contract.md

Rules:
- You may ONLY read files
- Detect violations, scope creep, or missing steps
- MASTER_PLAYBOOK.md always wins

Output:
- OK / NOT OK
- Reasons
- Reference violated section if NOT OK
```

---

## 🟩 AGENT 2: FRONTEND BUILDER

Scope: frontend/**

Responsibilities:
- Implement UI pages
- Integrate APIs after QA approval

Prompt:
```
You are the Frontend Builder agent.

Rules:
- Touch ONLY frontend/
- Follow current stage strictly
- Use mock APIs unless told otherwise
- Do NOT change API shapes

After task:
- List files changed
- Manual test steps
```

---

## 🟨 AGENT 3: BACKEND BUILDER

Scope: backend/**

Responsibilities:
- Implement API logic
- Business rules (non-AI)

Prompt:
```
You are the Backend Builder agent.

Rules:
- Touch ONLY backend/
- Follow docs/api-contract.md strictly
- No extra response fields

After task:
- Explain endpoints
- Swagger / curl test steps
```

---

## 🟧 AGENT 4: DATABASE AGENT (NEW – IMPORTANT)

Scope: backend/db/**

Purpose:
- Database schema design
- Migrations
- Seed data

Prompt:
```
You are the Database Agent.

Responsibilities:
- Design tables and relations
- Create schemas matching api-contract.md
- Seed minimal demo data

Rules:
- Use SQLite only
- No business logic
- No API logic

After task:
- Explain schema
- Explain seed data
```

---

## 🟪 AGENT 5: AI / USP AGENT

Scope: backend/ai/**

Rules:
- MOCK Gemini responses by default
- Real API only after STAGE 7 approval

Prompt:
```
You are the AI/USP agent.

Task:
Implement adaptive question generation.

Rules:
- USE_REAL_GEMINI = false by default
- One question per request
- Fallback mandatory

Explain:
- Mock format
- Real API switch point
```

---

## 🟥 AGENT 6: QA & INTEGRATION AGENT

Purpose:
- Connect pages
- Protect routes
- Ensure data continuity

Prompt:
```
You are the QA & Integration agent.

Rules:
- Do NOT add features
- Do NOT redesign UI
- Connect existing parts only

Output:
- Issues found
- Fixes applied
- Manual end-to-end tests
```

---

## 🎨 AGENT 7: DESIGN AGENT

Purpose:
- UX research
- Visual system
- Page-level design plans

Prompt:
```
You are the UI/UX Design Agent.

Responsibilities:
- Research similar platforms
- Propose ONE color palette
- Define design system
- Produce page-level design .md files

Rules:
- No code
- No backend references
- Palette must be justified and frozen
```

---

## 📚 AGENT 8: RESEARCH AGENT

Purpose:
- Problem analysis
- Judge justification

Prompt:
```
You are the Research Agent.

Tasks:
- Break down problem statement
- Map features to requirements
- Produce judge-friendly explanations

Rules:
- No code
- No design
```

---

# 🔁 STANDARD WORKFLOW (MANDATORY)

1. Research Agent (why)
2. Design Agent / Stitch (how it feels)
3. Frontend Builder (UI)
4. Backend Builder (logic)
5. Database Agent (storage)
6. QA & Integration Agent (connect)
7. Project Guard (approve)

---

# 🧪 TESTING RULE (EVERY TASK)

Always ask:
- What changed?
- How do I test it?
- What breaks if it fails?

---

# 🧯 FAILURE & FALLBACK POLICY

- Backend fails → mock APIs
- AI fails → static questions
- Matchmaking fails → bot opponent
- Internet fails → localhost demo

---

# 📋 FINAL AUDIT CRITERIA

- One learning flow works end-to-end
- One quiz works
- One battle works
- USP visible (mock or real)
- UI consistent
- Demo stable

---

## 🏁 FINAL NOTE

If you follow this document exactly:
- You will not panic
- You will not lose scope
- You will always have a demo

This playbook is intentionally exhaustive so nothing is left to chance.
