import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import MissionControl from '../components/layout/MissionControl';
import LevelMap, { LevelData } from '../components/level-map/LevelMap';

const SectorMap: React.FC = () => {
    const [levels, setLevels] = useState<LevelData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    throw new Error('User not authenticated');
                }
                const user = JSON.parse(userStr);

                // Hardcoded subject ID s-1 for now as per requirements
                const response = await fetch(`http://localhost:3001/api/subjects/s-1/map?userId=${user.id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch sector data');
                }

                const data = await response.json();

                // Transform API data to LevelData with coordinates
                const mappedLevels: LevelData[] = data.levels.map((level: any, index: number) => {
                    // Generate coordinates (Zigzag pattern)
                    // Center X is roughly 550. Range +/- 100.
                    // Y starts at 150, increments by 200.
                    const x = 550 + (index % 2 === 0 ? 100 : -100);
                    const y = 150 + (index * 200);

                    // Map status
                    // API: LOCKED, UNLOCKED, COMPLETED
                    // Frontend: locked, current, mastered
                    let status: 'locked' | 'current' | 'mastered' = 'locked';
                    if (level.status === 'COMPLETED') status = 'mastered';
                    if (level.status === 'UNLOCKED') status = 'current';

                    return {
                        id: level.id,
                        title: level.title,
                        subtitle: level.status === 'COMPLETED' ? 'Mastered' : (level.status === 'UNLOCKED' ? 'Current Objective' : 'Locked'),
                        status: status,
                        x: x,
                        y: y
                    };
                });

                setLevels(mappedLevels);
            } catch (err: any) {
                console.error('Error fetching map:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMapData();
    }, []);

    return (
        <div style={styles.pageContainer}>
            <Sidebar />

            <main style={styles.mainContent}>
                <TopBar />

                <div style={styles.mapArea}>
                    {loading ? (
                        <div style={styles.centerMessage}>LOADING SECTOR DATA...</div>
                    ) : error ? (
                        <div style={styles.centerMessage}>ERROR: {error}</div>
                    ) : (
                        <LevelMap levels={levels} />
                    )}
                    <MissionControl />
                </div>
            </main>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    pageContainer: {
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-deep)',
    },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
    },
    mapArea: {
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-deep)',
        backgroundImage: 'linear-gradient(180deg, rgba(5,6,13,0) 0%, rgba(5,6,13,0.8) 100%)', // Subtle vignette
    },
    centerMessage: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#00F090',
        fontFamily: 'var(--font-display)',
        fontSize: '14px',
        letterSpacing: '2px',
    },
};

export default SectorMap;
