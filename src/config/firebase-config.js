import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_KEY,
  authDomain: "project-management-fireb-fc538.firebaseapp.com",
  projectId: "project-management-fireb-fc538",
  storageBucket: "project-management-fireb-fc538.appspot.com",
  messagingSenderId: "568879719469",
  appId: "1:568879719469:web:9eacacd4a8b906c4ff04a4",
  measurementId: "G-P348VPKX1Z",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
