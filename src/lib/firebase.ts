import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA5AufVR0pGIaOpqKHGWXllH-pVg-GvD_E",
  authDomain: "nour-alfy.firebaseapp.com",
  projectId: "nour-alfy",
  storageBucket: "nour-alfy.firebasestorage.app",
  messagingSenderId: "656632409960",
  appId: "1:656632409960:web:bbfe6106af32bb58e8f0dd",
  measurementId: "G-WPL7VKF0YR"
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get Firestore instance
const db = getFirestore(app);

// Get Storage instance
const storage = getStorage(app);

export { app, db, storage };
