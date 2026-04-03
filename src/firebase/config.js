import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyA2oRF5BPCIHwqePOcr-fFVn4jh7xWd2fs",
  authDomain: "orionmedical-b3772.firebaseapp.com",
  projectId: "orionmedical-b3772",
  storageBucket: "orionmedical-b3772.firebasestorage.app",
  messagingSenderId: "402024013705",
  appId: "1:402024013705:web:0ab266c1ae7901c9678b58",
  measurementId: "G-J4VNV6JC1V"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
