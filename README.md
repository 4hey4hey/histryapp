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

# 環境変数ファイルの設定
# .env.localファイルを作成し、Firebaseの設定情報を記述します
cp .env .env.local
# .env.localファイルを編集して実際の値を設定してください

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm start
```

## Firebaseの設定

1. [Firebaseコンソール](https://console.firebase.google.com/)で新しいプロジェクトを作成
2. Firestore Databaseを有効化
3. `.env.local`ファイルに以下の値を設定（Firebaseプロジェクト設定から取得）

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Firebaseのセキュリティルールを設定（`firebase-security-rules.txt`ファイル参照）

## デプロイ方法

```bash
# GitHub Pages用のデプロイ
npm run deploy
```

デプロイ後は以下のURLでアクセスできます：
`https://あなたのユーザー名.github.io/histryapp/`

## セキュリティに関する注意点

- 環境変数を使用してAPIキーを保護していますが、GitHub Pagesではビルド時に値が埋め込まれます
- 本格的なセキュリティが必要な場合は、FirebaseのセキュリティルールやApp Checkを設定してください

## ライセンス

歴史部 - 文化祭プロジェクト