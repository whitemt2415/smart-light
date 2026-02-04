//src\firebase.ts
import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";
import type { Database } from "firebase/database";

let database: Database | null = null;
let isFirebaseConnected = false;
let firebaseError: string | null = null;

const initFirebase = (): void => {
  try {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    // ตรวจสอบว่ามี config ที่จำเป็นครบไหม
    const missingConfigs: string[] = [];

    if (!firebaseConfig.apiKey) missingConfigs.push("API_KEY");
    if (!firebaseConfig.databaseURL) missingConfigs.push("DATABASE_URL");
    if (!firebaseConfig.projectId) missingConfigs.push("PROJECT_ID");

    if (missingConfigs.length > 0) {
      firebaseError = `Missing config: ${missingConfigs.join(", ")}`;
      console.warn("Firebase config incomplete:", firebaseError);
      return;
    }

    // Validate URL format
    if (!firebaseConfig.databaseURL.includes("firebaseio.com")) {
      firebaseError = "Invalid DATABASE_URL format";
      console.warn(firebaseError);
      return;
    }

    const app: FirebaseApp = initializeApp(firebaseConfig);
    database = getDatabase(app);
    isFirebaseConnected = true;
    console.log("Firebase initialized successfully");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    firebaseError = `Init failed: ${errorMessage}`;
    console.error("Firebase initialization error:", error);
    isFirebaseConnected = false;
  }
};

// Initialize on module load
initFirebase();

export { database, ref, set, onValue, isFirebaseConnected, firebaseError };
