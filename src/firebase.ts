import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyClEqTjVFZ6KkbmJGGfftrvRWuFOBawsh0",
  authDomain: "flipper-31f9e.firebaseapp.com",
  databaseURL: "https://flipper-31f9e-default-rtdb.firebaseio.com",
  projectId: "flipper-31f9e",
  storageBucket: "flipper-31f9e.firebasestorage.app",
  messagingSenderId: "904910123482",
  appId: "1:904910123482:web:18dc5c1a41d440335b50e3",
  measurementId: "G-W0NLL4DJKL",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const analytics = getAnalytics(app);
