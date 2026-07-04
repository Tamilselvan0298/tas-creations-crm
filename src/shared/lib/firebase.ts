import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// In production, these should be supplied via environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock-auth-domain.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock-storage-bucket.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef',
};

// Check if we are running in mock/demo mode (i.e. no real firebase variables defined)
export const isMockFirebase = 
  !import.meta.env.VITE_FIREBASE_API_KEY || 
  import.meta.env.VITE_FIREBASE_API_KEY === 'mock-api-key';

let app;
let auth: any;
let db: any;
let storage: any;

if (!isMockFirebase) {
  // Initialize standard Firebase client
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Connect to local emulators in development if specified
  if (import.meta.env.VITE_FIREBASE_EMULATOR === 'true') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  }
} else {
  // Mock implementations for demo/development purposes so the UI is fully functional
  console.warn('Firebase API keys not configured. Running in Mock Mode for UI demonstration.');
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };
export default app;
