import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const db = await getDb();
        const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // In a real app, compare hashed password. Here we compare plain text as per mock.
        if (user.password_hash !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        return res.json({
            user_id: user.id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
