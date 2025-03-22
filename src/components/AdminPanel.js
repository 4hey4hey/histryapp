import React, { useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { Save, Plus, Edit2, Trash2, ChevronLeft, FileText, Settings, Search, Loader } from 'lucide-react';

const AdminPanel = () => {
  const { questions, saveQuestion, deleteQuestion, resetQuestions, loading } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("questions");
  const [showPreview, setShowPreview] = useState(false);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <Loader className="h-12 w-12 mx-auto text-white mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-white mb-2">データ読み込み中</h2>
          <p className="text-gray-400">少々お待ちください</p>
        </div>
      </div>
    );
  }

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

  const handleSaveQuestion = () => {
    if (!currentQuestion.question || 
        currentQuestion.options.some(opt => !opt) || 
        !currentQuestion.correctAnswer || 
        !currentQuestion.options.includes(currentQuestion.correctAnswer) ||
        !currentQuestion.explanation) {
      alert("すべての項目を入力してください");
      return;
    }

    saveQuestion(currentQuestion);
    setCurrentQuestion(null);
    setIsEditing(false);
  };

  const filteredQuestions = questions.filter(question => 
    question.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* ヘッダー */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">管理パネル</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("questions")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "questions" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              問題管理
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-lg ${
                activeTab === "settings" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-800 text-gray-400"
              }`}
            >
              設定
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        {activeTab === "questions" && (
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            {!isEditing ? (
              <>
                {/* 検索とNew問題ボタン */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                  <div className="relative w-full sm:w-2/3 mb-4 sm:mb-0">
                    <input
                      type="text"
                      placeholder="問題を検索..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg"
                    />
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                  </div>
                  <button 
                    onClick={handleCreateQuestion}
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    新規問題作成
                  </button>
                </div>

                {/* 問題リスト */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="p-3 hidden sm:table-cell">#</th>
                        <th className="p-3">問題</th>
                        <th className="p-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQuestions.map((question, index) => (
                        <tr key={question.id} className="border-b border-gray-700">
                          <td className="p-3 hidden sm:table-cell">{index + 1}</td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <span className="mr-2">{question.icon}</span>
                              <span>{question.question}</span>
                            </div>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            <button 
                              onClick={() => {
                                setCurrentQuestion(question);
                                setIsEditing(true);
                              }}
                              className="inline-block text-blue-400 hover:text-blue-600 p-2"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm("この問題を削除しますか？")) {
                                  deleteQuestion(question.id);
                                }
                              }}
                              className="inline-block text-red-400 hover:text-red-600 p-2"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {currentQuestion.id ? "問題を編集" : "新規問題作成"}
                  </h2>
                  <div className="space-x-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                    >
                      キャンセル
                    </button>
                    <button 
                      onClick={handleSaveQuestion}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      保存
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">問題文</label>
                    <input
                      type="text"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({
                        ...currentQuestion, 
                        question: e.target.value
                      })}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg"
                      placeholder="問題文を入力"
                    />
                  </div>

                  {/* 選択肢入力 */}
                  {currentQuestion.options.map((option, index) => (
                    <div key={index}>
                      <label className="block text-white mb-2">選択肢 {index + 1}</label>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion({
                            ...currentQuestion,
                            options: newOptions
                          });
                        }}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg"
                        placeholder={`選択肢 ${index + 1}を入力`}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-white mb-2">正解の選択肢</label>
                    <select
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: e.target.value
                      })}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg"
                    >
                      <option value="">選択してください</option>
                      {currentQuestion.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white mb-2">解説</label>
                    <textarea
                      value={currentQuestion.explanation}
                      onChange={(e) => setCurrentQuestion({
                        ...currentQuestion, 
                        explanation: e.target.value
                      })}
                      className="w-full p-3 bg-gray-700 text-white rounded-lg"
                      rows="4"
                      placeholder="解説を入力"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;