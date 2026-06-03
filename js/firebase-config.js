import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAGjVl2bPiW0qhLIXS4DIIMP4k6iK0U41c",
  authDomain: "quizbiblico-17442.firebaseapp.com",
  projectId: "quizbiblico-17442",
  storageBucket: "quizbiblico-17442.firebasestorage.app",
  messagingSenderId: "466441658183",
  appId: "1:466441658183:web:c9b4b3e15a7d33d9383662",
  measurementId: "G-9EZ5ZNCPRW"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
