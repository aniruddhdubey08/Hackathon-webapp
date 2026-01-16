import React, { useState } from 'react';
import { Layers, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div style={styles.pageContainer}>
            <div style={styles.gridBg} />

            <div style={styles.card}>
                {/* Corner Accents */}
                <div style={{ ...styles.corner, top: 0, left: 0, borderTop: '2px solid #333', borderLeft: '2px solid #333' }} />
                <div style={{ ...styles.corner, top: 0, right: 0, borderTop: '2px solid #333', borderRight: '2px solid #333' }} />
                <div style={{ ...styles.corner, bottom: 0, left: 0, borderBottom: '2px solid #333', borderLeft: '2px solid #333' }} />
                <div style={{ ...styles.corner, bottom: 0, right: 0, borderBottom: '2px solid #333', borderRight: '2px solid #333' }} />

                {/* Logo Area */}
                <div style={styles.header}>
                    <div style={styles.logoBadge}>
                        <Layers size={24} color="#FF5CB0" />
                    </div>
                    <h1 style={styles.title}>Cosmic Learning</h1>
                    <p style={styles.subtitle}>LOGIN // SECURE ACCESS</p>
                </div>

                {/* Form */}
                <div style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>EXPLORE ID / EMAIL</label>
                        <div style={styles.inputWrapper}>
                            <input
                                type="text"
                                placeholder="ENTER IDENTIFIER"
                                style={styles.input}
                            />
                            <User size={18} color="#5A6B89" style={styles.inputIcon} />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>ACCESS KEY / PASSWORD</label>
                        <div style={styles.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••••••"
                                style={styles.input}
                            />


                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={styles.eyeButton}
                            >
                                {showPassword ? (
                                    <EyeOff size={16} color="#5A6B89" />
                                ) : (
                                    <Eye size={16} color="#5A6B89" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button style={styles.submitButton} onClick={() => navigate('/map')}>
                        <span>ACCESS SYSTEM</span>
                        <ArrowRight size={18} />
                    </button>

                    <div style={styles.divider}>
                        <span style={styles.dividerText}>OR WITH PROTOCOL</span>
                    </div>

                    <button style={styles.googleButton}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span>CONTINUE WITH GOOGLE</span>
                    </button>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <p style={styles.footerText}>
                        Need a profile? <button style={styles.linkButton} onClick={() => navigate('/signup')}>CREATE NEW RECORD</button>
                    </p>
                </div>

                {/* System Status - Bottom */}
                <div style={styles.systemStatus}>
                    SYSTEM STATUS: OPTIMAL • SECTOR 7G
                </div>
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    pageContainer: {
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#05060D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    gridBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
      radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)
    `,
        backgroundSize: '40px 40px',
        opacity: 0.5,
        pointerEvents: 'none',
    },
    card: {
        width: '400px',
        backgroundColor: 'rgba(14, 16, 28, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-light)',
        borderRadius: '24px',
        padding: '48px 32px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
    },
    corner: {
        position: 'absolute',
        width: '16px',
        height: '16px',
        borderRadius: '2px', // Slight rounding
        opacity: 0.5,
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '40px',
    },
    logoBadge: {
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        backgroundColor: 'rgba(255, 92, 176, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        boxShadow: '0 0 20px rgba(255, 92, 176, 0.2)',
        border: '1px solid rgba(255, 92, 176, 0.2)',
    },
    title: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#FFF',
        fontFamily: 'var(--font-display)',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '12px',
        color: '#00F090', // Cyan accent
        letterSpacing: '2px',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '10px',
        color: '#00F090',
        letterSpacing: '1px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        width: '100%',
        backgroundColor: 'rgba(5, 6, 13, 0.6)',
        border: '1px solid var(--border-light)',
        borderRadius: '12px',
        padding: '16px',
        paddingRight: '48px',
        color: '#FFF',
        fontFamily: 'var(--font-display)', // Monospaced feel
        fontSize: '12px',
        outline: 'none',
        transition: 'all 0.2s',
        letterSpacing: '1px',
    },
    inputIcon: {
        position: 'absolute',
        right: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0.5,
    },
    eyeButton: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        zIndex: 10,
    },
    submitButton: {
        marginTop: '16px',
        width: '100%',
        backgroundColor: '#FF5CB0',
        border: 'none',
        borderRadius: '12px',
        padding: '16px',
        color: '#000',
        fontWeight: '700',
        fontSize: '14px',
        letterSpacing: '1px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 0 20px rgba(255, 92, 176, 0.4)',
        fontFamily: 'var(--font-display)',
    },
    divider: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
        margin: '24px 0 16px',
    },
    dividerText: {
        fontSize: '10px',
        color: '#5A6B89',
        fontWeight: '600',
        letterSpacing: '1px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.7,
        textTransform: 'uppercase',
    },
    googleButton: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-light)',
        borderRadius: '12px',
        padding: '16px',
        color: '#FFF',
        fontWeight: '600',
        fontSize: '12px',
        letterSpacing: '1px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        fontFamily: 'var(--font-display)',
        transition: 'all 0.2s',
    },
    footer: {
        marginTop: '32px',
    },
    footerText: {
        fontSize: '12px',
        color: '#8B9BB4',
    },
    linkButton: {
        background: 'none',
        border: 'none',
        color: '#00F090',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '12px',
        marginLeft: '4px',
        letterSpacing: '0.5px',
    },
    systemStatus: {
        position: 'absolute',
        bottom: '-32px',
        fontSize: '10px',
        color: '#333',
        letterSpacing: '1px',
        fontWeight: '600',
        textTransform: 'uppercase',
    }
};

export default Auth;
