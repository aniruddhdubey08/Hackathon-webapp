import React from 'react';
import { Check, Lock, BookOpen } from 'lucide-react';

export type NodeStatus = 'mastered' | 'current' | 'locked';

interface LevelNodeProps {
    status: NodeStatus;
    title: string;
    subtitle: string;
    x: number;
    y: number;
    onClick?: () => void;
}

const LevelNode: React.FC<LevelNodeProps> = ({ status, title, subtitle, x, y, onClick }) => {
    const isCurrent = status === 'current';
    const isMastered = status === 'mastered';

    const getIcon = () => {
        if (isMastered) return <Check size={28} color="#FFF" strokeWidth={3} />;
        if (isCurrent) return <BookOpen size={28} color="#FFF" />;
        return <Lock size={24} color="#5A6B89" />;
    };

    const getGlow = () => {
        if (isMastered) return '0 0 24px rgba(0, 240, 144, 0.6)';
        if (isCurrent) return '0 0 32px rgba(255, 92, 176, 0.8)';
        return 'none';
    };



    return (
        <div
            style={{
                ...styles.container,
                left: x,
                top: y,
            }}
            onClick={onClick}
        >
            <div className="node-wrapper" style={styles.wrapper}>
                {/* Node Circle */}
                <div style={{
                    ...styles.nodeCircle,
                    backgroundColor: isMastered ? '#00F090' : isCurrent ? '#FF5CB0' : '#1A1D2D',
                    border: isCurrent ? '4px solid #FFF' : isMastered ? 'none' : '2px solid #2A3040',
                    boxShadow: getGlow(),
                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                }}>
                    {getIcon()}
                </div>

                {/* Label Info */}
                <div style={{
                    ...styles.labelContainer,
                    // Position text to the right usually, but for current it's left in the mockup?
                    // Actually in mockup: Mastered -> Right, Current -> Left, Locked -> Right.
                    // I will default to Right for simplicity, or check mockup again.
                    // Mockup: Current is Left aligned text. Mastered is Right. Locked is Right.
                    // I'll make it dynamic or just fix it based on simple logic (alternating? or prop?).
                    // For now I'll just put it on the right for all except Current.
                    left: isCurrent ? 'auto' : '90px',
                    right: isCurrent ? '100px' : 'auto',
                    textAlign: isCurrent ? 'right' : 'left',
                    alignItems: isCurrent ? 'flex-end' : 'flex-start',
                }}>
                    <h3 style={{ ...styles.title, opacity: status === 'locked' ? 0.5 : 1 }}>{title}</h3>
                    <span style={{
                        ...styles.subtitle,
                        color: isMastered ? '#00F090' : isCurrent ? '#FF5CB0' : '#4A5568'
                    }}>
                        {subtitle.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
        cursor: 'pointer',
    },
    wrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeCircle: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    labelContainer: {
        position: 'absolute',
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        color: '#FFF',
        fontSize: '20px',
        fontWeight: '700',
        marginBottom: '4px',
        fontFamily: 'var(--font-display)',
        letterSpacing: '0.5px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    subtitle: {
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '1px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    }
};

export default LevelNode;
