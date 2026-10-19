# Googleログインのローカル設定

1. Google Cloud Consoleでプロジェクトを選び、Google Auth Platformでアプリ名、連絡先、対象ユーザーを設定します。テスト中は使用するGoogleアカウントをテストユーザーに追加します。
2. OAuthクライアントを「ウェブ アプリケーション」として作成します。
   - JavaScript生成元: `http://localhost:5173`
   - 承認済みリダイレクトURI: `http://localhost:5173/api/auth/callback/google`
3. `.env.example`を`.env.local`へコピーし、Googleが発行したクライアントIDとシークレットを記入します。
4. `BETTER_AUTH_SECRET`には次のコマンドで生成した値を記入します。

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

5. 開発サーバーを再起動し、`http://localhost:5173/`からGoogleでログインします。別ポートの場合はGoogle側の登録URLも合わせます。

`.env.local`はGitの対象外です。シークレットを画面側に書いたり、チャットに貼ったりしないでください。

## 動作確認

- 未ログイン状態で`/api/expenses`と`/api/me`が401を返す。
- ログインして支出を保存し、再読み込みしても残る。
- ログアウトすると入力欄と一覧が消える。
- 別のGoogleアカウントでは前のアカウントの支出が表示されない。
- 所有者を指定したリクエストを送っても、APIは常にログイン中のユーザーIDで保存する。

既存の支出は削除せず、`user_id`がNULLのまま保持しています。自動で最初のログインユーザーに割り当てないため、ログイン後の一覧には表示されません。

本番公開時は本番ドメインのリダイレクトURIと本番用シークレットの設定、認証テーブルのマイグレーション確認も必要です。この手順はローカル用です。

参考: https://www.better-auth.com/docs/authentication/google
