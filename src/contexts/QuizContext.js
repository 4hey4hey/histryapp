import React, { createContext, useState, useEffect, useContext } from 'react';

const QuizContext = createContext();

export function useQuiz() {
  return useContext(QuizContext);
}

export function QuizProvider({ children }) {
  const [questions, setQuestions] = useState([]);

  // 初期データ読み込み
  useEffect(() => {
    const storedQuestions = localStorage.getItem('quizQuestions');
    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    } else {
      // デフォルトのクイズデータ
      const defaultQuestions = [
        {
          id: 1,
          question: "日本で「鎌倉幕府」が開かれたのは何年？",
          options: ["1185年", "1192年", "1203年", "1221年"],
          correctAnswer: "1192年",
          explanation: "鎌倉幕府は源頼朝によって1192年に開かれました。これは日本初の武家政権とされています。",
          icon: "⚔️"
        },
        {
          id: 2,
          question: "「関ヶ原の戦い」が起きたのは何年？",
          options: ["1598年", "1600年", "1603年", "1615年"],
          correctAnswer: "1600年",
          explanation: "関ヶ原の戦いは1600年に徳川家康と石田三成を中心とした東西の大名連合の間で行われました。",
          icon: "🏯"
        },
        {
          id: 3,
          question: "江戸幕府の最後の将軍は誰？",
          options: ["徳川家茂", "徳川慶喜", "徳川家定", "徳川家光"],
          correctAnswer: "徳川慶喜",
          explanation: "徳川慶喜は江戸幕府の第15代将軍で、大政奉還により政権を朝廷に返上しました。",
          icon: "👑"
        },
        {
          id: 4,
          question: "明治維新が起きたのは何年？",
          options: ["1853年", "1867年", "1868年", "1889年"],
          correctAnswer: "1868年",
          explanation: "明治維新は1868年に起こり、江戸幕府から明治政府への政治体制の転換が行われました。",
          icon: "🎌"
        },
        {
          id: 5,
          question: "日清戦争が起きたのは何年から何年？",
          options: ["1894年〜1895年", "1904年〜1905年", "1914年〜1918年", "1937年〜1945年"],
          correctAnswer: "1894年〜1895年",
          explanation: "日清戦争は1894年から1895年にかけて、日本と清（現在の中国）の間で行われた戦争です。",
          icon: "⛵"
        }
      ];
      setQuestions(defaultQuestions);
      localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
    }
  }, []);

  // 問題追加・更新
  const saveQuestion = (question) => {
    let updatedQuestions;
    const existingQuestion = questions.find(q => q.id === question.id);
    
    if (existingQuestion) {
      // 既存の問題を更新
      updatedQuestions = questions.map(q => 
        q.id === question.id ? question : q
      );
    } else {
      // 新規問題を追加
      updatedQuestions = [...questions, question];
    }
    
    setQuestions(updatedQuestions);
    localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions));
  };

  // 問題削除
  const deleteQuestion = (id) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions));
  };

  // データリセット
  const resetQuestions = () => {
    const defaultQuestions = [
      {
        id: 1,
        question: "日本で「鎌倉幕府」が開かれたのは何年？",
        options: ["1185年", "1192年", "1203年", "1221年"],
        correctAnswer: "1192年",
        explanation: "鎌倉幕府は源頼朝によって1192年に開かれました。これは日本初の武家政権とされています。",
        icon: "⚔️"
      },
      {
        id: 2,
        question: "「関ヶ原の戦い」が起きたのは何年？",
        options: ["1598年", "1600年", "1603年", "1615年"],
        correctAnswer: "1600年",
        explanation: "関ヶ原の戦いは1600年に徳川家康と石田三成を中心とした東西の大名連合の間で行われました。",
        icon: "🏯"
      },
      {
        id: 3,
        question: "江戸幕府の最後の将軍は誰？",
        options: ["徳川家茂", "徳川慶喜", "徳川家定", "徳川家光"],
        correctAnswer: "徳川慶喜",
        explanation: "徳川慶喜は江戸幕府の第15代将軍で、大政奉還により政権を朝廷に返上しました。",
        icon: "👑"
      },
      {
        id: 4,
        question: "明治維新が起きたのは何年？",
        options: ["1853年", "1867年", "1868年", "1889年"],
        correctAnswer: "1868年",
        explanation: "明治維新は1868年に起こり、江戸幕府から明治政府への政治体制の転換が行われました。",
        icon: "🎌"
      },
      {
        id: 5,
        question: "日清戦争が起きたのは何年から何年？",
        options: ["1894年〜1895年", "1904年〜1905年", "1914年〜1918年", "1937年〜1945年"],
        correctAnswer: "1894年〜1895年",
        explanation: "日清戦争は1894年から1895年にかけて、日本と清（現在の中国）の間で行われた戦争です。",
        icon: "⛵"
      }
    ];
    setQuestions(defaultQuestions);
    localStorage.setItem('quizQuestions', JSON.stringify(defaultQuestions));
  };

  const value = {
    questions,
    saveQuestion,
    deleteQuestion,
    resetQuestions
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}