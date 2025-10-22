import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
let auth = null;

try {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || 'dummy-key',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'demo@demo.com'
  };

  if (!admin.apps.length && process.env.FIREBASE_PROJECT_ID) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    auth = admin.auth();
  }
} catch (error) {
  console.log('Firebase not configured, using in-memory storage');
}

export { db, auth, admin };
