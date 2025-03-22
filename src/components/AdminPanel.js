import React, { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { Save, Plus, Edit2, Trash2, ChevronLeft, FileText, Settings, Search, Loader } from 'lucide-react';

const AdminPanel = () => {
  // ステート管理
  const { questions, saveQuestion, deleteQuestion, resetQuestions, loading } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("questions");
  const [showPreview, setShowPreview] = useState(false);
  
  // ローディング中の表示
  if (loading) {
    return (
      <div className={"min-h-screen bg-gray-800 flex items-center justify-center"}>
        <div className={"bg-gray-700 rounded-lg shadow-md p-8 max-w-md w-full text-center"}>
          <Loader className={"h-12 w-12 animate-spin mx-auto text-white mb-4"} />
          <h2 className={"text-xl font-bold text-white mb-2"}>データを読み込み中...</h2>
          <p className={"text-gray-300"}>管理パネルの準備中です。少々お待ちください。</p>
        </div>
      </div>
    );
  }

  // 新規問題作成
  const handleCreateQuestion = () => {
    const newQuestion = {
      id: questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      explanation: "",
      icon: "📚"
    };
    setCurrentQuestion(newQuestion);
    setIsEditing(true);
  };

  // 問題編集
  const handleEditQuestion = (question) => {
    setCurrentQuestion({...question});
    setIsEditing(true);
  };

  // 問題削除
  const handleDeleteQuestion = (id) => {
    if (window.confirm("この問題を削除してもよろしいですか？")) {
      deleteQuestion(id);
    }
  };

  // 問題保存
  const handleSaveQuestion = () => {
    // バリデーション
    if (!currentQuestion.question || 
        currentQuestion.options.some(opt => !opt) || 
        !currentQuestion.correctAnswer || 
        !currentQuestion.options.includes(currentQuestion.correctAnswer) ||
        !currentQuestion.explanation) {
      alert("すべての項目を入力し、正解は選択肢の中から選んでください。");
      return;
    }

    // QuizContextのsaveQuestion関数を使用
    saveQuestion(currentQuestion);
    setCurrentQuestion(null);
    setIsEditing(false);
    
    // 保存完了メッセージ
    alert("問題が保存されました。");
  };

  // 編集キャンセル
  const handleCancelEdit = () => {
    setCurrentQuestion(null);
    setIsEditing(false);
  };

  // 問題フォームの更新
  const handleQuestionChange = (e) => {
    setCurrentQuestion({
      ...currentQuestion,
      [e.target.name]: e.target.value
    });
  };

  // 選択肢の更新
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({
      ...currentQuestion,
      options: updatedOptions
    });
  };

  // 検索フィルター
  const filteredQuestions = questions.filter(question => 
    question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.explanation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // プレビュー画面
  if (showPreview && currentQuestion) {
    return (
      <div className={"min-h-screen bg-gradient-to-br from-gray-900 to-black p-4"}>
        <div className={"max-w-4xl mx-auto bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl p-6 border border-gray-700 text-white"}>
          <div className={"flex items-center mb-6"}>
            <button
              onClick={() => setShowPreview(false)}
              className={"mr-4 bg-gray-700 p-2 rounded-full hover:bg-gray-600 text-gray-300"}
            >
              <ChevronLeft size={20} className={"text-gray-300"} />
            </button>
            <h2 className={"text-xl font-bold"}>問題プレビュー</h2>
          </div>
          
          <div className={"bg-gray-700 rounded-xl p-6 mb-6"}>
            <div className={"flex items-center mb-4"}>
              <div className={"w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full mr-3 text-xl text-white"}>
                {currentQuestion.icon}
              </div>
              <h3 className={"text-xl font-bold"}>{currentQuestion.question}</h3>
            </div>
            
            <div className={"space-y-3 mb-6"}>
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    option === currentQuestion.correctAnswer 
                      ? 'bg-green-900/50 border-green-700' 
                      : 'bg-gray-700/50 border-gray-600'
                  }`}
                >
                  <div className={"flex items-center"}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold 
                      ${option === currentQuestion.correctAnswer ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
                      {['A', 'B', 'C', 'D'][index]}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={"p-5 bg-gray-700 rounded-xl border border-gray-600"}>
              <h4 className={"font-bold mb-2 text-gray-300"}>解説:</h4>
              <p className={"text-white"}>{currentQuestion.explanation}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowPreview(false)}
            className={"bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold px-4 py-2 rounded-xl hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"}
          >
            編集に戻る
          </button>
        </div>
      </div>
    );
  }

  // メイン管理画面
  return (
    <div className={"min-h-screen bg-gray-800"}>
      {/* ヘッダー */}
      <div className={"bg-gray-900 text-white p-4"}>
        <div className={"max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0"}>
          <h1 className={"text-lg sm:text-xl font-bold text-center w-full sm:text-left sm:w-auto"}>歴史クイズ管理パネル</h1>
          <div className={"flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto items-center"}>
            <button
              onClick={() => setActiveTab("questions")}
              className={`w-full sm:w-auto px-4 py-2 rounded ${
                activeTab === "questions" ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <div className={"flex items-center justify-center"}>
                <FileText size={16} className={"mr-2"} />
                問題管理
              </div>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full sm:w-auto px-4 py-2 rounded ${
                activeTab === "settings" ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <div className={"flex items-center justify-center"}>
                <Settings size={16} className={"mr-2"} />
                設定
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツエリア */}
      <div className={"max-w-6xl mx-auto p-4 sm:p-6"}>
        {/* 残りのコンテンツは同様に修正 */}
        {/* 省略 */}
      </div>
    </div>
  );
};

export default AdminPanel;