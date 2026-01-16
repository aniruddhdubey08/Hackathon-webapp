
import React, { useState } from 'react';
import { Brain, Lock, Mail, ArrowRight, CheckCircle, KeyRound, Sun, Moon } from 'lucide-react';
import { UserRole } from '../types';
import { db } from '../services/db';

interface LoginPageProps {
  onLoginSuccess: (user: any) => void;
  onSignupClick: () => void;
  onBack: () => void;
  onVerifyClick: (email: string) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

type LoginView = 'login' | 'forgot-password' | 'reset-success';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onSignupClick, onBack, onVerifyClick, darkMode, onToggleTheme }) => {
  const [view, setView] = useState<LoginView>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password States
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSimulatingReset, setIsSimulatingReset] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const user = db.login(email, password, rememberMe);
      // Validate role
      if (user.role !== role) {
        setError(`This account is registered as a ${user.role}, not a ${role}.`);
        return;
      }
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    // In a real app, this would trigger an OAuth popup
    try {
        const mockEmail = role === 'teacher' ? "sarah.teacher@google.com" : "alex.google@example.com";
        const mockName = role === 'teacher' ? "Sarah Teacher" : "Alex Google";
        const mockAvatar = role === 'teacher' 
            ? "https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah" 
            : "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex";

        const user = db.googleAuth(
            mockEmail, 
            mockName, 
            mockAvatar,
            role
        );
        onLoginSuccess(user);
    } catch (err: any) {
        setError("Google Login failed: " + err.message);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simulate checking if email exists
    try {
      const users = db.getUsers();
      const exists = users.find(u => u.email.toLowerCase() === resetEmail.toLowerCase());
      
      if (!exists) {
        setError("No account found with this email address.");
        return;
      }
      
      // If email exists, show the reset password UI (Simulation of clicking link)
      setIsSimulatingReset(true);
    } catch (e) {
      setError("An error occurred.");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    db.resetPassword(resetEmail, newPassword);
    setView('reset-success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 relative transition-colors duration-300">
      <button 
        onClick={onToggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-md transition-all"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200 dark:shadow-slate-900/50 overflow-hidden border border-slate-100 dark:border-slate-700">
        <div className="p-8">
           <button onClick={onBack} className="mb-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 text-sm font-medium">
             &larr; Back to Home
           </button>
           <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-2 rounded-lg">
                 <Brain className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">MindQuest</span>
           </div>

           {/* --- LOGIN VIEW --- */}
           {view === 'login' && (
             <>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
               <p className="text-slate-500 dark:text-slate-400 mb-8">Please enter your details to sign in.</p>
               
               <div className="p-1 bg-slate-100 dark:bg-slate-700 rounded-xl flex mb-6">
                 <button 
                   type="button" 
                   onClick={() => setRole('student')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'student' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                 >
                   Student
                 </button>
                 <button 
                   type="button" 
                   onClick={() => setRole('teacher')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'teacher' ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                 >
                   Teacher
                 </button>
               </div>
               
               <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                           type="email" 
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all text-sm placeholder:text-slate-400"
                           placeholder="Enter your email" 
                           required
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Password</label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                           type="password" 
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all text-sm placeholder:text-slate-400"
                           placeholder="Enter your password" 
                           required
                        />
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input 
                          id="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                          Remember me
                      </label>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { setView('forgot-password'); setError(''); }}
                      className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <div className="bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg border border-rose-100 dark:border-rose-800">
                      <p className="text-rose-500 dark:text-rose-300 text-sm font-medium mb-2">{error}</p>
                      {error.toLowerCase().includes("verify") && (
                        <button
                          type="button"
                          onClick={() => onVerifyClick(email)}
                          className="text-xs bg-rose-200 hover:bg-rose-300 dark:bg-rose-800 dark:hover:bg-rose-700 text-rose-800 dark:text-rose-100 px-3 py-1.5 rounded-md font-bold transition-colors w-full sm:w-auto"
                        >
                          Verify Account Now
                        </button>
                      )}
                    </div>
                  )}

                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none mt-2">
                    Sign In as {role === 'student' ? 'Student' : 'Teacher'}
                  </button>
               </form>

               {/* Google Login */}
               <div className="mt-6">
                  <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                     </div>
                     <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-slate-800 text-slate-400">Or continue with</span>
                     </div>
                  </div>
                  
                  <button 
                     type="button"
                     onClick={handleGoogleLogin}
                     className="mt-4 w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-bold py-3 rounded-xl transition-colors"
                  >
                     <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                     </svg>
                     Google
                  </button>
               </div>

               <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account? <button type="button" onClick={onSignupClick} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign up</button>
               </div>
             </>
           )}

           {/* --- FORGOT PASSWORD VIEW --- */}
           {view === 'forgot-password' && (
             <>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h2>
               
               {!isSimulatingReset ? (
                 <>
                   <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your email and we'll send you a link to reset your password.</p>
                   <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                              type="email" 
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all text-sm"
                              placeholder="name@example.com" 
                              required
                            />
                        </div>
                      </div>

                      {error && <p className="text-rose-500 dark:text-rose-300 text-sm font-medium bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg border border-rose-100 dark:border-rose-800">{error}</p>}

                      <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                        Send Reset Link
                      </button>
                      
                      <button 
                        type="button" 
                        onClick={() => { setView('login'); setError(''); }}
                        className="w-full py-3 text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200"
                      >
                        Cancel
                      </button>
                   </form>
                 </>
               ) : (
                 <div className="animate-in fade-in slide-in-from-right-4">
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Create a new password for <span className="font-bold text-slate-700 dark:text-white">{resetEmail}</span>.</p>
                    <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-3 rounded-lg text-xs mb-6 border border-amber-200 dark:border-amber-800">
                      <strong>Demo Mode:</strong> We are simulating the email link click. Enter new password below.
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">New Password</label>
                          <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                              <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 outline-none transition-all text-sm"
                                placeholder="Min 6 characters" 
                                required
                              />
                          </div>
                        </div>

                        {error && <p className="text-rose-500 dark:text-rose-300 text-sm font-medium bg-rose-50 dark:bg-rose-900/30 p-3 rounded-lg border border-rose-100 dark:border-rose-800">{error}</p>}

                        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                          Set New Password
                        </button>
                    </form>
                 </div>
               )}
             </>
           )}

           {/* --- RESET SUCCESS VIEW --- */}
           {view === 'reset-success' && (
             <div className="text-center py-8 animate-in zoom-in duration-300">
               <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Password Reset!</h2>
               <p className="text-slate-500 dark:text-slate-400 mb-8">Your password has been updated successfully. You can now log in.</p>
               <button 
                  onClick={() => { setView('login'); setPassword(''); }}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2"
                >
                  Back to Login <ArrowRight size={18} />
                </button>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};
