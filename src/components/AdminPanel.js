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
      <div className="h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <Loader className="h-12 w-12 mx-auto text-white mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-white mb-2">データ読み込み中</h2>
          <p className="text-gray-400">少々お待ちください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 overflow-auto">
      <div className="container mx-auto px-4 py-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">歴史クイズ管理パネル</h1>
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
        <div className="bg-gray-800 rounded-lg p-4">
          {activeTab === "questions" && (
            <div>
              {/* 問題一覧 */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">問題一覧</h2>
                  <button 
                    onClick={() => {
                      setCurrentQuestion({
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswer: "",
                        explanation: "",
                        icon: "📚"
                      });
                      setIsEditing(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    新規問題
                  </button>
                </div>

                {/* 検索 */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="問題を検索..."
                    className="w-full p-2 bg-gray-700 text-white rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* 問題リスト */}
                <div className="space-y-2">
                  {questions
                    .filter(q => 
                      q.question.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((question, index) => (
                      <div 
                        key={question.id} 
                        className="bg-gray-700 p-4 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <span className="mr-2">{question.icon}</span>
                          <span className="text-white">{question.question}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setCurrentQuestion(question);
                              setIsEditing(true);
                            }}
                            className="text-blue-400"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('この問題を削除しますか？')) {
                                deleteQuestion(question.id);
                              }
                            }}
                            className="text-red-400"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              {/* 問題編集 */}
              {isEditing && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h2 className="text-xl font-bold text-white mb-4">
                    {currentQuestion.id ? '問題を編集' : '新規問題作成'}
                  </h2>
                  
                  <div className="space-y-4">
                    {/* 問題文 */}
                    <div>
                      <label className="block text-white mb-2">問題文</label>
                      <input
                        type="text"
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({
                          ...currentQuestion, 
                          question: e.target.value
                        })}
                        className="w-full p-2 bg-gray-800 text-white rounded-lg"
                        placeholder="問題文を入力"
                      />
                    </div>

                    {/* アイコン */}
                    <div>
                      <label className="block text-white mb-2">アイコン</label>
                      <input
                        type="text"
                        value={currentQuestion.icon}
                        onChange={(e) => setCurrentQuestion({
                          ...currentQuestion, 
                          icon: e.target.value
                        })}
                        className="w-full p-2 bg-gray-800 text-white rounded-lg"
                        placeholder="絵文字を入力 (例: 📚)"
                      />
                    </div>

                    {/* 選択肢 */}
                    {currentQuestion.options.map((option, index) => (
                      <div key={index}>
                        <label className="block text-white mb-2">
                          選択肢 {index + 1}
                        </label>
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
                          className="w-full p-2 bg-gray-800 text-white rounded-lg"
                          placeholder={`選択肢 ${index + 1}を入力`}
                        />
                      </div>
                    ))}

                    {/* 正解選択 */}
                    <div>
                      <label className="block text-white mb-2">正解の選択肢</label>
                      <select
                        value={currentQuestion.correctAnswer}
                        onChange={(e) => setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: e.target.value
                        })}
                        className="w-full p-2 bg-gray-800 text-white rounded-lg"
                      >
                        <option value="">選択してください</option>
                        {currentQuestion.options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 解説 */}
                    <div>
                      <label className="block text-white mb-2">解説</label>
                      <textarea
                        value={currentQuestion.explanation}
                        onChange={(e) => setCurrentQuestion({
                          ...currentQuestion, 
                          explanation: e.target.value
                        })}
                        className="w-full p-2 bg-gray-800 text-white rounded-lg"
                        rows="4"
                        placeholder="解説を入力"
                      />
                    </div>

                    {/* 保存・キャンセルボタン */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={() => {
                          if (
                            !currentQuestion.question || 
                            !currentQuestion.options.every(opt => opt) ||
                            !currentQuestion.correctAnswer ||
                            !currentQuestion.explanation
                          ) {
                            alert('すべての項目を入力してください');
                            return;
                          }
                          saveQuestion(currentQuestion);
                          setIsEditing(false);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 設定タブ */}
          {activeTab === "settings" && (
            <div className="text-white p-4 bg-gray-700 rounded-lg">
              <h2 className="text-xl font-bold mb-4">設定</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">アプリ情報</h3>
                  <p>問題数: {questions.length}問</p>
                  <p>最終更新: {new Date().toLocaleDateString()}</p>
                </div>
                <div>
                  <button 
                    onClick={() => {
                      if (window.confirm('すべての問題をリセットしますか？')) {
                        resetQuestions();
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    データリセット
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;