import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD9BPWwptbDa_DylETLe_DrCKCOhU4HsEc", 
  authDomain: "my-project-7a829.firebaseapp.com",
  projectId: "my-project-7a829",
  storageBucket: "my-project-7a829.appspot.com",
  messagingSenderId: "886956896190",
  appId: "1:886956896190:web:48a25c17d740263f3508be" 
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [view, setView] = useState("login");
  const [error, setError] = useState("");

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  const handleLogout = async () => { await signOut(auth); };

  if (view === "admin_dashboard") {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
        <h1>مرحباً بك يا مستر محمد! 🚀</h1>
        <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>تسجيل الخروج</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#020617', color: 'white' }}>
      <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '10px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2>منصة المستر محمد سلامة</h2>
        {error && <div style={{ color: '#f87171', marginBottom: '20px' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="email" placeholder="الإيميل" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', borderRadius: '5px' }} required />
          <input type="password" placeholder="الباسورد" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', borderRadius: '5px' }} required />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>دخول الإدارة</button>
        </form>
      </div>
    </div>
  );
}
