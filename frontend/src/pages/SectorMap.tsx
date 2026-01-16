import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import MissionControl from '../components/layout/MissionControl';
import LevelMap from '../components/level-map/LevelMap';

const SectorMap: React.FC = () => {
    return (
        <div style={styles.pageContainer}>
            <Sidebar />

            <main style={styles.mainContent}>
                <TopBar />

                <div style={styles.mapArea}>
                    <LevelMap />
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
};

export default SectorMap;
