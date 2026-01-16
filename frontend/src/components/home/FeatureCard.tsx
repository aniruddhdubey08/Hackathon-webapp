import React, { type ReactNode } from 'react';

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
    return (
        <div style={styles.card}>
            <div style={styles.iconContainer}>
                {icon}
            </div>
            <h3 style={styles.title}>{title}</h3>
            <p style={styles.description}>{description}</p>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    card: {
        backgroundColor: 'rgba(14, 16, 28, 0.6)', // Glass-like
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--border-light)',
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '16px',
        flex: 1,
        minWidth: '300px',
    },
    iconContainer: {
        width: '48px',
        height: '48px',
        backgroundColor: '#1E2330', // Use color from variables ideally, but hex is fine for consistency
        borderRadius: '50%', // Circle
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    },
    title: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#FFF',
        fontFamily: 'var(--font-display)',
    },
    description: {
        fontSize: '14px',
        color: 'var(--text-secondary)',
        lineHeight: '1.6',
    },
};

export default FeatureCard;
