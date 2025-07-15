// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA-_UEZA_4CXxakoV9hPu_PCHHUV9m6MlA",
    authDomain: "projx-4e5f4.firebaseapp.com",
    projectId: "projx-4e5f4",
    storageBucket: "projx-4e5f4.firebasestorage.app",
    messagingSenderId: "160030482290",
    appId: "1:160030482290:web:c2aaf1d8ecb339d27dc7eb",
    measurementId: "G-FKG2TM6V5T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app)