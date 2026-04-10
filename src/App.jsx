import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { Users, BookOpen, Ticket, PlusCircle, LayoutDashboard, ClipboardCheck, Trophy, Copy, CheckCircle, Trash2, LogOut, PlayCircle, ChevronLeft, User, Lock, Phone, Heart, BarChart3, Clock, FileText, Video, Download, Plus, Settings, Filter, Beaker, Atom, Sparkles, Image as ImageIcon, Upload, Check, Eye, Link as LinkIcon, Zap, Radiation, Microscope } from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyB62pVLYvF5nz3Al_7gUObhquwRCk7u9Ug",
  authDomain: "my-project-7a829.firebaseapp.com",
  projectId: "my-project-7a829",
  storageBucket: "my-project-7a829.appspot.com",
  messagingSenderId: "886956896190",
  appId: "1:886956896190:web:d2eeaad2fd10780ed553ef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'admin@salama.com') {
        setUser(user);
        setView('admin_dashboard');
      } else {
        setUser(null);
        setView('login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPass);
    } catch (err) {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
    </div>
  );

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0f172a] border border-blue-900/50 p-8 rounded-2xl text-center">
          <h1 className="text-2xl font-bold text-white mb-8">منصة المستر محمد سلامة</h1>
          <button 
            onClick={() => setView('admin_auth')}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition"
          >
            دخول الإدارة
          </button>
        </div>
      </div>
    );
  }

  if (view === 'admin_auth') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <form onSubmit={handleAdminLogin} className="max-w-md w-full bg-[#0f172a] border border-blue-900/50 p-8 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">تسجيل دخول الإدارة</h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <input 
            type="email" placeholder="البريد الإلكتروني" 
            className="w-full bg-[#1e293b] border border-blue-900/50 p-3 rounded-lg mb-4 text-white"
            value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="كلمة السر" 
            className="w-full bg-[#1e293b] border border-blue-900/50 p-3 rounded-lg mb-6 text-white"
            value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
          />
          <button className="w-full bg-blue-600 py-3 rounded-lg font-bold">دخول</button>
          <button type="button" onClick={() => setView('login')} className="w-full mt-4 text-gray-400">رجوع</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-8 text-center">
      <h1 className="text-3xl font-bold text-white">أهلاً بك في لوحة تحكم الإدارة يا مستر محمد! 🚀</h1>
      <p className="mt-4 text-blue-300">لقد نجحت في بناء منصتك الخاصة.</p>
      <button onClick={() => auth.signOut()} className="mt-8 bg-red-600 px-6 py-2 rounded-lg">تسجيل خروج</button>
    </div>
  );
}
