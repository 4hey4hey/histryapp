import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ChevronRight, Clock, Award, RotateCcw, BookOpen, Scroll, Shield } from 'lucide-react';
import { useQuiz } from '../contexts/QuizContext';

const HistoryQuizApp = () => {
  const { questions, loading } = useQuiz();
  
  // ローディング中の表示
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 text-white">
        <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl font-bold">データを読み込み中...</p>
          <p className="text-gray-400 mt-2">少々お待ちください</p>
        </div>
      </div>
    );
  }
  
  // クイズの問題データ - コンテキストから取得
  const quizData = questions;

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 text-white">
        <div className="max-w-md w-full bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-700">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-white">
              歴史クイズ
            </h1>
            <p className="text-lg text-gray-400">〜時を超える知識の旅〜</p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
              <Scroll size={48} className="text-gray-300" />
            </div>
          </div>
          
          <div className="mb-8 text-center">
            <p className="mb-4">日本の歴史を巡る5つの質問に挑戦しましょう！</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 p-3 rounded-lg flex items-center">
                <Clock className="text-gray-300 mr-2" size={20} />
                <span>制限時間: 30秒</span>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg flex items-center">
                <Shield className="text-gray-300 mr-2" size={20} />
                <span>難易度: 中級</span>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg flex items-center">
                <BookOpen className="text-gray-300 mr-2" size={20} />
                <span>問題数: 5問</span>
              </div>
              <div className="bg-gray-700 p-3 rounded-lg flex items-center">
                <Award className="text-gray-300 mr-2" size={20} />
                <span>解説付き</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={startQuiz}
            className="w-full py-4 px-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-xl hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-200 shadow-lg"
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full shadow-xl border border-gray-700 text-white">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-white">クイズ結果</h1>
            <p className="text-gray-400">あなたの歴史知識を振り返ろう</p>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
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
            <div className="w-full bg-gray-700 h-4 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gray-500 to-gray-400"
                style={{ width: `${(score / quizData.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mb-8 p-5 bg-gray-700 rounded-xl text-center">
            <p className="text-lg mb-1 text-white">
              正答率: {Math.round((score / quizData.length) * 100)}%
            </p>
            <p className="text-sm text-gray-400">
              {score === 5 ? "素晴らしい！あなたは歴史の達人です！" :
               score >= 3 ? "良い成績です！もう少しで完璧です！" :
               "もう一度挑戦して歴史知識を深めましょう！"}
            </p>
          </div>
          
          <button 
            onClick={resetQuiz}
            className="w-full py-4 px-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-xl hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
          >
            <RotateCcw size={20} className="mr-2" />
            もう一度挑戦する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className={`bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-700 transition-opacity duration-500 ${animation ? 'opacity-0' : 'opacity-100'}`}>
        {/* ヘッダー部分 */}
        <div className="flex justify-between items-center mb-6">
          <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-xl text-sm font-bold flex items-center">
            <span className="mr-1">問題</span>
            <span className="text-xl">{currentQuestion + 1}</span>
            <span className="text-gray-400">/{quizData.length}</span>
          </div>
          <div className={`flex items-center bg-gray-700 px-4 py-2 rounded-xl ${timer <= 10 ? 'text-red-500' : 'text-gray-300'}`}>
            <Clock size={18} className="mr-2" />
            <span className="font-bold">{timer}</span>
          </div>
        </div>
        
        {/* 問題文 */}
        <div className="bg-gray-700 rounded-xl p-5 mb-6 text-white">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full mr-3 text-xl text-white">
              {quizData[currentQuestion].icon}
            </div>
            <h2 className="text-xl font-bold text-white">{quizData[currentQuestion].question}</h2>
          </div>
          
          {/* タイマープログレスバー */}
          <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${timer <= 10 ? 'bg-red-500' : 'bg-gray-400'} transition-all duration-1000 ease-linear`}
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
                    ? 'bg-green-900/50 border-green-700 text-white'
                    : selectedAnswer === option
                      ? 'bg-red-900/50 border-red-700 text-white'
                      : 'bg-gray-700/50 border-gray-600 text-gray-300'
                  : selectedAnswer === option
                    ? 'bg-gray-600 border-gray-500 text-white'
                    : 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold shrink-0 
                  ${showResult
                    ? option === quizData[currentQuestion].correctAnswer
                      ? 'bg-green-600 text-white'
                      : selectedAnswer === option
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-white'
                    : 'bg-gray-600 text-white'
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
          <div className="mb-6 p-5 bg-gray-700 rounded-xl border border-gray-600 text-white">
            <h3 className="font-bold mb-2 text-gray-300 flex items-center">
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
            className="w-full py-4 px-6 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-xl hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
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