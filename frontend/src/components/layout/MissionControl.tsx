import React from 'react';
import { Rocket } from 'lucide-react';

const MissionControl: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.infoGroup}>
                <div style={styles.label}>CURRENT SECTOR</div>
                <div style={styles.value}>CYBER_VOID_01</div>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.infoGroup}>
                <div style={styles.label}>COMPLETION</div>
                <div style={styles.value}>24.5%</div>
            </div>

            <button style={styles.resumeButton}>
                <span>RESUME MISSION</span>
                <Rocket size={16} />
            </button>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        position: 'absolute',
        bottom: '32px',
        right: '32px',
        backgroundColor: 'var(--bg-panel)',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(10px)',
    },
    infoGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    label: {
        fontSize: '9px',
        color: 'var(--text-tertiary)',
        letterSpacing: '1px',
        fontWeight: '600',
    },
    value: {
        fontSize: '14px',
        color: '#FFF',
        fontWeight: '700',
        fontFamily: 'var(--font-display)',
        letterSpacing: '1px',
    },
    divider: {
        width: '1px',
        height: '32px',
        backgroundColor: 'var(--border-light)',
    },
    resumeButton: {
        backgroundColor: '#FF95D5', // Lighter pink
        backgroundImage: 'linear-gradient(135deg, #FF95D5 0%, #FF5CB0 100%)',
        border: 'none',
        borderRadius: '24px',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#000',
        fontWeight: '700',
        fontSize: '12px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(255, 92, 176, 0.4)',
        marginLeft: '8px',
        transition: 'transform 0.2s',
    },
};

export default MissionControl;
