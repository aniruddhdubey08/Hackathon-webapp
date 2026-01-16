import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/database';
import authRoutes from './routes/auth.routes';
import subjectsRoutes from './routes/subjects.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectsRoutes);

// Health check

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Root handler
app.get('/', (req, res) => {
    res.json({ message: 'Gamified Learning Platform API is running' });
});


let server: any;

async function startServer() {
    try {
        await initDb();

        server = app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
const shutdown = () => {
    if (server) {
        console.log('Shutting down server...');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// nodemon restart signal
process.once('SIGUSR2', () => {
    if (server) {
        server.close(() => {
            process.kill(process.pid, 'SIGUSR2');
        });
    } else {
        process.kill(process.pid, 'SIGUSR2');
    }
});
