// Firebase Admin SDK configuration for server-side Firestore access
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK (only once)
let app;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert({
      projectId: import.meta.env.FIREBASE_PROJECT_ID,
      privateKey: import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL,
    }),
    projectId: import.meta.env.FIREBASE_PROJECT_ID,
  });
} else {
  app = getApps()[0];
}

// Initialize Firestore with specific database
export const db = getFirestore(app, 'comments');

export default app;
