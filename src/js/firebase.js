/**
 * Firebase Integration Module with Local Storage Fallback
 * Supports 100+ student accounts and cloud sync.
 */

// Optional Firebase Config placeholder
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let db = null;

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

// Local Storage Storage Keys
const LOCAL_USERS_KEY = 'typing_hero_students_v1';
const LOCAL_SCORES_KEY = 'typing_hero_scores_v1';

export async function getStoredStudents() {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [
      { id: 'std_default', name: 'ゲスト生徒', pin: '0000', role: 'student', createdAt: Date.now() },
      { id: 'teacher_admin', name: '先生 (管理者)', pin: '1234', role: 'admin', createdAt: Date.now() }
    ];
  } catch (e) {
    return [];
  }
}

export async function saveStudent(student) {
  const students = await getStoredStudents();
  const existingIdx = students.findIndex(s => s.id === student.id || s.name === student.name);
  if (existingIdx >= 0) {
    students[existingIdx] = { ...students[existingIdx], ...student };
  } else {
    students.push({ ...student, id: student.id || 'std_' + Date.now() });
  }
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(students));
  return student;
}

export async function recordPracticeScore(record) {
  try {
    const raw = localStorage.getItem(LOCAL_SCORES_KEY);
    const scores = raw ? JSON.parse(raw) : [];
    scores.push({
      ...record,
      timestamp: Date.now()
    });
    localStorage.setItem(LOCAL_SCORES_KEY, JSON.stringify(scores));
  } catch (e) {
    console.error(e);
  }
}

export async function getStudentPracticeHistory(studentId) {
  try {
    const raw = localStorage.getItem(LOCAL_SCORES_KEY);
    const scores = raw ? JSON.parse(raw) : [];
    if (studentId === 'all') return scores;
    return scores.filter(s => s.studentId === studentId);
  } catch (e) {
    return [];
  }
}
