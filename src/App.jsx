import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithCustomToken,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, collection, 
  onSnapshot, addDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { 
  Users, BookOpen, Ticket, PlusCircle, LayoutDashboard, 
  ClipboardCheck, Trophy, Copy, CheckCircle, Trash2, 
  LogOut, PlayCircle, ChevronLeft, User, Lock, 
  Phone, Heart, BarChart3, Clock, FileText, Video, Download, Plus, Settings, Filter, Beaker, Atom, Sparkles, Image as ImageIcon, Upload, Check, Eye, Link as LinkIcon, Zap, Radiation, Microscope
} from 'lucide-react';

// --- إعدادات قاعدة البيانات الخاصة بك (تم الربط بنجاح) ---
const firebaseConfig = {
  apiKey: "AIzaSyB62pVLYvF5nz3Al_7gUObhquwRCk7u9Ug",
  authDomain: "my-project-7a829.firebaseapp.com",
  projectId: "my-project-7a829",
  storageBucket: "my-project-7a829.firebasestorage.app",
  messagingSenderId: "886956896190",
  appId: "1:886956896190:web:d2eeaad2fd10780ed553ef"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'my-project-7a829';

// --- خلفية المنصة المتحركة ---
const ScienceBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0f1e]">
    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
  </div>
);

const TabBtn = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 p-5 rounded-2xl font-black transition-all ${active ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.4)]' : 'text-white/40 hover:bg-white/5'}`}>
    {React.cloneElement(icon, { size: 22 })} {label}
  </button>
);

const SubjectBtn = ({ active, onClick, label, color }) => (
  <button onClick={onClick} className={`p-8 rounded-[35px] font-black text-2xl transition-all border-4 flex flex-col items-center gap-3 ${active ? `bg-${color}-600 border-${color}-400 text-white shadow-2xl scale-105` : 'bg-white/5 border-white/10 text-white/30 hover:text-white'}`}>
    {label}
  </button>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState('loading'); 
  const [codes, setCodes] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (err) { console.error("Auth Error:", err); }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        if (firebaseUser.email === 'admin@salama.com') {
           setProfile({ name: "مستر محمد سلامة", role: "admin" });
           setView('dashboard');
           return;
        }

        const profileRef = doc(db, 'artifacts', appId, 'users', firebaseUser.uid, 'profile', 'info');
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
          setView('dashboard');
        } else { setView('entry'); }
      } else { setUser(null); setView('loading'); }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'codes'), (s) => setCodes(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'lessons'), (s) => setLessons(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'exams'), (s) => setExams(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'questions'), (s) => setQuestions(s.docs.map(d => ({id: d.id, ...d.data()}))));
    onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'student_results'), (s) => setAllResults(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [user]);

  const handleSignup = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const p = { uid: user.uid, name: f.get('name'), phone: f.get('phone'), parentPhone: f.get('parentPhone'), grade: f.get('grade'), role: 'student', createdAt: new Date().toISOString() };
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'info'), p);
    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'student_lookup', p.phone), p);
    setProfile(p); setView('dashboard');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    const password = e.target.password.value;
    const email = "admin@salama.com";

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAdminError("بيانات الدخول خاطئة أو الحساب غير مفعل!");
    }
  };

  const handleParentLogin = async (e) => {
    e.preventDefault();
    const phone = e.target.phone.value;
    const docSnap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'student_lookup', phone));
    if (docSnap.exists()) {
      setProfile({ ...docSnap.data(), role: 'parent' });
      setView('dashboard');
    } else alert("رقم ولي الأمر غير مسجل!");
  };

  const handleLogout = async () => {
    await signOut(auth);
    setProfile(null);
    setView('entry');
  };

  if (view === 'loading') return (
    <div className="h-screen bg-[#0a0f1e] flex flex-col items-center justify-center gap-6">
       <ScienceBackground />
       <Zap className="text-blue-500 animate-pulse" size={48} />
       <p className="text-blue-400 font-black text-xl tracking-[0.2em] animate-pulse">جاري التحميل...</p>
    </div>
  );

  if (['entry', 'signup', 'admin_login', 'parent_login'].includes(view)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans text-right text-white" dir="rtl">
        <ScienceBackground />
        <div className="max-w-xl w-full backdrop-blur-3xl bg-white/5 rounded-[50px] shadow-2xl border border-white/10 animate-in zoom-in duration-500">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-10 text-center rounded-t-[50px] relative overflow-hidden">
            
            <div className="relative w-32 h-32 mx-auto mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
              <img 
                src="https://i.postimg.cc/fbK1fqTf/Untitled-design.jpg"
                alt="مستر محمد سلامة" 
                className="relative w-full h-full rounded-full border-4 border-white/20 shadow-2xl object-cover z-10 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-1 right-1 bg-blue-500 border-4 border-[#1e3a8a] rounded-full p-1.5 z-20 shadow-lg" title="حساب موثق">
                <Check size={16} className="text-white" strokeWidth={4} />
              </div>
            </div>

            <h1 className="text-4xl font-black italic tracking-tighter mb-2">محمد سلامة</h1>
            <p className="opacity-80 text-sm font-black mt-2">لا أبرح حتى أبلغ</p>
          </div>
          <div className="p-10 space-y-6">
            {view === 'entry' && (
              <>
                <button onClick={() => setView('signup')} className="w-full bg-white text-slate-900 p-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-xl"><User /> أنا طالب جديد</button>
                <button onClick={() => setView('parent_login')} className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all hover:bg-white/10"><Heart className="text-rose-500" /> أنا ولي أمر</button>
                <button onClick={() => setView('admin_login')} className="w-full text-blue-400 font-bold text-sm mt-4 text-center underline">دخول الإدارة</button>
              </>
            )}
            {view === 'admin_login' && (
              <form className="space-y-5" onSubmit={handleAdminLogin}>
                <h3 className="text-center font-black text-2xl">دخول المعلم</h3>
                {adminError && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-center font-bold text-sm">
                    {adminError}
                  </div>
                )}
                <input name="password" type="password" required placeholder="كلمة السر" className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl text-center outline-none focus:border-blue-500" />
                <button type="submit" className="w-full bg-blue-600 p-5 rounded-3xl font-black text-xl shadow-xl">دخول</button>
                <button type="button" onClick={() => { setView('entry'); setAdminError(''); }} className="w-full text-slate-500 font-bold text-sm">رجوع</button>
              </form>
            )}
            {view === 'parent_login' && (
              <form className="space-y-5" onSubmit={handleParentLogin}>
                <h3 className="text-center font-black text-2xl">دخول ولي الأمر</h3>
                <input name="phone" required placeholder="01xxxxxxxxx" className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl text-center font-black text-2xl outline-none focus:border-blue-500" />
                <button type="submit" className="w-full bg-rose-600 p-5 rounded-3xl font-black text-xl shadow-xl shadow-rose-900/20">عرض نتائج ابني</button>
                <button type="button" onClick={() => setView('entry')} className="w-full text-slate-500 font-bold text-sm">رجوع</button>
              </form>
            )}
            {view === 'signup' && (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-5" onSubmit={handleSignup}>
                <div className="md:col-span-2"><input name="name" required placeholder="الاسم رباعي" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" /></div>
                <input name="phone" required placeholder="موبايل الطالب" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" />
                <input name="parentPhone" required placeholder="موبايل ولي الأمر" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" />
                <div className="md:col-span-2"><select name="grade" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold outline-none"><option value="1">1 ثانوي</option><option value="2">2 ثانوي</option><option value="3">3 ثانوي</option></select></div>
                <button type="submit" className="md:col-span-2 bg-blue-600 p-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-900/20">إنشاء حساب 🚀</button>
                <button type="button" onClick={() => setView('entry')} className="md:col-span-2 text-slate-500 font-bold text-sm">رجوع</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return profile.role === 'admin' 
    ? <AdminLayout profile={profile} codes={codes} lessons={lessons} exams={exams} questions={questions} results={allResults} logout={handleLogout} />
    : profile.role === 'parent'
    ? <ParentLayout profile={profile} results={allResults} logout={handleLogout} />
    : <StudentLayout profile={profile} user={user} lessons={lessons} exams={exams} codes={codes} questions={questions} logout={handleLogout} />;
}

function AdminLayout({ profile, codes, lessons, exams, questions, results, logout }) {
  const [tab, setTab] = useState('lessons'); 
  const [selGrade, setSelGrade] = useState('1');
  const [qType, setQType] = useState('text');
  const [pastedImg, setPastedImg] = useState(null);

  const addLesson = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const grade = f.get('grade');
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'lessons'), { 
      title: f.get('title'), 
      grade, 
      subject: grade === '1' ? 'integrated' : f.get('subject'), 
      examId: f.get('examId') || '', 
      videoUrl: f.get('videoUrl') || '', 
      createdAt: serverTimestamp() 
    });
    alert("تم النشر بنجاح!"); e.target.reset();
  };

  const addExam = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const grade = f.get('grade');
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'exams'), {
      title: f.get('title'), grade, subject: grade === '1' ? 'integrated' : f.get('subject'),
      createdAt: serverTimestamp()
    });
    alert("تم إنشاء الامتحان بنجاح!"); e.target.reset();
  };

  const addQuestion = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const qData = { examId: f.get('examId'), type: qType, correctAnswer: f.get('ans'), createdAt: serverTimestamp() };
    if (qType === 'text') qData.text = f.get('qText');
    else { if (!pastedImg) return alert("لصق الصورة أولاً!"); qData.imageUrl = pastedImg; }
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'questions'), qData);
    alert("تم إضافة السؤال بنجاح!"); setPastedImg(null); e.target.reset();
  };

  const handleGenCodes = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const count = parseInt(f.get('count'));
    const grade = f.get('grade');
    const subject = grade === '1' ? 'integrated' : f.get('subject');
    const target = f.get('target');
    const validityDays = parseInt(f.get('validityDays')) || 30;
    const subPrefix = subject === 'physics' ? 'PHY' : subject === 'chemistry' ? 'CHM' : 'SCI';

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + validityDays);

    for (let i = 0; i < count; i++) {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'codes'), {
        code: `MS${grade}-${subPrefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        grade, subject, target, status: 'Unused', createdAt: new Date().toISOString(), expiresAt: expiresAt.toISOString()
      });
    }
    alert(`تم توليد ${count} كود بنجاح!`);
    e.target.reset();
  };

  useEffect(() => {
    const onPaste = (e) => {
      if (tab !== 'questions' || qType !== 'image') return;
      const item = e.clipboardData.items[0];
      if (item?.type.indexOf('image') !== -1) {
        const reader = new FileReader();
        reader.onload = (ev) => setPastedImg(ev.target.result);
        reader.readAsDataURL(item.getAsFile());
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [tab, qType]);

  return (
    <div className="flex h-screen bg-[#0a0f1e] font-sans text-right text-white" dir="rtl">
      <aside className="w-80 bg-[#0f172a] p-8 flex flex-col border-l border-white/5 shadow-2xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity"></div>
            <img 
              src="https://i.postimg.cc/fbK1fqTf/Untitled-design.jpg"
              alt="مستر محمد سلامة" 
              className="relative w-14 h-14 rounded-full border-2 border-white/20 object-cover shadow-lg z-10 transition-transform group-hover:scale-105"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-[#0f172a] rounded-full w-3.5 h-3.5 z-20"></div>
          </div>
          <h2 className="text-2xl font-black text-blue-400">الإدارة</h2>
        </div>
        <nav className="flex-1 space-y-3">
          <TabBtn active={tab==='lessons'} onClick={()=>setTab('lessons')} icon={<PlusCircle/>} label="إضافة محتوى" />
          <TabBtn active={tab==='exams'} onClick={()=>setTab('exams')} icon={<PlusCircle/>} label="إنشاء امتحان" />
          <TabBtn active={tab==='questions'} onClick={()=>setTab('questions')} icon={<ClipboardCheck/>} label="إضافة أسئلة" />
          <TabBtn active={tab==='results'} onClick={()=>setTab('results')} icon={<BarChart3/>} label="النتائج" />
          <TabBtn active={tab==='codes'} onClick={()=>setTab('codes')} icon={<Ticket/>} label="الأكواد" />
        </nav>
        <button onClick={logout} className="p-4 text-red-400 font-bold mt-auto flex items-center gap-2 hover:bg-red-500/10 rounded-xl transition-all"><LogOut /> خروج</button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <ScienceBackground />
        {tab === 'lessons' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom">
            <h2 className="text-3xl font-black">نشر حصة / واجب جديد</h2>
            <form className="backdrop-blur-3xl bg-white/5 p-10 rounded-[40px] border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={addLesson}>
               <div className="md:col-span-2"><label className="text-xs font-bold text-white/30 block mb-2 mr-2">عنوان الحصة</label><input name="title" required className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" /></div>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">الصف</label><select name="grade" onChange={(e)=>setSelGrade(e.target.value)} className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl outline-none"><option value="1">1 ثانوي</option><option value="2">2 ثانوي</option><option value="3">3 ثانوي</option></select></div>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">المادة</label>{selGrade === '1' ? <div className="p-4 bg-purple-600/20 text-purple-400 rounded-2xl font-bold text-center">علوم متكاملة</div> : <select name="subject" className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl outline-none"><option value="physics">فيزياء</option><option value="chemistry">كيمياء</option></select>}</div>
               <div className="md:col-span-2"><label className="text-xs font-bold text-white/30 block mb-2 mr-2">ربط امتحان (اختياري)</label><select name="examId" className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl outline-none font-bold text-blue-400"><option value="">بدون امتحان</option>{exams.filter(ex => ex.grade === selGrade).map(ex => <option key={ex.id} value={ex.id}>{ex.title} ({ex.subject})</option>)}</select></div>
               <div className="md:col-span-2"><label className="text-xs font-bold text-white/30 block mb-2 mr-2">رابط الفيديو (YouTube/Bunny)</label><input name="videoUrl" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" /></div>
               <button type="submit" className="md:col-span-2 bg-blue-600 p-5 rounded-3xl font-black text-xl shadow-xl shadow-blue-900/30">نشر المحتوى للطالب 🚀</button>
            </form>
          </div>
        )}

        {tab === 'exams' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom">
            <h2 className="text-3xl font-black text-green-400">إنشاء وعاء امتحاني جديد</h2>
            <form className="backdrop-blur-3xl bg-white/5 p-10 rounded-[40px] border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={addExam}>
               <div className="md:col-span-2"><label className="text-xs font-bold text-white/30 block mb-2 mr-2">اسم الامتحان (مثلاً: اختبار الشهر)</label><input name="title" required className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none" /></div>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">الصف</label><select name="grade" onChange={(e)=>setSelGrade(e.target.value)} className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl outline-none"><option value="1">1ث</option><option value="2">2ث</option><option value="3">3ث</option></select></div>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">المادة</label>{selGrade === '1' ? <div className="p-4 bg-purple-600/20 text-purple-400 rounded-2xl font-bold text-center">علوم متكاملة</div> : <select name="subject" className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl outline-none"><option value="physics">فيزياء</option><option value="chemistry">كيمياء</option></select>}</div>
               <button type="submit" className="md:col-span-2 bg-green-600 p-5 rounded-3xl font-black text-xl shadow-xl shadow-green-900/30">حفظ الامتحان في القاعدة</button>
            </form>
          </div>
        )}

        {tab === 'questions' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom">
            <div className="flex justify-between items-center">
               <h2 className="text-3xl font-black text-blue-400">إضافة أسئلة للامتحانات</h2>
               <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                 <button onClick={()=>setQType('text')} className={`px-8 py-2 rounded-xl font-bold ${qType==='text'?'bg-blue-600 text-white shadow-lg':'text-white/40'}`}>نص</button>
                 <button onClick={()=>setQType('image')} className={`px-8 py-2 rounded-xl font-bold ${qType==='image'?'bg-blue-600 text-white shadow-lg':'text-white/40'}`}>صورة</button>
               </div>
            </div>
            <form className="backdrop-blur-3xl bg-white/5 p-10 rounded-[40px] border border-white/10" onSubmit={addQuestion}>
               <div className="mb-6"><label className="text-xs font-bold text-white/30 block mb-2 mr-2">اختر الامتحان:</label><select name="examId" required className="w-full p-4 bg-[#0f172a] border-2 border-blue-600/20 rounded-3xl font-black text-blue-400">{exams.map(ex => <option key={ex.id} value={ex.id}>{ex.title} ({ex.grade}ث - {ex.subject})</option>)}</select></div>
               {qType === 'text' ? <textarea name="qText" required placeholder="اكتب السؤال هنا..." className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl h-32 mb-6 text-right outline-none"></textarea> : 
               <div className="mb-6 border-4 border-dashed border-white/10 rounded-[40px] p-12 text-center bg-white/5">
                 {pastedImg ? <img src={pastedImg} className="max-h-64 mx-auto rounded-3xl shadow-2xl border-4 border-white/10" /> : <div className="text-white/20 font-black text-xl flex flex-col items-center gap-4"><ImageIcon size={48}/><p>اضغط Ctrl+V للصق صورة السؤال من جهازك</p></div>}
               </div>}
               <p className="text-center font-black mb-6 text-white/50 tracking-widest">حدد الإجابة الصحيحة:</p>
               <div className="flex justify-center gap-6 mb-10">{['أ','ب','ج','د'].map(opt => <label key={opt} className="cursor-pointer group"><input type="radio" name="ans" value={opt} required className="hidden peer" /><div className="w-16 h-16 rounded-full border-4 border-white/10 flex items-center justify-center font-black text-2xl text-white/20 peer-checked:bg-green-600 peer-checked:text-white peer-checked:border-green-400 transition-all shadow-xl group-hover:scale-110">{opt}</div></label>)}</div>
               <button type="submit" className="w-full bg-blue-600 p-5 rounded-3xl font-black text-2xl shadow-xl shadow-blue-900/30">إضافة السؤال للبنك ✨</button>
            </form>
          </div>
        )}

        {tab === 'results' && (
           <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom">
              <header className="flex justify-between items-center"><h2 className="text-3xl font-black text-white">سجل نتائج الطلاب</h2><div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-bold">{results.length} نتيجة</div></header>
              <div className="backdrop-blur-3xl bg-white/5 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                 <table className="w-full text-right">
                    <thead className="bg-white/10 border-b border-white/10"><tr><th className="p-6 font-black">اسم الطالب</th><th className="p-6 font-black text-center">الامتحان</th><th className="p-6 font-black text-center">الدرجة</th></tr></thead>
                    <tbody className="divide-y divide-white/5">
                       {results.sort((a,b)=>b.timestamp?.seconds - a.timestamp?.seconds).map(res => (
                         <tr key={res.id} className="hover:bg-white/5 transition-all"><td className="p-6 font-bold">{res.studentName}</td><td className="p-6 text-center text-xs text-white/50">{res.examTitle} ({res.subject})</td><td className="p-6 text-center font-black text-blue-400 text-2xl">{res.score}%</td></tr>
                       ))}
                    </tbody>
                 </table>
                 {results.length === 0 && <p className="text-center py-20 text-white/20 font-black italic">لا توجد نتائج مسجلة حتى الآن.</p>}
              </div>
           </div>
        )}

        {tab === 'codes' && (
          <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom">
            <h2 className="text-3xl font-black text-blue-400">نظام الأكواد المشفرة</h2>
            <form className="backdrop-blur-3xl bg-white/5 p-10 rounded-[40px] border border-white/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end" onSubmit={handleGenCodes}>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">الصف</label><select name="grade" onChange={(e)=>setSelGrade(e.target.value)} className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl outline-none"><option value="1">1ث</option><option value="2">2ث</option><option value="3">3ث</option></select></div>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">المادة</label>{selGrade === '1' ? <div className="p-4 bg-purple-600/20 text-purple-400 rounded-2xl font-bold text-center">علوم متكاملة</div> : <select name="subject" className="w-full p-4 bg-[#0f172a] border border-white/10 rounded-2xl outline-none"><option value="physics">فيزياء</option><option value="chemistry">كيمياء</option></select>}</div>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">العدد</label><input name="count" type="number" defaultValue="10" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white" /></div>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">محتوى الكود</label><input name="target" required placeholder="مثلاً: شهر 10" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white" /></div>
               <div><label className="text-xs font-bold text-white/30 block mb-2 mr-2">الصلاحية (أيام)</label><input name="validityDays" type="number" defaultValue="30" min="1" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white" /></div>
               <button type="submit" className="md:col-span-5 bg-blue-600 p-5 rounded-3xl font-black text-xl shadow-xl shadow-blue-900/30 hover:bg-blue-500 transition-all text-white">توليد الأكواد 🚀</button>
            </form>

            <div className="backdrop-blur-3xl bg-white/5 rounded-[40px] border border-white/10 overflow-hidden shadow-2xl mt-8">
               <table className="w-full text-right">
                  <thead className="bg-white/10 border-b border-white/10"><tr><th className="p-6 font-black text-white">الكود</th><th className="p-6 font-black text-white">المادة/الصف</th><th className="p-6 font-black text-white">المحتوى</th><th className="p-6 font-black text-center text-white">الحالة</th></tr></thead>
                  <tbody className="divide-y divide-white/5">
                     {codes.map(c => {
                       const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
                       return (
                       <tr key={c.id} className="hover:bg-white/5 transition-all text-white">
                          <td className="p-6 font-mono font-black text-blue-400 text-xl">{c.code}</td>
                          <td className="p-6 text-xs text-white/60 font-bold">{c.grade}ث - {c.subject==='physics'?'فيزياء':c.subject==='chemistry'?'كيمياء':'علوم متكاملة'}</td>
                          <td className="p-6 font-bold text-white/80">{c.target}</td>
                          <td className="p-6 text-center">
                            {c.status === 'Used' ? (
                              <span className="px-4 py-2 rounded-full text-xs font-black bg-red-500/20 text-red-400">مستخدم</span>
                            ) : isExpired ? (
                              <span className="px-4 py-2 rounded-full text-xs font-black bg-orange-500/20 text-orange-400">منتهي</span>
                            ) : (
                              <span className="px-4 py-2 rounded-full text-xs font-black bg-green-500/20 text-green-400">متاح</span>
                            )}
                            {c.expiresAt && <div className="text-[9px] mt-1 text-white/30">ينتهي: {new Date(c.expiresAt).toLocaleDateString()}</div>}
                          </td>
                       </tr>
                     )})}
                  </tbody>
               </table>
               {codes.length === 0 && <p className="text-center py-20 text-white/20 font-black italic">لا توجد أكواد مولدة بعد.</p>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StudentLayout({ profile, user, lessons, exams, codes, questions, logout }) {
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [activeSub, setActiveSub] = useState(profile.grade === '1' ? 'integrated' : 'physics');

  useEffect(() => {
    onSnapshot(collection(db, 'artifacts', appId, 'users', user.uid, 'myCourses'), (s) => setMyCourses(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [user]);

  if (activeQuiz) return <QuizEngine questions={activeQuiz.questions} examData={activeQuiz.data} profile={profile} user={user} onClose={() => setActiveQuiz(null)} />;

  if (activeLesson) {
    const associatedExam = exams.find(e => e.id === activeLesson.examId);
    const examQuestions = associatedExam ? questions.filter(q => q.examId === associatedExam.id) : [];
    return (
      <div className="min-h-screen text-white text-right" dir="rtl">
        <ScienceBackground />
        <header className="backdrop-blur-md bg-white/5 p-8 border-b border-white/10 flex justify-between items-center sticky top-0 z-50">
           <button onClick={() => setActiveLesson(null)} className="flex items-center gap-2 font-black text-white/30 hover:text-white transition-all bg-white/5 px-6 py-3 rounded-2xl"><ChevronLeft /> العودة</button>
           <h2 className="text-2xl font-black">{activeLesson.title}</h2>
        </header>
        <main className="max-w-5xl mx-auto p-8 space-y-12 pb-40">
           <div className="bg-black rounded-[60px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border-[15px] border-white/5 aspect-video relative group ring-1 ring-white/10">
              <iframe src={activeLesson.videoUrl} className="absolute inset-0 w-full h-full shadow-inner" allowFullScreen></iframe>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {examQuestions.length > 0 && (
                <button onClick={() => setActiveQuiz({ questions: examQuestions, data: associatedExam })} className="backdrop-blur-3xl bg-green-600/10 p-12 rounded-[50px] border border-green-500/20 flex flex-col items-center gap-6 hover:bg-green-600/20 transition-all shadow-2xl group">
                   <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 group-hover:scale-125 transition-all shadow-inner"><Zap size={48} className="animate-pulse" /></div>
                   <span className="font-black text-4xl">بدء الامتحان التقييمي</span>
                   <p className="text-green-500/50 font-black text-sm tracking-widest uppercase italic">{associatedExam.title}</p>
                </button>
              )}
              <div className="backdrop-blur-3xl bg-white/5 p-12 rounded-[50px] border border-white/10 flex flex-col items-center gap-6 opacity-40 grayscale pointer-events-none">
                 <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400"><Download size={40}/></div>
                 <span className="font-black text-3xl">تحميل المذكرة (قريباً)</span>
              </div>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-right text-white" dir="rtl">
       <ScienceBackground />
       <aside className="w-full md:w-[400px] backdrop-blur-3xl bg-white/5 border-l border-white/10 p-10 flex flex-col shadow-2xl">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-900 p-12 rounded-[60px] shadow-2xl mb-12 relative overflow-hidden border border-white/20">
             <h3 className="font-black text-4xl text-white mb-2 truncate relative z-10">{profile.name}</h3>
             <p className="text-xs font-black text-white/50 uppercase tracking-[0.4em] relative z-10">{profile.grade}ث ثانوي</p>
          </div>
          <div className="space-y-4 mb-12">
             <p className="text-xs font-black text-white/20 mr-2 mb-4 tracking-widest uppercase">اختر المادة</p>
             {profile.grade === '1' ? <div className="p-8 rounded-[35px] bg-purple-600 text-white font-black text-2xl text-center shadow-2xl shadow-purple-900/40">العلوم المتكاملة ✨</div> :
             <div className="grid grid-cols-1 gap-4"><SubjectBtn active={activeSub==='physics'} onClick={()=>setActiveSub('physics')} label="الفيزياء 🧲" color="blue" /><SubjectBtn active={activeSub==='chemistry'} onClick={()=>setActiveSub('chemistry')} label="الكيمياء 🧪" color="emerald" /></div>}
          </div>
          <button onClick={async () => {
             const codeIn = prompt("أدخل كود فك التشفير:");
             if(!codeIn) return;
             const found = codes.find(c => c.code === codeIn.toUpperCase() && c.grade === profile.grade);
             
             if (!found) {
                return alert("الكود البرمجي غير صالح أو غير مخصص لصفك الدراسي!");
             }
             if (found.status === 'Used') {
                return alert("عذراً، هذا الكود تم استخدامه من قبل!");
             }
             if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
                return alert("عذراً، لقد انتهت صلاحية هذا الكود ولن يمكن استخدامه!");
             }

             await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'codes', found.id), { status: 'Used', usedBy: user.uid, usedAt: new Date().toISOString() });
             await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'myCourses'), { title: found.target, subject: found.subject, activatedAt: new Date().toISOString() });
             alert("تم تفعيل المسار التعليمي بنجاح!"); setActiveSub(found.subject);
          }} className="w-full bg-white text-slate-900 p-8 rounded-[40px] font-black text-2xl flex items-center justify-center gap-4 mb-6 shadow-2xl hover:scale-105 active:scale-95 transition-all"><Ticket size={32}/> تفعيل كود جديد</button>
          <button onClick={logout} className="p-4 text-white/20 font-bold mt-auto hover:text-red-500 transition-colors">تسجيل خروج</button>
       </aside>
       <main className="flex-1 p-16 overflow-y-auto">
          <h1 className="text-[60px] font-black text-white mb-20 tracking-tighter leading-none">مكتبتي الذكية ✨</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {myCourses.filter(c => c.subject === activeSub).map(lesson => (
               <div key={lesson.id} className="group relative backdrop-blur-3xl bg-white/5 p-12 rounded-[70px] border border-white/10 flex flex-col justify-between h-[500px] transition-all hover:-translate-y-6 shadow-2xl hover:bg-white/10">
                  <div className={`absolute -top-20 -right-20 w-64 h-64 blur-[100px] -z-10 opacity-30 ${activeSub==='physics'?'bg-blue-600':activeSub==='chemistry'?'bg-emerald-600':'bg-purple-600'}`}></div>
                  <div>
                    <div className={`w-24 h-24 rounded-[40px] flex items-center justify-center mb-10 shadow-2xl transition-all group-hover:rotate-12 ${activeSub==='physics'?'bg-blue-500/20 text-blue-400':activeSub==='chemistry'?'bg-emerald-500/20 text-emerald-400':'bg-purple-500/20 text-purple-400'}`}><PlayCircle size={48}/></div>
                    <h3 className="text-4xl font-black text-white leading-tight">{lesson.title}</h3>
                  </div>
                  <button onClick={() => {
                    const realLesson = lessons.find(l => l.title === lesson.title && l.subject === activeSub);
                    setActiveLesson(realLesson || lesson);
                  }} className="w-full bg-white text-slate-900 py-6 rounded-[35px] font-black text-2xl shadow-2xl transition-all active:scale-95 hover:bg-blue-50">فتح الحصة</button>
               </div>
             ))}
             {myCourses.filter(c => c.subject === activeSub).length === 0 && <div className="col-span-full py-60 text-center opacity-20 font-black italic text-4xl uppercase tracking-widest">لا توجد حصص مفعلة</div>}
          </div>
       </main>
    </div>
  );
}

function QuizEngine({ questions, examData, profile, user, onClose }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const finish = async () => {
    let c = 0; questions.forEach(q => { if (answers[q.id] === q.correctAnswer) c++; });
    const s = Math.round((c / questions.length) * 100); setScore(s);
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'student_results'), { studentName: profile.name, studentId: user.uid, examId: examData.id, examTitle: examData.title, score: s, subject: examData.subject, grade: examData.grade, timestamp: serverTimestamp() });
  };

  if (score !== null) return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6 text-white" dir="rtl">
      <ScienceBackground />
      <div className="backdrop-blur-3xl bg-white/5 p-24 rounded-[80px] border border-white/10 text-center max-w-2xl shadow-2xl relative">
        <Trophy size={160} className="mx-auto text-yellow-400 filter drop-shadow-[0_0_50px_rgba(250,204,21,0.5)] mb-12" />
        <h2 className="text-[150px] font-black leading-none mb-4">{score}%</h2>
        <p className="text-white/30 font-black text-2xl mb-12 uppercase tracking-[0.2em]">تم إنهاء الامتحان</p>
        <button onClick={onClose} className="w-full bg-blue-600 py-7 rounded-[40px] font-black text-3xl shadow-2xl shadow-blue-900/50 hover:bg-blue-500 active:scale-95 transition-all">العودة للرئيسية</button>
      </div>
    </div>
  );

  const q = questions[current];
  return (
    <div className="min-h-screen text-white text-right flex flex-col" dir="rtl">
      <ScienceBackground />
      <header className="p-10 flex justify-between items-center border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8"><button onClick={onClose} className="text-white/20 hover:text-white transition-all"><ChevronLeft size={48}/></button><span className="text-4xl font-black tracking-tighter">السؤال {current+1} <span className="text-white/10 text-2xl">/ {questions.length}</span></span></div>
        <div className="w-[400px] h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner"><div className="h-full bg-gradient-to-l from-blue-500 to-indigo-600 transition-all duration-1000 shadow-[0_0_20px_rgba(59,130,246,0.5)]" style={{width: `${((current+1)/questions.length)*100}%`}}></div></div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto p-12 py-24 flex flex-col justify-center w-full">
        <div className="backdrop-blur-3xl bg-white/5 p-16 rounded-[70px] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] mb-12">
           {q.imageUrl ? <img src={q.imageUrl} className="max-h-[500px] mx-auto rounded-[50px] border-8 border-white/5 shadow-2xl" /> : <h2 className="text-[55px] font-black text-center leading-[1.2]">{q.text}</h2>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {['أ', 'ب', 'ج', 'د'].map(opt => (
            <button key={opt} onClick={() => setAnswers({...answers, [q.id]: opt})} className={`p-14 rounded-[55px] border-[5px] text-[70px] font-black transition-all flex items-center justify-center gap-12 ${answers[q.id]===opt ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_60px_rgba(59,130,246,0.6)] scale-105':'bg-white/5 border-white/5 text-white/10 hover:border-white/10 hover:text-white hover:bg-white/10'}`}>
              <span className={`w-20 h-20 rounded-[30px] border-4 flex items-center justify-center text-4xl ${answers[q.id]===opt?'bg-white/20 border-white/40':'bg-white/5 border-white/10'}`}>{opt}</span> الخيار {opt}
            </button>
          ))}
        </div>
      </main>
      <footer className="p-12 backdrop-blur-3xl bg-white/5 border-t border-white/10 flex justify-between items-center max-w-6xl mx-auto w-full rounded-t-[80px]">
        <button onClick={() => setCurrent(Math.max(0, current-1))} disabled={current===0} className="text-white/20 font-black text-3xl disabled:opacity-0 transition-all uppercase tracking-widest">السابق</button>
        {current === questions.length - 1 
          ? <button onClick={finish} disabled={!answers[q.id]} className="bg-green-600 px-40 py-8 rounded-[45px] font-black text-4xl shadow-2xl shadow-green-900/50 hover:bg-green-500 active:scale-95 transition-all">إنهاء 🏁</button>
          : <button onClick={() => setCurrent(current+1)} disabled={!answers[q.id]} className="bg-blue-600 px-40 py-8 rounded-[45px] font-black text-4xl shadow-2xl shadow-blue-900/50 hover:bg-blue-500 active:scale-95 transition-all">التالي ✨</button>
        }
      </footer>
    </div>
  );
}

function ParentLayout({ profile, results, logout }) {
  const studentResults = results.filter(r => r.studentName === profile.name);
  return (
    <div className="min-h-screen text-right text-white" dir="rtl">
      <ScienceBackground />
      <header className="backdrop-blur-md bg-white/5 p-8 border-b border-white/10 flex justify-between items-center">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-rose-600/20 text-rose-500 rounded-3xl flex items-center justify-center border border-rose-500/30"><Heart size={32}/></div>
            <div><h2 className="text-3xl font-black tracking-tighter">متابعة ولي الأمر</h2><p className="text-white/30 font-bold uppercase text-xs tracking-widest">الطالب: {profile.name}</p></div>
         </div>
         <button onClick={logout} className="p-4 bg-white/5 rounded-2xl hover:bg-red-500/20 transition-all"><LogOut /></button>
      </header>
      <main className="max-w-4xl mx-auto p-12 py-24 animate-in fade-in duration-1000">
         <div className="backdrop-blur-3xl bg-white/5 p-16 rounded-[80px] border border-white/10 shadow-2xl">
            <h3 className="text-4xl font-black mb-16 flex items-center gap-6"><BarChart3 className="text-blue-500" size={40}/> السجل الأكاديمي للطالب</h3>
            <div className="space-y-8">
               {studentResults.length > 0 ? studentResults.map((res, i) => (
                 <div key={i} className="flex justify-between items-center p-12 bg-white/5 rounded-[60px] border border-white/10 hover:bg-white/10 transition-all group">
                    <div>
                       <span className="font-black text-3xl block mb-2">{res.examTitle}</span>
                       <span className={`text-xs font-black px-5 py-2 rounded-full ${res.subject==='physics'?'bg-blue-600/30 text-blue-400':res.subject==='chemistry'?'bg-emerald-600/30 text-emerald-400':'bg-purple-600/30 text-purple-400'}`}>
                          {res.subject === 'physics' ? 'فيزياء 🧲' : res.subject === 'chemistry' ? 'كيمياء 🧪' : 'علوم متكاملة ✨'}
                       </span>
                    </div>
                    <div className="text-left">
                       <span className={`text-[80px] font-black leading-none ${res.score >= 50 ? 'text-green-400' : 'text-red-500'}`}>{res.score}%</span>
                       <p className="text-white/20 mt-4 font-mono text-xs uppercase tracking-widest">{res.timestamp ? new Date(res.timestamp.seconds * 1000).toLocaleDateString() : 'Loading...'}</p>
                    </div>
                 </div>
               )) : <div className="text-center py-40 opacity-20 font-black italic text-4xl">لم يتم أداء أي امتحانات بعد</div>}
            </div>
         </div>
      </main>
    </div>
  );
}
