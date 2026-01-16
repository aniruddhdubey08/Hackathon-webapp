
import React, { useState } from 'react';
import { UserStats, LearningStyle } from '../types';
import { Save, User, Sparkles, Check, Shield, Mail, GraduationCap, School, Brain, Eye, Book, Wrench } from 'lucide-react';

interface SettingsPageProps {
  userStats: UserStats;
  onSave: (name: string, avatar: string, learningStyle: LearningStyle) => void;
  onBack: () => void;
}

// "Adventurer" style seeds from DiceBear
const AVATAR_SEEDS = ['Felix', 'Aneka', 'Zack', 'Molly', 'Bear', 'Bandit', 'Willow', 'Jasper', 'Max', 'Luna', 'Oscar', 'Ruby'];

export const SettingsPage: React.FC<SettingsPageProps> = ({ userStats, onSave, onBack }) => {
  const [name, setName] = useState(userStats.name);
  const [selectedAvatar, setSelectedAvatar] = useState(userStats.avatar || '');
  const [selectedStyle, setSelectedStyle] = useState<LearningStyle>(userStats.learningStyle || 'Practical');
  const [success, setSuccess] = useState(false);

  const getAvatarUrl = (seed: string) => `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, selectedAvatar, selectedStyle);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleAvatarSelect = (url: string) => {
    setSelectedAvatar(url);
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
        >
          &larr;
        </button>
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
           <p className="text-slate-500 text-sm">Update your public profile, avatar, and learning preferences.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Account Details Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Shield className="text-indigo-600" size={20} /> Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={userStats.email || 'guest@example.com'}
                            disabled
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed outline-none font-medium"
                        />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Account Role</label>
                     <div className="relative">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                             {userStats.role === 'teacher' ? <GraduationCap size={18} /> : <School size={18} />}
                         </div>
                         <input
                            type="text"
                            value={userStats.role.charAt(0).toUpperCase() + userStats.role.slice(1)}
                            disabled
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed outline-none font-medium"
                        />
                     </div>
                </div>
            </div>
        </div>

        {/* Learning Style Section (NEW) */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Brain className="text-indigo-600" size={20} /> Learning Style
           </h2>
           <p className="text-sm text-slate-500 mb-4">Our AI adapts explanations based on how you prefer to learn.</p>
           
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                  { id: 'Visual', icon: <Eye size={18} /> },
                  { id: 'Practical', icon: <Wrench size={18} /> },
                  { id: 'Theoretical', icon: <Book size={18} /> }
              ].map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedStyle(style.id as LearningStyle)}
                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        selectedStyle === style.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                      {style.icon}
                      <span>{style.id}</span>
                  </button>
              ))}
           </div>
        </div>

        {/* Name Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <User className="text-indigo-600" size={20} /> Personal Info
           </h2>
           <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 font-medium"
                placeholder="Enter your display name"
                required
              />
              <p className="text-xs text-slate-400 mt-2">This is how you will appear on leaderboards and in classes.</p>
           </div>
        </div>

        {/* Avatar Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} /> Choose Avatar
              </h2>
              {selectedAvatar && (
                 <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <img src={selectedAvatar} alt="Selected" className="w-5 h-5 rounded-full" />
                    <span>Selected</span>
                 </div>
              )}
           </div>

           <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {AVATAR_SEEDS.map((seed) => {
                 const url = getAvatarUrl(seed);
                 const isSelected = selectedAvatar === url;
                 return (
                   <button
                     key={seed}
                     type="button"
                     onClick={() => handleAvatarSelect(url)}
                     className={`relative rounded-xl overflow-hidden transition-all duration-200 aspect-square group ${
                        isSelected 
                        ? 'ring-4 ring-indigo-500 ring-offset-2 scale-105' 
                        : 'hover:scale-105 ring-1 ring-slate-100'
                     }`}
                   >
                     <img 
                       src={url} 
                       alt={seed} 
                       className="w-full h-full object-cover bg-slate-50"
                     />
                     {isSelected && (
                       <div className="absolute inset-0 bg-indigo-900/10 flex items-center justify-center">
                          <div className="bg-indigo-600 text-white p-1 rounded-full shadow-sm">
                             <Check size={16} strokeWidth={3} />
                          </div>
                       </div>
                     )}
                   </button>
                 );
              })}
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
           <button 
             type="submit"
             className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
           >
             <Save size={18} /> Save Changes
           </button>
           
           {success && (
              <span className="text-emerald-600 font-medium animate-in fade-in slide-in-from-left-2 flex items-center gap-2">
                 <Check size={18} /> Saved successfully!
              </span>
           )}
        </div>
      </form>
    </div>
  );
};
