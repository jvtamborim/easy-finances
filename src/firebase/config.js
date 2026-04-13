import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy0C9X8kJ8Lb-R3LdfVqGOFMJ6nlDeGkA",
  authDomain: "meu-catalogo-b2e87.firebaseapp.com",
  projectId: "meu-catalogo-b2e87",
  storageBucket: "meu-catalogo-b2e87.firebasestorage.app",
  messagingSenderId: "333390022530",
  appId: "1:333390022530:web:a6d30ebce95d35cdc9f19b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
