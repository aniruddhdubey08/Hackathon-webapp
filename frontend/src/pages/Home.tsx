import React from 'react';
import { Map, Swords, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HomeTopBar from '../components/home/HomeTopBar';
import FeatureCard from '../components/home/FeatureCard';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.pageContainer}>
            <HomeTopBar />

            {/* Background Grid */}
            <div style={styles.gridBg} />

            <main style={styles.mainContent}>
                {/* Hero Section */}
                <section style={styles.heroSection}>
                    <h1 style={styles.headline}>
                        THE GALAXY IS<br />
                        <span style={styles.headlineHighlight}>YOUR CLASSROOM</span>
                    </h1>
                    <p style={styles.subheadline}>
                        Explore a vast level-based sector map, prove your skills in interactive<br />
                        quizzes, and engage in 1v1 knowledge duels to rule the system.
                    </p>

                    <div style={styles.buttonGroup}>
                        <button style={styles.primaryButton} onClick={() => navigate('/auth')}>ENTER SYSTEM</button>
                        <button style={styles.secondaryButton}>EXPLORE MODULES</button>
                    </div>
                </section>

                {/* Features Grid */}
                <section style={styles.featuresSection}>
                    <FeatureCard
                        icon={<Map size={24} color="#FF5CB0" />}
                        title="Mission-Based Learning"
                        description="Navigate through educational sectors. Each node is a new challenge waiting to be unlocked on your path to mastery."
                    />
                    <FeatureCard
                        icon={<Swords size={24} color="#FF5555" />} // Reddish for battle
                        title="Battle Arena"
                        description="Test your knowledge in the crucible of combat. Engage in real-time 1v1 duels against other learners to rank up."
                    />
                    <FeatureCard
                        icon={<Trophy size={24} color="#FFD700" />} // Gold for trophy
                        title="Sector Mastery"
                        description="Complete all objectives in a sector to achieve mastery, unlock rare badges, and reveal new areas of the galaxy."
                    />
                </section>
            </main>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    pageContainer: {
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-deep)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
    },
    gridBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
      linear-gradient(rgba(5, 6, 13, 0.8), rgba(5, 6, 13, 0.95)),
      radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
        backgroundSize: '100% 100%, 40px 40px',
        pointerEvents: 'none',
        zIndex: 0,
    },
    mainContent: {
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 60px', // Top padding for header
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
    },
    heroSection: {
        textAlign: 'center',
        marginBottom: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    headline: {
        fontSize: '64px',
        fontWeight: '800',
        color: '#FFF',
        fontFamily: 'var(--font-display)',
        lineHeight: '1.1',
        letterSpacing: '-1px',
        marginBottom: '24px',
        textTransform: 'uppercase',
    },
    headlineHighlight: {
        color: 'rgba(255, 255, 255, 0.5)', // Grayed out "YOUR CLASSROOM" based on design, or gradient?
        // Design image shows "YOUR CLASSROOM" slightly different or same white?
        // Looking at image: "THE GALAXY IS" is white. "YOUR CLASSROOM" is white but maybe bold?
        // Wait, typical cyber theme might have it gradient.
        // Let's stick to white for now, maybe add text-shadow.
        // Actually, looking at the image: "THE GALAXY IS" white. "YOUR CLASSROOM" white.
        // I will keep it consistent.
    },
    subheadline: {
        fontSize: '18px',
        color: 'var(--text-secondary)',
        marginBottom: '40px',
        maxWidth: '600px',
        lineHeight: '1.6',
    },
    buttonGroup: {
        display: 'flex',
        gap: '24px',
    },
    primaryButton: {
        backgroundColor: '#FF5CB0',
        color: '#000',
        border: 'none',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '1px',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(255, 92, 176, 0.4)',
        textTransform: 'uppercase',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        color: '#00F090',
        border: '1px solid #00F090',
        padding: '16px 32px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '1px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        boxShadow: '0 0 10px rgba(0, 240, 144, 0.1)',
    },
    featuresSection: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        width: '100%',
    },
};

export default Home;
