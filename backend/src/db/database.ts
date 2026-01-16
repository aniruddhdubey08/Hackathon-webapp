import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
    if (dbInstance) {
        return dbInstance;
    }

    const dbPath = path.resolve(__dirname, '../../database.sqlite');

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    return dbInstance;
}

export async function initDb() {
    const db = await getDb();

    const schemaPath = path.resolve(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    await db.exec(schemaSql);
    console.log('Database initialized successfully.');
}
