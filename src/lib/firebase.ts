import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  child,
  remove,
  update,
} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyClEqTjVFZ6KkbmJGGfftrvRWuFOBawsh0',
  authDomain: 'flipper-31f9e.firebaseapp.com',
  databaseURL: 'https://flipper-31f9e-default-rtdb.firebaseio.com',
  projectId: 'flipper-31f9e',
  storageBucket: 'flipper-31f9e.firebasestorage.app',
  messagingSenderId: '904910123482',
  appId: '1:904910123482:web:18dc5c1a41d440335b50e3',
  measurementId: 'G-W0NLL4DJKL',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function saveSubmission(submission: Record<string, any>) {
  const submissionsRef = ref(db, 'submissions');
  const newRef = push(submissionsRef);
  await set(newRef, submission);
  return newRef.key;
}

export async function fetchSubmissions() {
  const dbRef = ref(db);
  const snap = await get(child(dbRef, 'submissions'));
  if (!snap.exists()) return {};
  return snap.val();
}

export async function deleteSubmission(id: string) {
  if (!id) throw new Error('Invalid id');
  const itemRef = ref(db, `submissions/${id}`);
  await remove(itemRef);
}

// ✅ Safer update: updates whole object/branch
export async function updateSubmission(id: string, data: Record<string, any>) {
  if (!id) throw new Error('Invalid id');
  const itemRef = ref(db, `submissions/${id}`);
  await update(itemRef, data);
}
