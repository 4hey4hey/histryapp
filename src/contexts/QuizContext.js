import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

const QuizContext = createContext();

export function useQuiz() {
  return useContext(QuizContext);
}

export function QuizProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // デフォルトのクイズデータ
  const defaultQuestions = [
    {
      id: '1',
      question: "日本で「鎌倉幕府」が開かれたのは何年？",
      options: ["1185年", "1192年", "1203年", "1221年"],
      correctAnswer: "1192年",
      explanation: "鎌倉幕府は源頼朝によって1192年に開かれました。これは日本初の武家政権とされています。",
      icon: "⚔️"
    },
    {
      id: '2',
      question: "「関ヶ原の戦い」が起きたのは何年？",
      options: ["1598年", "1600年", "1603年", "1615年"],
      correctAnswer: "1600年",
      explanation: "関ヶ原の戦いは1600年に徳川家康と石田三成を中心とした東西の大名連合の間で行われました。",
      icon: "🏯"
    },
    {
      id: '3',
      question: "江戸幕府の最後の将軍は誰？",
      options: ["徳川家茂", "徳川慶喜", "徳川家定", "徳川家光"],
      correctAnswer: "徳川慶喜",
      explanation: "徳川慶喜は江戸幕府の第15代将軍で、大政奉還により政権を朝廷に返上しました。",
      icon: "👑"
    },
    {
      id: '4',
      question: "明治維新が起きたのは何年？",
      options: ["1853年", "1867年", "1868年", "1889年"],
      correctAnswer: "1868年",
      explanation: "明治維新は1868年に起こり、江戸幕府から明治政府への政治体制の転換が行われました。",
      icon: "🎌"
    },
    {
      id: '5',
      question: "日清戦争が起きたのは何年から何年？",
      options: ["1894年〜1895年", "1904年〜1905年", "1914年〜1918年", "1937年〜1945年"],
      correctAnswer: "1894年〜1895年",
      explanation: "日清戦争は1894年から1895年にかけて、日本と清（現在の中国）の間で行われた戦争です。",
      icon: "⛵"
    }
  ];

  // Firestoreから問題を取得
  const fetchQuestionsFromFirestore = useCallback(async () => {
    try {
      const q = query(collection(db, 'questions'));
      
      // リアルタイムリスナーを設定
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedQuestions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setQuestions(fetchedQuestions);
        setLoading(false);
      });

      // コンポーネントのアンマウント時にリスナーを解除
      return () => unsubscribe();
    } catch (error) {
      console.error('問題の取得に失敗:', error);
      setLoading(false);
      return [];
    }
  }, []);

  // 初期データの読み込み
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, 'questions'));
        
        // コレクションが空の場合、デフォルトデータを登録
        if (snapshot.empty) {
          console.log('問題データが空です。デフォルトデータを登録します。');
          const savePromises = defaultQuestions.map(question => 
            setDoc(doc(db, 'questions', question.id), question)
          );
          await Promise.all(savePromises);
        }
        
        await fetchQuestionsFromFirestore();
      } catch (error) {
        console.error('データの読み込みに失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [fetchQuestionsFromFirestore]);

  // 問題の保存
  const saveQuestion = async (question) => {
    try {
      // IDがない場合は新規作成、ある場合は上書き
      const questionId = question.id || Date.now().toString();
      const questionToSave = {
        ...question,
        id: questionId
      };

      // Firestoreに保存
      await setDoc(doc(db, 'questions', questionId), questionToSave);
      
      return questionToSave;
    } catch (error) {
      console.error('問題の保存に失敗:', error);
      throw error;
    }
  };

  // 問題の削除
  const deleteQuestion = async (id) => {
    try {
      await deleteDoc(doc(db, 'questions', id.toString()));
    } catch (error) {
      console.error('問題の削除に失敗:', error);
      throw error;
    }
  };

  // データのリセット
  const resetQuestions = async () => {
    try {
      // 既存のすべての問題を削除
      const snapshot = await getDocs(collection(db, 'questions'));
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // デフォルト問題を保存
      const savePromises = defaultQuestions.map(question => 
        setDoc(doc(db, 'questions', question.id), question)
      );
      await Promise.all(savePromises);

    } catch (error) {
      console.error('データのリセットに失敗:', error);
      throw error;
    }
  };

  const value = {
    questions,
    saveQuestion,
    deleteQuestion,
    resetQuestions,
    loading
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}
