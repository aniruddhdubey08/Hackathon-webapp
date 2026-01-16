import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';

const router = Router();

// GET /api/subjects/:subjectId/map?userId=...
router.get('/:subjectId/map', async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId query parameter is required' });
    }

    try {
        const db = await getDb();

        // 1. Get Subject
        const subject = await db.get('SELECT * FROM subjects WHERE id = ?', [subjectId]);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }

        // 2. Get Levels
        const levels = await db.all('SELECT * FROM levels WHERE subject_id = ? ORDER BY level_order ASC', [subjectId]);

        // 3. Get User Progress
        const progress = await db.all('SELECT * FROM user_progress WHERE user_id = ?', [userId]);

        // 4. Merge
        const levelsWithStatus = levels.map(level => {
            const p = progress.find((p: any) => p.level_id === level.id);
            return {
                id: level.id,
                title: level.title,
                level_order: level.level_order,
                status: p ? p.status : 'LOCKED', // Default to LOCKED if no progress record
                high_score: p ? p.high_score : 0,
                unlocked_at: p ? p.unlocked_at : null,
                completed_at: p ? p.completed_at : null
            };
        });

        // If the first level is locked (no progress), we should probably unlock it or let it be.
        // However, the seed data sets level 1 to COMPLETED usually or the system logic handles unlocking.
        // For this API, we just return what is in DB.

        return res.json({
            subject: {
                id: subject.id,
                name: subject.name,
                description: subject.description
            },
            levels: levelsWithStatus
        });

    } catch (error) {
        console.error('Subject map error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
