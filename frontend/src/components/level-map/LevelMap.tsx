import React from 'react';
import LevelNode, { type NodeStatus } from './LevelNode';

interface LevelData {
    id: string;
    title: string;
    subtitle: string;
    status: NodeStatus;
    x: number;
    y: number;
}

const MOCK_LEVELS: LevelData[] = [
    {
        id: '1',
        title: 'Intro to Variables',
        subtitle: 'Mastered',
        status: 'mastered',
        x: 650,
        y: 150,
    },
    {
        id: '2',
        title: 'Control Flow',
        subtitle: 'Current_Objective',
        status: 'current',
        x: 450,
        y: 350,
    },
    {
        id: '3',
        title: 'Functions',
        subtitle: 'Locked',
        status: 'locked',
        x: 600,
        y: 550,
    },
    {
        id: '4',
        title: 'Data Structures',
        subtitle: 'Locked',
        status: 'locked',
        x: 500,
        y: 750,
    },
];

const LevelMap: React.FC = () => {




    // Generate path
    // Simple cubic bezier curve generator through points
    const generatePath = () => {
        if (MOCK_LEVELS.length < 2) return '';

        let d = `M ${MOCK_LEVELS[0].x} ${MOCK_LEVELS[0].y}`;

        for (let i = 0; i < MOCK_LEVELS.length - 1; i++) {
            const current = MOCK_LEVELS[i];
            const next = MOCK_LEVELS[i + 1];

            // Control points for smooth curve
            // This is a simple approximation
            const cp1x = current.x;
            const cp1y = current.y + (next.y - current.y) / 2;
            const cp2x = next.x;
            const cp2y = current.y + (next.y - current.y) / 2;

            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }
        return d;
    };

    return (
        <div style={styles.container}>
            {/* Background Dots */}
            <div style={styles.gridBg} />

            {/* Map Content */}
            <div style={styles.mapContent}>
                <svg style={styles.svgOverlay} width="100%" height="100%">
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#00F090" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#2A3040" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                    <path
                        d={generatePath()}
                        fill="none"
                        stroke="#4A5568"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="12 12"
                        opacity="0.3"
                    />
                    {/* Active path segment could be overlayed here if needed */}
                </svg>

                {MOCK_LEVELS.map((level) => (
                    <LevelNode
                        key={level.id}
                        {...level}
                    />
                ))}
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'var(--bg-deep)',
        overflow: 'hidden', // Scroll if needed? Mockup implies fixed or pannable
        // For this task, we will make it scrollable if content overflows
        overflowY: 'auto',
        display: 'flex',
        justifyContent: 'center',
    },
    gridBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        userSelect: 'none',
        pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px', // Dot grid
        opacity: 0.5,
    },
    mapContent: {
        position: 'relative',
        width: '1000px', // Fixed canvas size for simplicity
        height: '1000px',
        marginTop: '50px',
    },
    svgOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
    },
};

export default LevelMap;
