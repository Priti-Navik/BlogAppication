// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-website-7cce5.firebaseapp.com",
  projectId: "blog-website-7cce5",
  storageBucket: "blog-website-7cce5.appspot.com",
  messagingSenderId: "220283774575",
  appId: "1:220283774575:web:afe9df6f5a1a4208e04f9a",
  measurementId: "G-T5VDCTKGYG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);