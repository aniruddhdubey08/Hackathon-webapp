import React from 'react';
import { Map, Dumbbell, BarChart3, User, Flame } from 'lucide-react';
import '../../styles/theme.css';

const Sidebar: React.FC = () => {
    return (
        <aside style={styles.container}>
            {/* Profile Section */}
            <div style={styles.profileSection}>
                <div style={styles.avatarContainer}>
                    <div style={styles.avatar}>
                        <User size={24} color="#FFF" />
                    </div>
                </div>
                <div style={styles.userInfo}>
                    <h3 style={styles.userName}>Star Voyager</h3>
                    <p style={styles.rank}>RANK: <span style={styles.rankHighlight}>NOVICE</span></p>
                </div>
            </div>

            {/* Level Progress */}
            <div style={styles.levelSection}>
                <div style={styles.levelHeader}>
                    <span style={styles.levelLabel}>LEVEL 12</span>
                    <span style={styles.xpLabel}>650 / 1000 XP</span>
                </div>
                <div style={styles.progressBarBg}>
                    <div style={styles.progressBarFill}></div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={styles.nav}>
                <div style={{ ...styles.navItem, ...styles.navItemActive }}>
                    <Map size={20} />
                    <span style={styles.navText}>Sector Map</span>
                </div>

                <div style={styles.navItem}>
                    <Dumbbell size={20} />
                    <span style={styles.navText}>Practice Hub</span>
                </div>

                <div style={styles.navItem}>
                    <BarChart3 size={20} />
                    <span style={styles.navText}>Hall of Fame</span>
                </div>
            </nav>

            {/* Footer / Streak */}
            <div style={styles.footer}>
                <div style={styles.streakCard}>
                    <Flame size={16} fill="#FF9500" color="#FF9500" />
                    <span style={styles.streakText}>7 DAY STREAK</span>
                    <Flame size={16} fill="#FF9500" color="#FF9500" />
                </div>
            </div>
        </aside>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: '260px',
        height: '100%',
        backgroundColor: 'var(--bg-panel)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px',
        flexShrink: 0,
    },
    profileSection: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '24px',
        gap: '12px',
    },
    avatarContainer: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF5CB0, #00F090)',
        padding: '2px', // Border wrapper
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInfo: {
        display: 'flex',
        flexDirection: 'column',
    },
    userName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#FFF',
        fontFamily: 'var(--font-display)',
    },
    rank: {
        fontSize: '10px',
        color: 'var(--text-tertiary)',
        letterSpacing: '1px',
        marginTop: '2px',
    },
    rankHighlight: {
        color: '#FF5CB0',
        fontWeight: 'bold',
    },
    levelSection: {
        backgroundColor: 'var(--bg-deep)',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '32px',
        border: '1px solid var(--border-light)',
    },
    levelHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: 'var(--text-secondary)',
        marginBottom: '8px',
        fontFamily: 'var(--font-body)',
        fontWeight: '600',
    },
    levelLabel: { textTransform: 'uppercase' },
    xpLabel: {},
    progressBarBg: {
        height: '6px',
        backgroundColor: '#333',
        borderRadius: '3px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        width: '65%',
        backgroundColor: '#FF5CB0',
        borderRadius: '3px',
        boxShadow: '0 0 8px rgba(255, 92, 176, 0.6)',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        flex: 1,
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '24px', // Pill shape
        color: 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        gap: '12px',
    },
    navItemActive: {
        backgroundColor: 'var(--primary)',
        color: '#000', // Black text on pink button
        fontWeight: '600',
    },
    navText: {
        fontSize: '14px',
    },
    footer: {
        marginTop: 'auto',
    },
    streakCard: {
        background: 'linear-gradient(90deg, #2A1A0F 0%, #1A120B 100%)',
        border: '1px solid #FF9500',
        borderRadius: '24px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FF9500',
        fontSize: '12px',
        fontWeight: 'bold',
        letterSpacing: '1px',
    },
    streakText: {
        margin: '0 8px',
    }
};

export default Sidebar;
