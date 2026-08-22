// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: "darsh-ai-e4bcc.firebaseapp.com",
  projectId: "darsh-ai-e4bcc",
  storageBucket: "darsh-ai-e4bcc.firebasestorage.app",
  messagingSenderId: "801870171925",
  appId: "1:801870171925:web:15f2c106cebf05dc50e31c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()