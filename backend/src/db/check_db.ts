import { getDb } from './database';

async function checkDb() {
    const db = await getDb();

    console.log('--- Checking Database Content ---\n');

    const users = await db.all('SELECT * FROM users');
    console.log(`Users (Count: ${users.length}):`);
    console.table(users.map(u => ({ id: u.id, username: u.username, email: u.email })));

    const subjects = await db.all('SELECT * FROM subjects');
    console.log(`\nSubjects (Count: ${subjects.length}):`);
    console.table(subjects);

    const levels = await db.all('SELECT * FROM levels');
    console.log(`\nLevels (Count: ${levels.length}):`);
    console.table(levels.map(l => ({ id: l.id, subject_id: l.subject_id, title: l.title })));

    const progress = await db.all('SELECT * FROM user_progress');
    console.log(`\nUser Progress (Count: ${progress.length}):`);
    console.table(progress);

    console.log('\n--- Check Complete ---');
}

if (require.main === module) {
    checkDb().catch(console.error);
}
