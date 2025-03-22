import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ChevronRight, Clock, Award, RotateCcw, BookOpen, Scroll, Shield } from 'lucide-react';

const HistoryQuizApp = () => {
  // クイズの問題データ
  const quizData = [
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

  // ステート
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timer, setTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [animation, setAnimation] = useState(false);

  // 回答選択時の処理
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setTimerActive(false);
    
    if (answer === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setShowResult(true);
  };

  // 次の問題へ進む処理
  const handleNextQuestion = () => {
    setAnimation(true);
    setTimeout(() => {
      setSelectedAnswer(null);
      setShowResult(false);
      
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setTimer(30);
        setTimerActive(true);
      } else {
        setQuizCompleted(true);
      }
      setAnimation(false);
    }, 500);
  };

  // クイズをリセットする処理
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setTimer(30);
    setTimerActive(true);
  };

  // クイズを開始する処理
  const startQuiz = () => {
    setShowIntro(false);
  };

  // タイマーの効果
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && !showResult) {
      setShowResult(true);
      setTimerActive(false);
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timer, showResult]);

  // イントロ画面
  if (showIntro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-4 text-white">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
              歴史クイズ
            </h1>
            <p className="text-lg text-indigo-200">〜時を超える知識の旅〜</p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-indigo-800/70 flex items-center justify-center">
              <Scroll size={48} className="text-amber-300" />
            </div>
          </div>
          
          <div className="mb-8 text-center">
            <p className="mb-4">日本の歴史を巡る5つの質問に挑戦しましょう！</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-indigo-800/50 p-3 rounded-lg flex items-center">
                <Clock className="text-amber-300 mr-2" size={20} />
                <span>制限時間: 30秒</span>
              </div>
              <div className="bg-indigo-800/50 p-3 rounded-lg flex items-center">
                <Shield className="text-amber-300 mr-2" size={20} />
                <span>難易度: 中級</span>
              </div>
              <div className="bg-indigo-800/50 p-3 rounded-lg flex items-center">
                <BookOpen className="text-amber-300 mr-2" size={20} />
                <span>問題数: 5問</span>
              </div>
              <div className="bg-indigo-800/50 p-3 rounded-lg flex items-center">
                <Award className="text-amber-300 mr-2" size={20} />
                <span>解説付き</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={startQuiz}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-600 text-indigo-900 font-bold rounded-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            クイズを始める
          </button>
        </div>
      </div>
    );
  }

  // 結果画面
  if (quizCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-2xl border border-white/20 text-white">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">クイズ結果</h1>
            <p className="text-indigo-200">あなたの歴史知識を振り返ろう</p>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-indigo-800/70 flex items-center justify-center">
              {score >= 4 ? (
                <div className="text-5xl">🏆</div>
              ) : score >= 3 ? (
                <div className="text-5xl">🥈</div>
              ) : (
                <div className="text-5xl">📚</div>
              )}
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-3xl font-bold mb-2">
              {score} / {quizData.length} 正解
            </p>
            <div className="w-full bg-indigo-800/50 h-4 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-600"
                style={{ width: `${(score / quizData.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-8 p-5 bg-indigo-800/50 rounded-xl text-center">
            <p className="text-lg mb-1">
              正答率: {Math.round((score / quizData.length) * 100)}%
            </p>
            <p className="text-sm text-indigo-200">
              {score === 5 ? "素晴らしい！あなたは歴史の達人です！" :
               score >= 3 ? "良い成績です！もう少しで完璧です！" :
               "もう一度挑戦して歴史知識を深めましょう！"}
            </p>
          </div>
          
          <button 
            onClick={resetQuiz}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-600 text-indigo-900 font-bold rounded-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
          >
            <RotateCcw size={20} className="mr-2" />
            もう一度挑戦する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
      <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/20 transition-opacity duration-500 ${animation ? 'opacity-0' : 'opacity-100'}`}>
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-indigo-800/70 text-amber-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
            <span className="mr-1">問題</span>
            <span className="text-xl">{currentQuestion + 1}</span>
            <span className="text-indigo-300">/{quizData.length}</span>
          </div>
          <div className={`flex items-center bg-indigo-800/70 px-4 py-2 rounded-xl ${timer <= 10 ? 'text-red-400' : 'text-amber-300'}`}>
            <Clock size={18} className="mr-2" />
            <span className="font-bold">{timer}</span>
          </div>
        </div>
        
        {/* 問題文 */}
        <div className="bg-indigo-800/50 rounded-xl p-5 mb-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-amber-500 rounded-full mr-3 text-xl">
              {quizData[currentQuestion].icon}
            </div>
            <h2 className="text-xl font-bold text-white">{quizData[currentQuestion].question}</h2>
          </div>
          
          {/* タイマープログレスバー */}
          <div className="w-full bg-indigo-700/50 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${timer <= 10 ? 'bg-red-500' : 'bg-amber-400'} transition-all duration-1000 ease-linear`}
              style={{ width: `${(timer / 30) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* 選択肢 */}
        <div className="space-y-3 mb-6">
          {quizData[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswerSelect(option)}
              disabled={showResult}
              className={`w-full py-4 px-5 rounded-xl border text-left transition-all duration-200 ${
                showResult 
                  ? option === quizData[currentQuestion].correctAnswer
                    ? 'bg-green-500/30 border-green-400 text-white'
                    : selectedAnswer === option
                      ? 'bg-red-500/30 border-red-400 text-white'
                      : 'bg-indigo-800/30 border-indigo-700 text-white/70'
                  : selectedAnswer === option
                    ? 'bg-amber-500/20 border-amber-400 text-white'
                    : 'bg-indigo-800/50 border-indigo-700 text-white hover:bg-indigo-700/50 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold shrink-0 
                  ${showResult
                    ? option === quizData[currentQuestion].correctAnswer
                      ? 'bg-green-500 text-white'
                      : selectedAnswer === option
                        ? 'bg-red-500 text-white'
                        : 'bg-indigo-700 text-white/70'
                    : 'bg-indigo-700 text-white'
                  }`}>
                  {['A', 'B', 'C', 'D'][index]}
                </div>
                {showResult && option === quizData[currentQuestion].correctAnswer && (
                  <CheckCircle size={20} className="text-green-400 mr-2" />
                )}
                {showResult && selectedAnswer === option && option !== quizData[currentQuestion].correctAnswer && (
                  <AlertCircle size={20} className="text-red-400 mr-2" />
                )}
                <span className="text-lg">{option}</span>
              </div>
            </button>
          ))}
        </div>
        
        {/* 解説 */}
        {showResult && (
          <div className="mb-6 p-5 bg-indigo-800/50 rounded-xl border border-indigo-700">
            <h3 className="font-bold mb-2 text-amber-300 flex items-center">
              <BookOpen size={18} className="mr-2" />
              解説:
            </h3>
            <p className="text-white">{quizData[currentQuestion].explanation}</p>
          </div>
        )}
        
        {/* 次へボタン */}
        {showResult && (
          <button 
            onClick={handleNextQuestion}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-amber-600 text-indigo-900 font-bold rounded-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
          >
            {currentQuestion < quizData.length - 1 ? (
              <>
                次の問題へ
                <ChevronRight size={20} className="ml-1" />
              </>
            ) : (
              '結果を見る'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default HistoryQuizApp;