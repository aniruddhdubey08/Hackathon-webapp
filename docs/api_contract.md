# API Contract – Gamified Learning Platform

> **Status:** Frozen after approval by Project Guard  
> **Source of Truth:** MASTER_PLAYBOOK.md  
> This file defines the **exact API shape**. Frontend and Backend must follow this strictly.

---

## 🔐 Authentication APIs

### POST /api/auth/signup
Create a new student account.

**Request**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (201)**
```json
{
  "user": {
    "id": "string",
    "username": "string"
  },
  "token": "string"
}
```

---

### POST /api/auth/login
Authenticate existing user.

**Request**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200)**
```json
{
  "user": {
    "id": "string",
    "username": "string"
  },
  "token": "string"
}
```

---

## 📚 Subjects & Levels

### GET /api/subjects
Fetch all subjects.

**Response (200)**
```json
[
  {
    "id": "string",
    "name": "string"
  }
]
```

---

### GET /api/subjects/{subjectId}/levels
Fetch levels for a subject.

**Response (200)**
```json
[
  {
    "id": "string",
    "title": "string",
    "order": 1,
    "isLocked": false
  }
]
```

---

## 📖 Learning Content

### GET /api/levels/{levelId}/content
Fetch learning material for a level.

**Response (200)**
```json
{
  "levelId": "string",
  "content": "string"
}
```

---

## 📝 Quiz Engine

### GET /api/levels/{levelId}/quiz
Fetch quiz questions.

**Response (200)**
```json
{
  "levelId": "string",
  "questions": [
    {
      "id": "string",
      "question": "string",
      "options": ["string", "string", "string", "string"]
    }
  ]
}
```

---

### POST /api/levels/{levelId}/quiz/submit
Submit quiz answers.

**Request**
```json
{
  "answers": [
    {
      "questionId": "string",
      "selectedOption": "string"
    }
  ]
}
```

**Response (200)**
```json
{
  "score": 80,
  "correctCount": 4,
  "totalQuestions": 5,
  "feedback": [
    {
      "questionId": "string",
      "isCorrect": false,
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}
```

---

## 📊 Progress Tracking

### GET /api/progress
Fetch student progress.

**Response (200)**
```json
{
  "completedLevels": ["string"],
  "accuracy": 0.75,
  "weakTopics": ["string"]
}
```

---

## ⚔️ 1-vs-1 Battle (MVP)

### POST /api/battles/start
Start a battle session.

**Request**
```json
{
  "subjectId": "string",
  "levelId": "string"
}
```

**Response (200)**
```json
{
  "battleId": "string",
  "opponent": {
    "id": "string",
    "name": "AI Bot"
  }
}
```

---

### GET /api/battles/{battleId}/question
Fetch next battle question.

**Response (200)**
```json
{
  "questionId": "string",
  "question": "string",
  "options": ["string", "string", "string", "string"]
}
```

---

### POST /api/battles/{battleId}/answer
Submit battle answer.

**Request**
```json
{
  "questionId": "string",
  "selectedOption": "string"
}
```

**Response (200)**
```json
{
  "isCorrect": true,
  "currentScore": 120
}
```

---

### GET /api/battles/{battleId}/result
Get battle result.

**Response (200)**
```json
{
  "winner": "user",
  "finalScore": {
    "user": 120,
    "opponent": 90
  }
}
```

---

## 🤖 AI / USP (Procedural Questions)

### POST /api/ai/generate-question
Generate a new adaptive question.

**Request**
```json
{
  "topic": "string",
  "difficulty": "easy | medium | hard",
  "mistakes": ["string"]
}
```

**Response (200)**
```json
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctAnswer": "string",
  "explanation": "string",
  "source": "mock | gemini"
}
```

---

## ⚠️ Global Rules

- No endpoint returns extra fields
- No response shape changes without Guard approval
- Mock AI is default until enabled
- All errors return HTTP status codes

---

## ✅ Approval

- Created by: Backend Builder Agent
- Reviewed by: Project Guard Agent
- Status: Approved

