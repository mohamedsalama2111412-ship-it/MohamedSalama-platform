import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Users, BookOpen, Zap, LogOut, LayoutDashboard, PlusCircle, Trash2, CheckCircle } from 'lucide-react';

// البيانات الحقيقية من صورتك يا مستر محمد
const firebaseConfig = {
  apiKey: "AIzaSyD9BPWwptbDa_DyIETLe_DrCKCOhU4HsEc",
  authDomain: "my-project-7a829.firebaseapp.com",
  projectId: "my-project-7a829",
  storageBucket: "my-project-7a829.firebasestorage.app",
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
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
     if (user && user.email === 'mohamed@test.com') {
  setUser(user);
  setView('admin_dashboard');
}
      } else {
        setUser(null);
        setView('login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setError('بيانات الدخول غير صحيحة، تأكد من الإيميل والباسورد في فايربيز');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
    </div>
  );

  if (view === 'login' || view === 'admin_auth') {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-[#0f172a] border border-blue-900/50 p-8 rounded-2xl shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-2 text-center">منصة المستر محمد سلامة</h1>
          <p className="text-blue-400 text-sm text-center mb-8 font-medium">لوحة تحكم الإدارة</p>
          
          {error && <p className="bg-red-500/10 text-red-500 border border-red-500/50 p-3 rounded-lg mb-6 text-sm text-center">{error}</p>}
          
          <div className="space-y-4">
            <input 
              type="email" placeholder="البريد الإلكتروني" 
              className="w-full bg-[#1e293b] border border-blue-900/30 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" placeholder="كلمة السر" 
              className="w-full bg-[#1e293b] border border-blue-900/30 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition"
              value={pass} onChange={(e) => setPass(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all active:scale-95">
              دخول الإدارة
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 bg-[#0f172a] p-6 rounded-2xl border border-blue-900/30">
          <div>
            <h1 className="text-2xl font-bold">أهلاً بك يا مستر محمد 👋</h1>
            <p className="text-blue-400 text-sm">لوحة تحكم المنصة جاهزة للعمل</p>
          </div>
          <button onClick={() => auth.signOut()} className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition">
            <LogOut size={18} /> خروج
          </button>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-blue-900/30 text-center">
            <BookOpen className="mx-auto text-blue-500 mb-4" size={32} />
            <h3 className="font-bold">الحصص</h3>
            <p className="text-2xl mt-2">0</p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-blue-900/30 text-center">
            <Users className="mx-auto text-purple-500 mb-4" size={32} />
            <h3 className="font-bold">الطلاب</h3>
            <p className="text-2xl mt-2">0</p>
          </div>
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-blue-900/30 text-center">
            <CheckCircle className="mx-auto text-green-500 mb-4" size={32} />
            <h3 className="font-bold">الأكواد المباعة</h3>
            <p className="text-2xl mt-2">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
