
import React, { useState, useEffect } from 'react';
import { Brain, Lock, Mail, User, MailCheck, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';
import { db } from '../services/db';

interface SignupPageProps {
  initialRole: UserRole;
  onSignupSuccess: (user: any) => void;
  onLoginClick: () => void;
  onBack: () => void;
  initialView?: 'signup' | 'verify';
  initialEmail?: string;
}

export const SignupPage: React.FC<SignupPageProps> = ({ 
  initialRole, 
  onSignupSuccess, 
  onLoginClick, 
  onBack,
  initialView = 'signup',
  initialEmail = ''
}) => {
  const [view, setView] = useState<'signup' | 'verify'>(initialView);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(initialRole);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);
  
  // Update view if initialView prop changes
  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  // Update email if initialEmail prop changes
  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  // Strict Email Regex
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g., name@domain.com)");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      db.signup(name, email, password, role, rememberMe);
      setView('verify');
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

  const handleGoogleSignup = () => {
    // Simulate Google Signup
    // In a real app, this would trigger an OAuth popup
    try {
        const user = db.googleAuth(
            "alex.google@example.com", 
            "Alex Google", 
            "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
            role
        );
        onSignupSuccess(user);
    } catch (err: any) {
        setError("Google Signup failed: " + err.message);
    }
  };

  const handleSimulateVerification = () => {
    // Demo function to simulate user clicking email link
    try {
      db.verifyUser(email);
      // Auto-login the user immediately after verification
      // Password state is available here since we haven't unmounted the component
      const user = db.login(email, password, rememberMe);
      onSignupSuccess(user);
    } catch (err: any) {
      setError(err.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100">
        <div className="p-8">
           <button onClick={onBack} className="mb-6 text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-medium">
             &larr; Back to Home
           </button>
           <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-2 rounded-lg">
                 <Brain className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-slate-800 tracking-tight">MindQuest</span>
           </div>

           {view === 'signup' ? (
             <>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Account</h2>
               <p className="text-slate-500 mb-8">Join MindQuest and start learning today.</p>
               
               <div className="p-1 bg-slate-100 rounded-xl flex mb-6">
                 <button 
                   type="button" 
                   onClick={() => setRole('student')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Student
                 </button>
                 <button 
                   type="button" 
                   onClick={() => setRole('teacher')}
                   className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'teacher' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   Teacher
                 </button>
               </div>
               
               <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                           type="text" 
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm placeholder:text-slate-400"
                           placeholder="Enter your full name" 
                           required
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                           type="email" 
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm placeholder:text-slate-400"
                           placeholder="Enter your email" 
                           required
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                     <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                           type="password" 
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm placeholder:text-slate-400"
                           placeholder="Create a password" 
                           required
                        />
                     </div>
                  </div>

                  <div className="flex items-center">
                    <input 
                        id="remember-me"
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer select-none">
                        Remember me
                    </label>
                  </div>

                  {error && (
                    <div className="bg-rose-50 p-3 rounded-lg border border-rose-100">
                      <p className="text-rose-500 text-sm font-medium">{error}</p>
                      {error.includes("already exists") && (
                         <button 
                           type="button" 
                           onClick={onLoginClick} 
                           className="text-rose-700 font-bold text-xs hover:underline mt-1 flex items-center gap-1"
                         >
                           Log in with existing account <ArrowRight size={12} />
                         </button>
                      )}
                    </div>
                  )}

                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 mt-2">
                    Create Account
                  </button>
               </form>

               {/* Google Signup */}
               <div className="mt-6">
                  <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                     </div>
                     <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-400">Or continue with</span>
                     </div>
                  </div>
                  
                  <button 
                     type="button"
                     onClick={handleGoogleSignup}
                     className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-xl transition-colors"
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

               <div className="mt-6 text-center text-sm text-slate-500">
                  Already have an account? <button type="button" onClick={onLoginClick} className="text-indigo-600 font-bold hover:underline">Log in</button>
               </div>
             </>
           ) : (
             <div className="text-center py-8 animate-in zoom-in duration-300">
               <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <MailCheck size={32} />
               </div>
               <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify your email</h2>
               <p className="text-slate-500 mb-8">
                 We've sent a verification link to <span className="font-bold text-slate-700">{email}</span>. 
                 Please check your inbox to activate your account.
               </p>
               
               <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                 <h4 className="text-amber-800 font-bold text-sm mb-1">Demo Mode</h4>
                 <p className="text-amber-700 text-xs mb-3">Since we can't send real emails in this demo, click below to simulate verifying your account and logging in.</p>
                 <button 
                   onClick={handleSimulateVerification}
                   className="w-full py-2 bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold rounded-lg text-sm transition-colors"
                 >
                   Simulate Verification & Login
                 </button>
               </div>
               
               {error && <p className="text-rose-500 text-sm font-medium bg-rose-50 p-3 rounded-lg border border-rose-100 mb-4">{error}</p>}

               <button 
                  onClick={onLoginClick}
                  className="w-full text-slate-500 hover:text-indigo-600 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Back to Login <ArrowRight size={16} />
                </button>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};
