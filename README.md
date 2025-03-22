# 歴史クイズアプリ

文化祭向けに開発された日本史のクイズアプリです。

## 機能

- 複数の日本史問題
- 管理画面での問題編集機能
- 制限時間付きクイズ
- 回答後の解説表示
- 最終スコアの表示

## インストール方法

```bash
# リポジトリをクローン
git clone https://github.com/あなたのユーザー名/histryapp.git
cd histryapp

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm start
```

## デプロイ方法

```bash
# GitHub Pages用のデプロイ
npm run deploy
```

## Firebase連携方法

1. Firebaseプロジェクトを作成します
2. src/firebase.js の設定を更新します
3. AdminPanel.jsおよびHistoryQuizApp.jsでのローカルストレージを使用している部分をFirebaseに置き換えます

## ライセンス

歴史部 - 文化祭プロジェクト