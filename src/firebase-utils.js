import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc 
} from "firebase/firestore";
import { db } from "./firebase";

// コレクション名
const QUESTIONS_COLLECTION = "questions";

// 全問題データの取得
export const fetchQuestions = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, QUESTIONS_COLLECTION));
    const questions = [];
    querySnapshot.forEach((doc) => {
      questions.push({ id: doc.id, ...doc.data() });
    });
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

// 問題の追加
export const addQuestion = async (question) => {
  try {
    // idフィールドがあればそれを使用、なければFirestoreに自動生成させる
    if (question.id) {
      const docRef = doc(db, QUESTIONS_COLLECTION, question.id.toString());
      await setDoc(docRef, question);
      return { ...question };
    } else {
      const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), question);
      return { id: docRef.id, ...question };
    }
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

// 問題の更新
export const updateQuestion = async (id, question) => {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, id.toString());
    await updateDoc(docRef, question);
    return { id, ...question };
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

// 問題の削除
export const deleteQuestion = async (id) => {
  try {
    await deleteDoc(doc(db, QUESTIONS_COLLECTION, id.toString()));
    return id;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

// 初期データのインポート（最初の一回だけ使用）
export const importInitialData = async (questions) => {
  try {
    // バッチ処理で一括登録
    const promises = questions.map(question => 
      addQuestion(question)
    );
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error("Error importing initial data:", error);
    return false;
  }
};