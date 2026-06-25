import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0owDav1cTZoMigo9xjMP2gCMKv-cMRyk",
  authDomain: "criclocal-c070c.firebaseapp.com",
  projectId: "criclocal-c070c",
  storageBucket: "criclocal-c070c.firebasestorage.app",
  messagingSenderId: "729979883912",
  appId: "1:729979883912:web:4281673ecdccebdd1fea3d",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);