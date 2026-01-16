import React from 'react';
import { Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomeTopBar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <header style={styles.container}>
            <div style={styles.leftSection}>
                <div style={styles.logoIcon}>
                    <Layers size={20} color="#FF5CB0" />
                </div>
                <h1 style={styles.title}>Cosmic Learning</h1>
            </div>

            <div style={styles.rightSection}>
                <button style={styles.loginButton} onClick={() => navigate('/auth')}>Login</button>
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
        padding: '0 48px',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
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
    rightSection: {},
    loginButton: {
        backgroundColor: 'transparent',
        border: '1px solid var(--border-light)',
        borderRadius: '24px',
        color: '#FFF',
        padding: '10px 24px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        transition: 'all 0.2s',
    },
};

export default HomeTopBar;
