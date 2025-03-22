import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
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

  // Firestoreから問題データを取得する関数
  const fetchQuestionsFromFirestore = async () => {
    try {
      console.log('Firestoreからデータを取得しています...');
      const q = query(collection(db, 'questions'));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        console.log('Firestore内のquestionsコレクションが空です。初期データを登録します。');
        return [];
      }
      
      const questionsData = [];
      snapshot.forEach(doc => {
        console.log('ドキュメントを取得:', doc.id, doc.data());
        questionsData.push({ ...doc.data(), id: doc.id });
      });
      
      console.log('取得したデータ:', questionsData);
      return questionsData;
    } catch (error) {
      console.error('Firestoreからの問題取得に失敗しました:', error);
      return [];
    }
  };

  // 初期データをFirestoreにロードする関数
  const loadInitialData = async () => {
    try {
      console.log('初期データの登録を開始します...');
      console.log('Firestoreの接続状態:', db ? 'DBインスタンスが存在します' : 'DBインスタンスが存在しません');
      
      // まずコレクションが存在するか確認
      try {
        await getDocs(collection(db, 'questions'));
        console.log('questionsコレクションにアクセスできました');
      } catch (e) {
        console.error('questionsコレクションへのアクセス中にエラーが発生しました:', e);
      }
      
      for (const question of defaultQuestions) {
        console.log('問題を登録します:', question.id);
        try {
          await setDoc(doc(db, 'questions', question.id), question);
          console.log('ドキュメントを正常に登録しました:', question.id);
        } catch (e) {
          console.error('ドキュメントの登録中にエラーが発生しました:', e);
        }
      }
      console.log('初期データの登録が完了しました');
    } catch (error) {
      console.error('初期データの登録に失敗しました:', error);
    }
  };

  // 初期データ読み込み
  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        console.log('データの読み込みを開始します...');
        
        // 当面は強制的に初期データをロードしてみる
        console.log('初期データをFirestoreに登録します...');
        await loadInitialData();
        
        console.log('データを再度取得します...');
        const questionsData = await fetchQuestionsFromFirestore();
        
        if (questionsData.length > 0) {
          console.log('データを取得できました:', questionsData.length);
          setQuestions(questionsData);
        } else {
          console.log('取得したデータが空です。デフォルトデータを使用します');
          setQuestions(defaultQuestions);
          localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
        }
      } catch (error) {
        console.error('問題データの読み込みに失敗しました:', error);
        // エラー時はローカルストレージからフォールバック
        const storedQuestions = localStorage.getItem('quizQuestions');
        if (storedQuestions) {
          setQuestions(JSON.parse(storedQuestions));
        } else {
          setQuestions(defaultQuestions);
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // 問題追加・更新
  const saveQuestion = async (question) => {
    try {
      // 新規問題の場合はIDを生成
      const questionId = question.id || Date.now().toString();
      const questionWithId = { ...question, id: questionId };
      
      // Firestoreに保存
      await setDoc(doc(db, 'questions', questionId), questionWithId);
      
      // ローカルステートを更新
      setQuestions(prevQuestions => {
        const exists = prevQuestions.some(q => q.id === questionId);
        if (exists) {
          return prevQuestions.map(q => q.id === questionId ? questionWithId : q);
        } else {
          return [...prevQuestions, questionWithId];
        }
      });
      
      // フォールバック用にローカルストレージにも保存
      localStorage.setItem('quizQuestions', JSON.stringify(
        questions.map(q => q.id === questionId ? questionWithId : q).concat(
          questions.some(q => q.id === questionId) ? [] : [questionWithId]
        )
      ));
      
      return questionWithId;
    } catch (error) {
      console.error('問題の保存に失敗しました:', error);
      throw error;
    }
  };

  // 問題削除
  const deleteQuestion = async (id) => {
    try {
      // Firestoreから削除
      await deleteDoc(doc(db, 'questions', id.toString()));
      
      // ローカルステートを更新
      const updatedQuestions = questions.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
      
      // フォールバック用にローカルストレージも更新
      localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions));
    } catch (error) {
      console.error('問題の削除に失敗しました:', error);
      throw error;
    }
  };

  // データリセット
  const resetQuestions = async () => {
    try {
      setLoading(true);
      
      // 現在のすべての問題をFirestoreから削除
      const snapshot = await getDocs(collection(db, 'questions'));
      const deletePromises = [];
      snapshot.forEach(doc => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      await Promise.all(deletePromises);
      
      // デフォルトデータを再登録
      await loadInitialData();
      
      // 最新のデータを取得して状態を更新
      const newQuestions = await fetchQuestionsFromFirestore();
      setQuestions(newQuestions);
      
      // フォールバック用にローカルストレージも更新
      localStorage.setItem('quizQuestions', JSON.stringify(newQuestions));
    } catch (error) {
      console.error('データのリセットに失敗しました:', error);
      throw error;
    } finally {
      setLoading(false);
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