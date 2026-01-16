CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS levels (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  title TEXT NOT NULL,
  level_order INTEGER NOT NULL,
  content_markdown TEXT,
  questions_json TEXT
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT NOT NULL REFERENCES users(id),
  level_id TEXT NOT NULL REFERENCES levels(id),
  status TEXT CHECK(status IN ('LOCKED', 'UNLOCKED', 'COMPLETED')) NOT NULL DEFAULT 'LOCKED',
  high_score INTEGER DEFAULT 0,
  unlocked_at DATETIME,
  completed_at DATETIME,
  PRIMARY KEY (user_id, level_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  level_id TEXT NOT NULL REFERENCES levels(id),
  score INTEGER,
  total_questions INTEGER,
  correct_count INTEGER,
  answers_log TEXT,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS battles (
  id TEXT PRIMARY KEY,
  subject_id TEXT REFERENCES subjects(id),
  level_id TEXT REFERENCES levels(id),
  player1_id TEXT NOT NULL REFERENCES users(id),
  player2_id TEXT REFERENCES users(id),
  player1_score INTEGER,
  player2_score INTEGER,
  winner_id TEXT,
  status TEXT CHECK(status IN ('active', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  battle_log TEXT
);
