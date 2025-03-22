document.addEventListener('DOMContentLoaded', function() {
  // アプリにクラスを追加
  const appElement = document.querySelector('.App');
  if (appElement) {
    appElement.classList.add('enhanced-ui');
  }
  
  // 問題コンテナにスタイルを適用
  const questionContainers = document.querySelectorAll('.bg-gray-800\\/90');
  questionContainers.forEach(container => {
    container.classList.add('quiz-container');
    container.classList.add('animate-fadeIn');
  });
  
  // タイマーバーを強調
  const timerBars = document.querySelectorAll('.bg-gray-400, .bg-red-500');
  timerBars.forEach(bar => {
    bar.classList.add('timer-bar');
  });
  
  // アイコンコンテナを強調
  const iconContainers = document.querySelectorAll('.w-10.h-10.flex.items-center.justify-center.bg-gray-600.rounded-full');
  iconContainers.forEach(container => {
    container.classList.add('icon-container');
    
    // もし中に日本語の文字があれば、アイコンに置き換え
    const textContent = container.textContent.trim();
    if (textContent === '⚔️') {
      const img = document.createElement('img');
      img.src = 'sword-icon.svg';
      img.alt = '刀剣';
      img.classList.add('w-6', 'h-6');
      container.textContent = '';
      container.appendChild(img);
    } else if (textContent === '🏯') {
      const img = document.createElement('img');
      img.src = 'castle-icon.svg';
      img.alt = '城';
      img.classList.add('w-6', 'h-6');
      container.textContent = '';
      container.appendChild(img);
    } else if (textContent === '📚') {
      const img = document.createElement('img');
      img.src = 'scroll-icon.svg';
      img.alt = '書物';
      img.classList.add('w-6', 'h-6');
      container.textContent = '';
      container.appendChild(img);
    }
  });
  
  // 選択肢のスタイル強化
  const optionButtons = document.querySelectorAll('[class*="py-4 px-5 rounded-xl border"]');
  optionButtons.forEach(button => {
    // 正解・不正解のクラス
    if (button.classList.contains('bg-green-900/50')) {
      button.classList.add('correct-answer');
    } else if (button.classList.contains('bg-red-900/50')) {
      button.classList.add('wrong-answer');
    }
    
    // 通常のクラス
    button.classList.add('hover:shadow-lg');
  });
  
  // 解説ボックスを強調
  const explanationBoxes = document.querySelectorAll('.p-5.bg-gray-700.rounded-xl.border.border-gray-600');
  explanationBoxes.forEach(box => {
    box.classList.add('explanation-box');
  });
  
  // 結果表示を強調
  const scoreDisplays = document.querySelectorAll('.p-5.bg-gray-700.rounded-xl.text-center');
  scoreDisplays.forEach(display => {
    display.classList.add('score-display');
  });
  
  // トロフィーアイコンを強調
  const trophyEmojis = document.querySelectorAll('.text-5xl');
  trophyEmojis.forEach(emoji => {
    if (emoji.textContent.includes('🏆')) {
      emoji.classList.add('trophy-icon');
    }
  });
  
  // フッターの追加
  const root = document.getElementById('root');
  if (root && !document.querySelector('footer')) {
    const footer = document.createElement('footer');
    footer.innerHTML = '© 2023 歴史クイズアプリ | 歴史部 文化祭プロジェクト';
    root.appendChild(footer);
  }
  
  // ナビゲーションバーの強調
  const navBar = document.querySelector('.bg-gray-900.text-white.p-4');
  if (navBar) {
    navBar.classList.add('enhanced-nav');
  }
  
  // 「歴史クイズ」タイトルの装飾
  const titles = document.querySelectorAll('.text-4xl.font-bold');
  titles.forEach(title => {
    if (title.textContent.includes('歴史クイズ')) {
      title.classList.add('main-title');
      
      // 装飾的な要素を追加
      const decoration = document.createElement('div');
      decoration.className = 'title-decoration';
      decoration.innerHTML = `
        <img src="samurai-icon.svg" alt="侍" class="w-8 h-8 inline-block mx-2" />
      `;
      title.parentNode.insertBefore(decoration, title.nextSibling);
    }
  });
});
