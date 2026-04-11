import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// 1. إعدادات فايربيز (المفتاح الجديد السليم تم إضافته)
const firebaseConfig = {
  apiKey: "AIzaSyD9BPWwptbDa_DylETLe_DrCKCOhU4HsEc", 
  authDomain: "my-project-7a829.firebaseapp.com",
  projectId: "my-project-7a829",
  storageBucket: "my-project-7a829.appspot.com",
  messagingSenderId: "886956896190",
  // تأكد من وضع الـ appId الخاص بك هنا إذا كان موجوداً في كودك القديم، أو اتركه كما هو
  appId: "1:886956896190:web:YOUR_APP_ID" 
};

// 2. تهيئة فايربيز
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [error, setError] = useState("");

  // 3. مراقبة حالة الدخول (هنا كان الخطأ وتم إصلاح الأقواس)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === "admin@test.com") {
        setUser(currentUser);
        setView("admin_dashboard");
      } else {
        setUser(null);
        setView("login");
      }
    });
    return () => unsubscribe();
  }, []);

  // 4. دالة تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
      setError("بيانات الدخول غير صحيحة، تأكد من الإيميل والباسورد في فايربيز");
    }
  };

  // 5. دالة تسجيل الخروج
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  // 6. واجهة لوحة الإدارة (عند النجاح)
  if (view === "admin_dashboard") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: 'white', fontFamily: 'system-ui' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>مرحباً بك يا مستر محمد في لوحة الإدارة! 🚀</h1>
        <p style={{ marginBottom: '30px', color: '#94a3b8' }}>الإيميل المسجل: {user?.email}</p>
        <button
          onClick={handleLogout}
          style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}
        >
          تسجيل الخروج
        </button>
      </div>
    );
  }

  // 7. واجهة تسجيل الدخول
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#020617', color: 'white', fontFamily: 'system-ui' }}>
      <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', width: '100%', maxWidth: '400px', textAlign: 'center', border: '1px solid #1e293b' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>منصة المستر محمد سلامة</h2>
        <p style={{ color: '#60a5fa', marginBottom: '20px', fontSize: '0.9rem' }}>لوحة تحكم الإدارة</p>

        {error && (
          <div style={{ backgroundColor: '#451a23', color: '#f87171', border: '1px solid #7f1d1d', padding: '12px', borderRadius: '5px', marginBottom: '20px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="email"
            placeholder="mohamed@test.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '12px', borderRadius: '5px', backgroundColor: '#1e293b', border: '1px solid #334155', color: 'white', outline: 'none' }}
            required
          />
          <input
            type="password"
            placeholder="........"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '12px', borderRadius: '5px', backgroundColor: '#1e293b', border: '1px solid #334155', color: 'white', outline: 'none', textAlign: 'left' }}
            dir="ltr"
            required
          />
          <button
            type="submit"
            style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px', transition: 'background 0.3s' }}
          >
            دخول الإدارة
          </button>
        </form>
      </div>
    </div>
  );
}
