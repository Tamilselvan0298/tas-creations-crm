import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

let isFirebaseAdminInitialized = false;

try {
  // If FIREBASE_SERVICE_ACCOUNT_JSON is set, parse and initialize
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON.startsWith('PLACEHOLDER')) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    isFirebaseAdminInitialized = true;
    console.log('Firebase Admin SDK initialized successfully via Service Account JSON.');
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Falls back to Google Application Credentials path
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    isFirebaseAdminInitialized = true;
    console.log('Firebase Admin SDK initialized successfully via Application Default Credentials.');
  } else {
    // Dev fallback
    console.warn('Firebase Service Account credentials not provided. Server running in Mock Auth Validation mode.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

export { admin, isFirebaseAdminInitialized };
export default admin;
