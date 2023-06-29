## Next.js13 と Supabase で知識データベース Q&A アプリ構築(Embedding)

## 解説

https://zenn.dev/hathle/books/next-supabase-embedding-book

## set up

npm -v
9.6.7
node -v
v16.17.0

npx create-next-app nextjs-supabase-embedding --typescript
Need to install the following packages:
create-next-app@13.4.5
Ok to proceed? (y) y
✔ Would you like to use ESLint with this project? … Yes
✔ Would you like to use Tailwind CSS with this project? … No
✔ Would you like to use `src/` directory with this project? … No
✔ Use App Router (recommended)? … Yes
✔ Would you like to customize the default import alias? … No

## install

- tailwindcss
  npx tailwindcss init -p

  - npm install crypto-js

## 手順

DB に保存した記事一覧から、質問に近い内容のものを選んで表示してくれる。
・ログイン
npx supabase login

・生成された URL からアクセストークン取得して入力
You can generate an access token from https://app.supabase.com/account/tokens
Enter your access token: sbp_036936ee65e477e354dcd3777df6a869aa64362b

・初期化
npx supabase init

・データベースを関連づける
npx supabase link --project-ref grnpxsuuvbhjvbdhhehg

・型定義ファイル生成
npx supabase gen types typescript --linked > lib/database.types.ts

database password : E4e!j4jXWDpp6jy
