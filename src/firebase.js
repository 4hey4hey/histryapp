import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebaseの設定
const firebaseConfig = {
  apiKey: "AIzaSyCi9zffZ9DKqlH20MlYlMOdgIcgyWYsqdk",
  authDomain: "history-9a233.firebaseapp.com",
  projectId: "history-9a233",
  storageBucket: "history-9a233.appspot.com", // ここを修正
  messagingSenderId: "628189169902",
  appId: "1:628189169902:web:fc8d5279045f1771498bff",
  measurementId: "G-D1T96ND9ZE"
};

// Firebaseの初期化
const app = initializeApp(firebaseConfig);

// Firestoreのインスタンス化
export const db = getFirestore(app);