import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, Database } from 'firebase/database';

let database: Database | null = null;
let isFirebaseConnected = false;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  };

  // ตรวจสอบว่ามี config ครบไหม
  if (firebaseConfig.apiKey && firebaseConfig.databaseURL) {
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    isFirebaseConnected = true;
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
  isFirebaseConnected = false;
}

export { database, ref, set, onValue, isFirebaseConnected };