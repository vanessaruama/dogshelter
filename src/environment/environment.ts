import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
  production: false,
  apiUrl: "https://dogshelter.onrender.com",
  type:"module",
  firebaseConfig: {
    apiKey: "AIzaSyBNU16EKdMNUBlj3kzIZ4JXVSAyiBCG-gY",
    authDomain: "dog-shelter-a8e65.firebaseapp.com",
    projectId: "dog-shelter-a8e65",
    storageBucket: "dog-shelter-a8e65.appspot.com",
    messagingSenderId: "612716648277",
    appId: "1:612716648277:web:1f88a715cd5ee95a6041dc",
    measurementId: "G-CF3FXWS7MK"
  }
};

const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);
