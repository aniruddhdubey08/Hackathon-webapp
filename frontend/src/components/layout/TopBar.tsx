import React from 'react';
import { Bell, Settings, Gem, ChevronDown, Layers } from 'lucide-react';

const TopBar: React.FC = () => {
    return (
        <header style={styles.container}>
            {/* Left Title */}
            <div style={styles.leftSection}>
                <div style={styles.logoIcon}>
                    <Layers size={18} color="#FF5CB0" />
                </div>
                <h1 style={styles.title}>Cosmic Learning</h1>
            </div>

            {/* Center Subject Selector */}
            <div style={styles.centerSection}>
                <div style={styles.subjectSelector}>
                    <span style={styles.subjectLabel}>SUBJECT</span>
                    <span style={styles.subjectValue}>PYTHON_3.X</span>
                    <ChevronDown size={14} color="#5A6B89" />
                </div>
            </div>

            {/* Right Stats & Actions */}
            <div style={styles.rightSection}>
                <div style={styles.pointsBadge}>
                    <Gem size={14} color="#FF5CB0" fill="#FF5CB0" style={{ marginRight: '8px' }} />
                    <span>1,250</span>
                </div>

                <button style={styles.iconButton}>
                    <Bell size={18} />
                </button>

                <button style={styles.iconButton}>
                    <Settings size={18} />
                </button>
            </div>
        </header>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        backgroundColor: 'transparent', // Or semi-transparent if needed
        zIndex: 10,
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
    },
    logoIcon: {
        width: '32px',
        height: '32px',
        backgroundColor: 'var(--bg-panel)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#FFF',
        fontFamily: 'var(--font-display)',
    },
    centerSection: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    subjectSelector: {
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-light)',
        padding: '8px 16px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
    },
    subjectLabel: {
        fontSize: '10px',
        color: 'var(--text-tertiary)',
        letterSpacing: '1px',
        fontWeight: 600,
    },
    subjectValue: {
        fontSize: '14px',
        color: '#FFF',
        fontWeight: 700,
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flex: 1,
        justifyContent: 'flex-end',
    },
    pointsBadge: {
        backgroundColor: 'rgba(255, 92, 176, 0.15)',
        border: '1px solid rgba(255, 92, 176, 0.3)',
        borderRadius: '20px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        color: '#FF5CB0',
        fontWeight: '700',
        fontSize: '14px',
        marginRight: '8px',
    },
    iconButton: {
        width: '40px',
        height: '40px',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-panel)',
        border: 'none',
        color: 'var(--text-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
};

export default TopBar;
