import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { Users, BookOpen, Ticket, PlusCircle, LayoutDashboard, ClipboardCheck, Trophy, Copy, CheckCircle, Trash2, LogOut, PlayCircle, ChevronLeft, User, Lock, Phone, Heart, BarChart3, Clock, FileText, Video, Download, Plus, Settings, Filter, Beaker, Atom, Sparkles, Image as ImageIcon, Upload, Check, Eye, Link as LinkIcon, Zap, Radiation, Microscope } from 'lucide-react';

// --- تأكد من هذه البيانات بدقة من صفحة Project Settings في فايربيز ---
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
const appId = 'my-project-7a829';

// --- باقي الكود كما هو (سأختصره هنا لسهولة النسخ ولكن تأكد من استبداله بالكامل في ملفك) ---
// [هنا يوضع كود المنصة الكامل الذي أرسلته لك سابقاً مع التأكد من وجود firebaseConfig الصحيح]
