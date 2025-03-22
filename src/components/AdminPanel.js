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
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="bg-gray-700 rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <Loader className="h-12 w-12 animate-spin mx-auto text-white mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">データを読み込み中...</h2>
          <p className="text-gray-300">管理パネルの準備中です。少々お待ちください。</p>
        </div>
      </div>
    );
  }

  // QuizContextからデータを取得するようにしたので、初期化のコードは削除

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
        <div className="max-w-4xl mx-auto bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl p-6 border border-gray-700 text-white">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowPreview(false)}
              className="mr-4 bg-gray-700 p-2 rounded-full hover:bg-gray-600 text-gray-300"
            >
              <ChevronLeft size={20} className="text-gray-300" />
            </button>
            <h2 className="text-xl font-bold">問題プレビュー</h2>
          </div>
          
          <div className="bg-gray-700 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-600 rounded-full mr-3 text-xl text-white">
                {currentQuestion.icon}
              </div>
              <h3 className="text-xl font-bold">{currentQuestion.question}</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    option === currentQuestion.correctAnswer 
                      ? 'bg-green-900/50 border-green-700' 
                      : 'bg-gray-700/50 border-gray-600'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold 
                      ${option === currentQuestion.correctAnswer ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}>
                      {['A', 'B', 'C', 'D'][index]}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-5 bg-gray-700 rounded-xl border border-gray-600">
              <h4 className="font-bold mb-2 text-gray-300">解説:</h4>
              <p className="text-white">{currentQuestion.explanation}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowPreview(false)}
            className="bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold px-4 py-2 rounded-xl hover:from-gray-800 hover:to-gray-900 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
          >
            編集に戻る
          </button>
        </div>
      </div>
    );
  }

  // メイン管理画面
  return (
    <div className="min-h-screen bg-gray-800">
      {/* ヘッダー */}
      <div className="bg-gray-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">歴史クイズ管理パネル</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-4 py-2 rounded ${
                activeTab === "questions" ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center">
                <FileText size={16} className="mr-2" />
                問題管理
              </div>
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded ${
                activeTab === "settings" ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <div className="flex items-center">
                <Settings size={16} className="mr-2" />
                設定
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツエリア */}
      <div className="max-w-6xl mx-auto p-6">
        {/* 問題管理タブ */}
        {activeTab === "questions" && !isEditing && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">問題一覧</h2>
              <button
                onClick={handleCreateQuestion}
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 flex items-center"
              >
                <Plus size={18} className="mr-2" />
                新規問題作成
              </button>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="問題を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-600 bg-gray-800 text-white rounded-md"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
            
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 bg-gray-700 rounded-lg">
                <p className="text-gray-300">問題が見つかりません</p>
              </div>
            ) : (
              <div className="bg-gray-700 rounded-lg shadow-md">
                <table className="min-w-full text-white">
                  <thead>
                    <tr className="bg-gray-800 border-b border-gray-600">
                      <th className="py-3 px-4 text-left">#</th>
                      <th className="py-3 px-4 text-left">アイコン</th>
                      <th className="py-3 px-4 text-left">問題</th>
                      <th className="py-3 px-4 text-left">正解</th>
                      <th className="py-3 px-4 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((question, index) => (
                      <tr key={question.id} className="border-b border-gray-600 hover:bg-gray-600">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 text-xl">{question.icon}</td>
                        <td className="py-3 px-4">
                          <div className="line-clamp-1">{question.question}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-green-900 text-green-100 px-2 py-1 rounded-full text-sm">
                            {question.correctAnswer}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="編集"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="削除"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        {/* 問題編集フォーム */}
        {activeTab === "questions" && isEditing && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {currentQuestion.id && questions.some(q => q.id === currentQuestion.id) ? "問題を編集" : "新規問題作成"}
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowPreview(true)}
                  className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
                >
                  プレビュー
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  キャンセル
                </button>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label className="block text-white font-bold mb-2">
                  問題文
                </label>
                <input
                  type="text"
                  name="question"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"
                  placeholder="問題文を入力してください"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  アイコン
                </label>
                <input
                  type="text"
                  name="icon"
                  value={currentQuestion.icon}
                  onChange={handleQuestionChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"
                  placeholder="絵文字またはアイコン（例：📚, ⚔️, 🏯）"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  選択肢
                </label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full mr-2 text-sm font-bold">
                      {['A', 'B', 'C', 'D'][index]}
                    </div>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"
                      placeholder={`選択肢 ${index + 1}`}
                    />
                    <div className="ml-2">
                      <input
                        type="radio"
                        id={`option${index}`}
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === option}
                        onChange={() => setCurrentQuestion({...currentQuestion, correctAnswer: option})}
                        className="mr-1"
                        disabled={!option}
                      />
                      <label htmlFor={`option${index}`}>正解</label>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">
                  解説
                </label>
                <textarea
                  name="explanation"
                  value={currentQuestion.explanation}
                  onChange={handleQuestionChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"
                  rows="4"
                  placeholder="解説を入力してください"
                ></textarea>
              </div>
              
              <button
                onClick={handleSaveQuestion}
                className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 flex items-center"
              >
                <Save size={18} className="mr-2" />
                保存
              </button>
            </div>
          </>
        )}
        
        {/* 設定タブ */}
        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">設定</h2>
            
            <div className="bg-gray-700 rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">クイズアプリ情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">作成者</p>
                    <p className="text-white">歴史部</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">問題数</p>
                    <p className="text-white">{questions.length}問</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">前回の更新</p>
                    <p className="text-white">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">ストレージ使用量</p>
                    <p className="text-white">{Math.round(JSON.stringify(questions).length / 1024)} KB</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">データ管理</h3>
                <div className="space-y-4">
                  <div>
                    <button 
                      onClick={() => {
                        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2));
                        const downloadAnchorNode = document.createElement('a');
                        downloadAnchorNode.setAttribute("href", dataStr);
                        downloadAnchorNode.setAttribute("download", "quiz_questions.json");
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                      }}
                      className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      問題データをエクスポート
                    </button>
                    <p className="text-sm text-gray-400 mt-1">JSONファイルとしてダウンロードします</p>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">
                      問題データをインポート
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const importedData = JSON.parse(event.target.result);
                              if (Array.isArray(importedData) && importedData.length > 0) {
                                if (window.confirm(`${importedData.length}問の問題をインポートします。現在のデータは上書きされます。よろしいですか？`)) {
                                  // 全ての問題を一つずつsaveQuestionでインポート
                                  importedData.forEach(question => {
                                    saveQuestion(question);
                                  });
                                  alert("データのインポートが完了しました。");
                                }
                              } else {
                                alert("有効な問題データが含まれていません。");
                              }
                            } catch (error) {
                              alert("データの読み込みに失敗しました。有効なJSONファイルを選択してください。");
                              console.error(error);
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-gray-700 file:text-gray-300
                        hover:file:bg-gray-600"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-4">データリセット</h3>
                <button 
                  onClick={() => {
                    if (window.confirm("すべての問題データをリセットして初期状態に戻しますか？この操作は元に戻せません。")) {
                      resetQuestions();
                      alert("データをリセットしました。");
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  データをリセット
                </button>
                <p className="text-sm text-gray-400 mt-1">すべての問題データが初期状態に戻ります</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;