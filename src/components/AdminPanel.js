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
  
  // 以前のコード続き
  className={"w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-md"};
                  placeholder="絵文字またはアイコン（例：📚, ⚔️, 🏯）"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-white font-bold mb-2">選択肢</label>
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
                <label className="block text-white font-bold mb-2">解説</label>
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
                className="w-full sm:w-auto bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-600 flex items-center justify-center"
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
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">設定</h2>
            
            <div className="bg-gray-700 rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">クイズアプリ情報</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
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
                  className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
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