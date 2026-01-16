import { getDb } from './database';

export async function seedDb() {
    const db = await getDb();

    console.log('Seeding database...');

    // Users
    await db.run(`INSERT OR IGNORE INTO users (id, username, email, password_hash) VALUES 
    ('u-1', 'student1', 'student1@example.com', 'password123'),
    ('u-2', 'student2', 'student2@example.com', 'password123')
  `);

    // Subjects
    await db.run(`INSERT OR IGNORE INTO subjects (id, name, description) VALUES 
    ('s-1', 'Cyber Security Basics', 'Learn the fundamentals of cyber security.')
  `);

    // Levels
    // We need to provide dummy content and questions
    const questions = JSON.stringify([
        {
            id: "q1",
            question: "What is phishing?",
            options: ["Fishing for compliments", " fraudulent attempt to obtain sensitive information", "A type of firewall", "Network protocol"],
            correctAnswer: " fraudulent attempt to obtain sensitive information",
            explanation: "Phishing is a social engineering attack.",
            topic: "phishing",
            difficulty: "easy"
        }
    ]);

    const content = "# Phishing\n\nPhishing is a cyber crime...";

    await db.run(`INSERT OR IGNORE INTO levels (id, subject_id, title, level_order, content_markdown, questions_json) VALUES 
    ('l-1', 's-1', 'Phishing', 1, ?, ?),
    ('l-2', 's-1', 'Passwords', 2, ?, ?),
    ('l-3', 's-1', 'Firewalls', 3, ?, ?),
    ('l-4', 's-1', 'Encryption', 4, ?, ?),
    ('l-5', 's-1', 'Social Engineering', 5, ?, ?)
  `, [
        content, questions,
        content, questions,
        content, questions,
        content, questions,
        content, questions
    ]);

    // User Progress
    await db.run(`INSERT OR IGNORE INTO user_progress (user_id, level_id, status, high_score) VALUES 
    ('u-1', 'l-1', 'COMPLETED', 90),
    ('u-1', 'l-2', 'UNLOCKED', 0)
  `);

    console.log('Seeding complete.');
}

if (require.main === module) {
    seedDb().catch(console.error);
}
