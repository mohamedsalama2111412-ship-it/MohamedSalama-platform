import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { Users, BookOpen, Ticket, PlusCircle, LayoutDashboard, ClipboardCheck, Trophy, Copy, CheckCircle, Trash2, LogOut, PlayCircle, ChevronLeft, User, Lock, Phone, Heart, BarChart3, Clock, FileText, Video, Download, Plus, Settings, Filter, Beaker, Atom, Sparkles, Image as ImageIcon, Upload, Check, Eye, Link as LinkIcon, Zap, Radiation, Microscope } from 'lucide-react';

// إعدادات فايربيز - تأكد من مطابقتها لمشروعك
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

// واجهة المنصة الرئيسية
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('login'); 
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsAdmin(user.email === 'admin@salama.com');
        setView(user.email === 'admin@salama.com' ? 'admin' : 'student');
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Error signing in anonymously:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
          <Zap className="w-16 h-16 text-blue-500 animate-pulse relative z-10" />
        </div>
        <p className="mt-6 text-blue-100 font-medium tracking-widest animate-pulse text-lg">جاري التحميل...</p>
      </div>
    );
  }

  // شاشة تسجيل الدخول البسيطة
  if (!user || (!isAdmin && view === 'login')) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0f172a] border border-blue-900/50 p-8 rounded-2xl shadow-2xl text-center">
          <h1 className="text-2xl font-bold text-white mb-6">منصة المستر محمد سلامة</h1>
          <button 
            onClick={() => setView('admin-login')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
          >
            دخول الإدارة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
      <h1 className="text-3xl font-bold">مرحباً بك يا مستر محمد! المنصة تعمل بنجاح.</h1>
    </div>
  );
}
