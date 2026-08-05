# ⌨️ タイピングヒーロー (Typing Hero JP) - 日本語ローマ字タイピング練習 Web サービス

小学生から高校生まで楽しく学べる、1920x1080解像度対応の本格派**日本語ローマ字タイピング練習サービス**です。

---

## 🌟 主な特徴

- **1920 x 1080 デフォルト解像度 & 自動スケール調整**: モニターのサイズに合わせて画面全体が自動的に拡大・縮小拡大します。
- **100% 日本語 UI**: すべての操作画面・ガイダンスが日本語対応。
- **6つの段階別練習モード**:
  1. **各ポジション練習**: ホームポジションと指ごとの基本キー練習
  2. **単語練習1 (あいうえお順)**: 50音順で学べる基礎単語（ルビ付き）
  3. **単語練習2**: 学校・生活・自然・食べ物などのテーマ別単語
  4. **文節練習**: 「きょうは」「いい てんきだ」などの文節区切り練習
  5. **短文練習**: 1行ことわざ、アニメ名言、日常会話
  6. **長文練習**: 太宰治『走れメロス』、宮沢賢治などの名作文学
  - *(おまけ)* **タイピングゲーム**: 落ちてくる単語を撃破する酸性雨ゲーム
- **柔軟なローマ字入力エンジン**: `shi/si`, `tsu/tu`, `fu/hu`, `ji/zi`, `nn/n'` などの主要なローマ字入力方式を自動判別
- **生徒ログイン & 練習レポート (100名以上対応)**:
  - 生徒プロファイル作成 & PINログイン
  - KPM/CPM（打字速度）、WPM、正確率、成長グラフ、PDFレポート出力
  - **管理者モード (教員用ダッシュボード)**: クラス全員のランキングと成績確認
- **Firebase クラウド同期対応**: 学校・会社・自宅どこからでも同じ成績を自動同期（無料枠で1,000名以上対応）

---

## 🚀 ローカルでの実行方法

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

---

## 🌐 GitHub 連携 & GitHub Pages 自動デプロイ手順

1. **GitHub にリポジトリを作成**（例: `typing-hero-jp`）
2. **ローカルからコードをプッシュ**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Typing Hero JP"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/typing-hero-jp.git
   git push -u origin main
   ```
3. **GitHub Pages の設定**:
   - GitHub リポジトリの **Settings > Pages** に移動
   - **Source** を **GitHub Actions** に変更
   - プッシュするたびに自動でビルドされ、`https://YOUR_USERNAME.github.io/typing-hero-jp/` で公開されます。

---

## 🔥 Firebase 設定方法 (オプショナル)

1. [Firebase Console](https://console.firebase.google.com/) にアクセスし、プロジェクトを作成します。
2. Web App を追加し、構成オブジェクト (apiKey, authDomain, projectId 等) をコピーします。
3. `src/js/firebase.js` の `firebaseConfig` に貼り付けると、クラウド同期機能が有効になります。
