
import React, { useState, useEffect } from 'react';
import { GraduationCap, Sparkles, Plus, Calendar, Users, X, FileText, Copy, Check, School, Layers, BookOpen, User, Upload, Download, Eye, Clock, ArrowLeft, MoreVertical, Settings } from 'lucide-react';
import { UserStats, Assignment, Classroom } from '../types';
import { db } from '../services/db';

interface TeacherDashboardProps {
  userStats: UserStats;
}

type Tab = 'overview' | 'classrooms' | 'assignments';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ userStats }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Data State
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showStudentListModal, setShowStudentListModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Assignment Form
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedClassroomId, setSelectedClassroomId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0); // To force reset file input

  // Class Form
  const [className, setClassName] = useState('');
  const [classDesc, setClassDesc] = useState('');

  // Student List State
  const [selectedClassroomForStudents, setSelectedClassroomForStudents] = useState<Classroom | null>(null);
  const [studentList, setStudentList] = useState<UserStats[]>([]);

  // Submissions State
  const [selectedAssignmentForReview, setSelectedAssignmentForReview] = useState<Assignment | null>(null);

  useEffect(() => {
    // Load Data
    const myAssignments = db.getAssignments(userStats.id); 
    const myClassrooms = db.getClassroomsForTeacher(userStats.id);
    
    setAssignments(myAssignments.reverse());
    setClassrooms(myClassrooms.reverse());
    
    // Default selection
    if (myClassrooms.length > 0) {
        setSelectedClassroomId(myClassrooms[0].id);
    }
  }, [userStats.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // FILE SIZE CHECK: 500KB
      if (e.target.files[0].size > 500 * 1024) {
         alert("File too large. For this demo, please upload files smaller than 500KB.");
         return;
      }
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !dueDate || !selectedClassroomId) return;

    const targetClass = classrooms.find(c => c.id === selectedClassroomId);
    
    let attachmentUrl = undefined;
    let attachmentName = undefined;

    if (selectedFile) {
        // Convert to Base64 for demo purposes
        const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(selectedFile);
        });
        attachmentUrl = base64;
        attachmentName = selectedFile.name;
    }

    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      topic,
      difficulty,
      dueDate,
      classroomId: selectedClassroomId,
      className: targetClass ? targetClass.name : 'Unknown Class',
      teacherId: userStats.id, // Use ID, not name for robustness
      createdAt: new Date().toISOString(),
      status: 'pending',
      submissions: [],
      attachmentUrl,
      attachmentName
    };

    db.createAssignment(newAssignment);
    setAssignments(prev => [newAssignment, ...prev]);
    setShowAssignModal(false);
    
    // Reset form
    setTopic('');
    setDifficulty('Medium');
    setDueDate('');
    setSelectedFile(null);
    setFileInputKey(prev => prev + 1); // Force clear input
  };

  const handleCreateClass = (e: React.FormEvent) => {
      e.preventDefault();
      if (!className) return;

      const newClass = db.createClassroom(className, classDesc, userStats.id);
      setClassrooms(prev => [newClass, ...prev]);
      setShowCreateClassModal(false);
      setClassName('');
      setClassDesc('');
  };

  const handleViewStudents = (classroom: Classroom) => {
      setSelectedClassroomForStudents(classroom);
      // Fetch user details
      const students = db.getUsersByIds(classroom.studentIds);
      setStudentList(students);
      setShowStudentListModal(true);
  };

  const handleViewSubmissions = (assignment: Assignment) => {
      setSelectedAssignmentForReview(assignment);
      setShowSubmissionsModal(true);
  };

  const copyToClipboard = (code: string) => {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative pb-12">
      {/* Teacher Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Teacher Mode</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {userStats.name}</h1>
            <p className="text-indigo-100 max-w-lg">Manage your digital classroom, track student progress, and distribute AI-powered assignments.</p>
          </div>
          
          <div className="flex gap-3">
             <button 
                onClick={() => setShowCreateClassModal(true)}
                className="bg-white text-indigo-900 px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-50 transition-all flex items-center gap-2 active:scale-95"
              >
                <Plus size={20} />
                Create Class
              </button>
              <button 
                onClick={() => setShowAssignModal(true)}
                className="bg-indigo-600 border border-indigo-400 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <FileText size={20} />
                Assign Quiz
              </button>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute right-[-20px] top-[-40px] opacity-10 rotate-12">
          <GraduationCap size={300} />
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
               <Users size={24} />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Students</p>
               <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                  {classrooms.reduce((acc, c) => acc + c.studentIds.length, 0)}
               </h3>
            </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
               <School size={24} />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Classes</p>
               <h3 className="text-2xl font-black text-slate-800 dark:text-white">{classrooms.length}</h3>
            </div>
         </div>

         <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
               <Layers size={24} />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Pending Assignments</p>
               <h3 className="text-2xl font-black text-slate-800 dark:text-white">{assignments.length}</h3>
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
         {/* Navigation Tabs */}
         <div className="flex border-b border-slate-200 dark:border-slate-700">
             <button 
               onClick={() => setActiveTab('overview')}
               className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
               Recent Activity
             </button>
             <button 
               onClick={() => setActiveTab('classrooms')}
               className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'classrooms' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
               My Classrooms
             </button>
             <button 
               onClick={() => setActiveTab('assignments')}
               className={`px-6 py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'assignments' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
               All Assignments
             </button>
         </div>

         {/* Content: Overview & Assignments Table */}
         {(activeTab === 'overview' || activeTab === 'assignments') && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
                      <FileText className="text-indigo-500" size={20} /> 
                      {activeTab === 'overview' ? 'Recent Assignments' : 'Assignment History'}
                   </h3>
                </div>
                
                {assignments.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                             <FileText size={32} />
                        </div>
                        <h4 className="font-bold text-slate-700 dark:text-slate-300">No assignments created</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">Get started by assigning a quiz to your class.</p>
                        <button 
                            onClick={() => setShowAssignModal(true)}
                            className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                            Create First Assignment
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                       <table className="w-full text-left">
                          <thead className="bg-slate-50 dark:bg-slate-700/50 text-xs uppercase text-slate-500 dark:text-slate-400 font-bold">
                             <tr>
                                <th className="px-6 py-4">Topic</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4">Submissions</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                             {(activeTab === 'overview' ? assignments.slice(0, 5) : assignments).map(assign => (
                                <tr key={assign.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                   <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs
                                            ${assign.difficulty === 'Easy' ? 'bg-emerald-500' : assign.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}
                                         `}>
                                            {assign.difficulty[0]}
                                         </div>
                                         <div>
                                            <div className="font-bold text-slate-800 dark:text-white text-sm">{assign.topic}</div>
                                            {assign.attachmentUrl && <div className="text-[10px] text-indigo-500 flex items-center gap-1 mt-0.5"><FileText size={10} /> PDF Attached</div>}
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                      {assign.className}
                                   </td>
                                   <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                      {new Date(assign.dueDate).toLocaleDateString()}
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                         {assign.submissions.length} Students
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                      <button 
                                         onClick={() => handleViewSubmissions(assign)}
                                         className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold flex items-center justify-end gap-1 ml-auto"
                                      >
                                         <Eye size={16} /> Review
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                )}
            </div>
         )}

         {/* Content: Classrooms Grid */}
         {(activeTab === 'overview' || activeTab === 'classrooms') && (
             <div className="space-y-4">
                {activeTab === 'classrooms' && (
                     <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Your Classrooms</h3>
                        <button 
                            onClick={() => setShowCreateClassModal(true)}
                            className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline flex items-center gap-1"
                        >
                            <Plus size={16} /> Add New
                        </button>
                     </div>
                )}
                
                {activeTab === 'overview' && (
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2 mt-8">
                       <School className="text-indigo-500" size={20} /> Active Classrooms
                    </h3>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classrooms.map(room => (
                        <div key={room.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                            {/* Card Header */}
                            <div className={`h-28 bg-gradient-to-br p-6 flex flex-col justify-end
                                ${room.theme === 'indigo' ? 'from-indigo-500 to-violet-600' : 
                                  room.theme === 'emerald' ? 'from-emerald-500 to-teal-600' :
                                  room.theme === 'rose' ? 'from-rose-500 to-pink-600' :
                                  room.theme === 'amber' ? 'from-amber-500 to-orange-600' :
                                  'from-sky-500 to-blue-600'
                                }
                            `}>
                                <h3 className="text-xl font-bold text-white tracking-tight">{room.name}</h3>
                                <p className="text-white/80 text-xs font-medium">{room.studentIds.length} Students Enrolled</p>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-center mb-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase font-bold text-slate-400">Class Code</span>
                                        <span className="font-mono text-lg font-bold text-slate-800 dark:text-white tracking-widest">{room.code}</span>
                                    </div>
                                    <button 
                                        onClick={() => copyToClipboard(room.code)}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-600 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors"
                                        title="Copy Code"
                                    >
                                        {copiedCode === room.code ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                                
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
                                    {room.description || "No description provided."}
                                </p>

                                <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button 
                                        onClick={() => handleViewStudents(room)}
                                        className="py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Users size={14} /> Students
                                    </button>
                                    <button className="py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <Settings size={14} /> Settings
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Add New Classroom Card */}
                    <button 
                        onClick={() => setShowCreateClassModal(true)}
                        className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group min-h-[300px]"
                    >
                        <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-300 dark:text-slate-500 group-hover:scale-110 transition-transform">
                             <Plus size={32} />
                        </div>
                        <h3 className="font-bold text-slate-600 dark:text-slate-300">Create New Class</h3>
                    </button>
                </div>
             </div>
         )}
      </div>

      {/* --- MODALS --- */}

      {/* CREATE CLASS MODAL */}
      {showCreateClassModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create New Classroom</h2>
                <button onClick={() => setShowCreateClassModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateClass} className="space-y-4">
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Class Name</label>
                    <input 
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      placeholder="e.g. Intro to Computer Science"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description (Optional)</label>
                    <textarea 
                      value={classDesc}
                      onChange={(e) => setClassDesc(e.target.value)}
                      placeholder="e.g. MWF 10:00 AM - Semester 1"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none h-24"
                    />
                 </div>

                 <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-sm flex gap-3">
                     <Sparkles className="shrink-0" size={20} />
                     <p>We'll automatically generate a unique 6-character code that you can share with your students to join.</p>
                 </div>

                 <div className="pt-4 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateClassModal(false)}
                      className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!className}
                      className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                      Create Class
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* STUDENT LIST MODAL */}
      {showStudentListModal && selectedClassroomForStudents && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] border border-slate-100 dark:border-slate-700">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedClassroomForStudents.name}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Enrolled Students ({studentList.length})</p>
                </div>
                <button onClick={() => setShowStudentListModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                  {studentList.length === 0 ? (
                      <div className="text-center py-10">
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                              <Users size={32} />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400">No students have joined this class yet.</p>
                          <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Share code <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{selectedClassroomForStudents.code}</span> with them.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {studentList.map((student, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                  <div className="shrink-0">
                                      {student.avatar ? (
                                          <img src={student.avatar} alt={student.name} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-600" />
                                      ) : (
                                          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-slate-200 dark:border-slate-600">
                                              {student.name.charAt(0).toUpperCase()}
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-slate-800 dark:text-white truncate">{student.name}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{student.email || 'No email'}</p>
                                  </div>
                                  <div className="text-right">
                                      <span className="block text-sm font-bold text-indigo-600 dark:text-indigo-400">Lvl {student.level}</span>
                                      <span className="text-xs text-slate-400 dark:text-slate-500">{student.totalXp.toLocaleString()} XP</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 text-center">
                  <button 
                    onClick={() => setShowStudentListModal(false)}
                    className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 text-sm"
                  >
                      Close
                  </button>
              </div>
           </div>
        </div>
      )}

      {/* ASSIGN QUIZ MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Assign Quiz / Worksheet</h2>
                <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              {classrooms.length === 0 ? (
                  <div className="text-center py-6">
                      <p className="text-slate-500 dark:text-slate-400 mb-4">You need to create a classroom first!</p>
                      <button 
                        onClick={() => { setShowAssignModal(false); setShowCreateClassModal(true); }}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold"
                      >
                          Create Classroom
                      </button>
                  </div>
              ) : (
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Classroom</label>
                        <select 
                            value={selectedClassroomId}
                            onChange={(e) => setSelectedClassroomId(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            required
                        >
                            {classrooms.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Topic</label>
                        <input 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Newton's Laws"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        required
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                        <select 
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as any)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                        </div>
                        <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                        <input 
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-600"
                            required
                        />
                        </div>
                    </div>

                    {/* PDF UPLOAD */}
                    <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-6 bg-indigo-50/50 dark:bg-indigo-900/10 text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                        <label className="cursor-pointer block">
                            <input 
                                key={fileInputKey}
                                type="file" 
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-full shadow-sm text-indigo-600 dark:text-indigo-400">
                                    <Upload size={24} />
                                </div>
                                <span className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">
                                    {selectedFile ? selectedFile.name : "Upload PDF Worksheet"}
                                </span>
                                <span className="text-indigo-500 dark:text-indigo-400 text-xs">
                                    {selectedFile ? "Click to change" : "Optional: Attach a file for students to download"}
                                </span>
                            </div>
                        </label>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                        type="button" 
                        onClick={() => setShowAssignModal(false)}
                        className="flex-1 py-3 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                        >
                        Cancel
                        </button>
                        <button 
                        type="submit"
                        className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
                        >
                        Assign
                        </button>
                    </div>
                </form>
              )}
           </div>
        </div>
      )}

      {/* SUBMISSIONS MODAL */}
      {showSubmissionsModal && selectedAssignmentForReview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh] border border-slate-100 dark:border-slate-700">
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 sticky top-0 z-10">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedAssignmentForReview.topic}</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Submissions Review</p>
                </div>
                <button onClick={() => setShowSubmissionsModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={24} />
                </button>
              </div>
              
              <div className="overflow-y-auto p-6 flex-1 custom-scrollbar">
                  {selectedAssignmentForReview.submissions.length === 0 ? (
                      <div className="text-center py-10">
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                              <FileText size={32} />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400">No students have submitted work yet.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {selectedAssignmentForReview.submissions.map((sub, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                  <div className="flex-1">
                                      <h4 className="font-bold text-slate-800 dark:text-white">{sub.studentName}</h4>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                          <Clock size={12} /> Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                                      </p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                      <div className="text-xs text-slate-500 dark:text-slate-400 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-lg truncate max-w-[150px]">
                                          {sub.fileName}
                                      </div>
                                      <a 
                                        href={sub.fileUrl} 
                                        download={sub.fileName}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                      >
                                          <Download size={14} /> Download PDF
                                      </a>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 text-center">
                  <button 
                    onClick={() => setShowSubmissionsModal(false)}
                    className="text-slate-500 dark:text-slate-400 font-bold hover:text-slate-700 dark:hover:text-slate-200 text-sm"
                  >
                      Close
                  </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
