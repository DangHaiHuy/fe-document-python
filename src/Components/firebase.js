// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPhEjTdvmwRzejKIAz0Pv-Gwjax2It354",
  authDomain: "uploadfile-e1b78.firebaseapp.com",
  projectId: "uploadfile-e1b78",
  storageBucket: "uploadfile-e1b78.appspot.com",
  messagingSenderId: "727438067717",
  appId: "1:727438067717:web:ade07d1bdda5e273bb746c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
