import React, { useState, useEffect } from 'react';
import { Save, Plus, Edit2, Trash2, ChevronLeft, FileText, Settings, Search } from 'lucide-react';

const AdminPanel = () => {
  // ステート管理
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("questions");
  const [showPreview, setShowPreview] = useState(false);

  // 初期化時にローカルストレージからデータを読み込む
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
      const updatedQuestions = questions.filter(q => q.id !== id);
      setQuestions(updatedQuestions);
      localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions));
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

    let updatedQuestions;
    const existingQuestion = questions.find(q => q.id === currentQuestion.id);
    
    if (existingQuestion) {
      // 既存の問題を更新
      updatedQuestions = questions.map(q => 
        q.id === currentQuestion.id ? currentQuestion : q
      );
    } else {
      // 新規問題を追加
      updatedQuestions = [...questions, currentQuestion];
    }
    
    setQuestions(updatedQuestions);
    localStorage.setItem('quizQuestions', JSON.stringify(updatedQuestions));
    setCurrentQuestion(null);
    setIsEditing(false);
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 p-4">
        <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20 text-white">
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowPreview(false)}
              className="mr-4 bg-indigo-800/70 p-2 rounded-full hover:bg-indigo-700"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <h2 className="text-xl font-bold">問題プレビュー</h2>
          </div>
          
          <div className="bg-indigo-800/50 rounded-xl p-6 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 flex items-center justify-center bg-amber-500 rounded-full mr-3 text-xl">
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
                      ? 'bg-green-500/30 border-green-400' 
                      : 'bg-indigo-800/50 border-indigo-700'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm font-bold 
                      ${option === currentQuestion.correctAnswer ? 'bg-green-500 text-white' : 'bg-indigo-700 text-white'}`}>
                      {['A', 'B', 'C', 'D'][index]}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-5 bg-indigo-800/50 rounded-xl border border-indigo-700">
              <h4 className="font-bold mb-2 text-amber-300">解説:</h4>
              <p>{currentQuestion.explanation}</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowPreview(false)}
            className="bg-gradient-to-r from-amber-400 to-amber-600 text-indigo-900 font-bold px-4 py-2 rounded-xl hover:from-amber-500 hover:to-amber-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
          >
            編集に戻る
          </button>
        </div>
      </div>
    );
  }

  // メイン管理画面
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダー */}
      <div className="bg-indigo-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">歴史クイズ管理パネル</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-4 py-2 rounded ${
                activeTab === "questions" ? "bg-indigo-700" : "hover:bg-indigo-700"
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
                activeTab === "settings" ? "bg-indigo-700" : "hover:bg-indigo-700"
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
              <h2 className="text-2xl font-bold text-gray-800">問題一覧</h2>
              <button
                onClick={handleCreateQuestion}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
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
                  className="w-full p-3 pr-10 border border-gray-300 rounded-md"
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>
            
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">問題が見つかりません</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left">#</th>
                      <th className="py-3 px-4 text-left">アイコン</th>
                      <th className="py-3 px-4 text-left">問題</th>
                      <th className="py-3 px-4 text-left">正解</th>
                      <th className="py-3 px-4 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((question, index) => (
                      <tr key={question.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{index + 1}</td>
                        <td className="py-3 px-4 text-xl">{question.icon}</td>
                        <td className="py-3 px-4">
                          <div className="line-clamp-1">{question.question}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
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
              <h2 className="text-2xl font-bold text-gray-800">
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
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  問題文
                </label>
                <input
                  type="text"
                  name="question"
                  value={currentQuestion.question}
                  onChange={handleQuestionChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows="4"
                  placeholder="解説を入力してください"
                ></textarea>
              </div>
              
              <button
                onClick={handleSaveQuestion}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center"
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">設定</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">クイズアプリ情報</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">作成者</p>
                    <p>歴史部</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">問題数</p>
                    <p>{questions.length}問</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">前回の更新</p>
                    <p>{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ストレージ使用量</p>
                    <p>{Math.round(JSON.stringify(questions).length / 1024)} KB</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4">データ管理</h3>
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
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      問題データをエクスポート
                    </button>
                    <p className="text-sm text-gray-500 mt-1">JSONファイルとしてダウンロードします</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">
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
                                  setQuestions(importedData);
                                  localStorage.setItem('quizQuestions', JSON.stringify(importedData));
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
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700
                        hover:file:bg-indigo-100"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">データリセット</h3>
                <button 
                  onClick={() => {
                    if (window.confirm("すべての問題データをリセットして初期状態に戻しますか？この操作は元に戻せません。")) {
                      localStorage.removeItem('quizQuestions');
                      window.location.reload();
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  データをリセット
                </button>
                <p className="text-sm text-gray-500 mt-1">すべての問題データが初期状態に戻ります</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;