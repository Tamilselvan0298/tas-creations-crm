import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

let isFirebaseAdminInitialized = false;
let initError: string | null = null;

try {
  // If FIREBASE_SERVICE_ACCOUNT_JSON is set, parse and initialize
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.FIREBASE_SERVICE_ACCOUNT_JSON.startsWith('PLACEHOLDER')) {
    const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    let serviceAccount: any = null;
    try {
      serviceAccount = JSON.parse(rawJson);
    } catch (parseError: any) {
      console.warn('JSON.parse failed, attempting regex-based fallback extraction...', parseError.message);
      
      const extractField = (field: string) => {
        const regex = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)"`);
        const match = rawJson.match(regex);
        return match ? match[1] : null;
      };

      const projectId = extractField('project_id');
      const privateKey = extractField('private_key');
      const clientEmail = extractField('client_email');

      if (projectId && privateKey && clientEmail) {
        serviceAccount = {
          type: 'service_account',
          project_id: projectId,
          private_key: privateKey,
          client_email: clientEmail
        };
      } else {
        // If fallback fails, rethrow the original parsing error
        throw parseError;
      }
    }

    if (serviceAccount && serviceAccount.private_key) {
      // Clean up all escaped newlines (\\n) and raw newlines to correct PEM format
      serviceAccount.private_key = serviceAccount.private_key
        .replace(/\\n/g, '\n')
        .replace(/\r?\n/g, '\n');
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
    initError = 'Credentials not provided in env variables.';
  }
} catch (error: any) {
  console.error('Error initializing Firebase Admin SDK:', error);
  initError = error.message || String(error);
}

export { admin, isFirebaseAdminInitialized, initError };
export default admin;
