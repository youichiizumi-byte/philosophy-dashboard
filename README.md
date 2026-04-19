# PhilosophyOS 🧠

経営者の哲学を15分で入力して、専用ダッシュボードを自動生成するSaaSシステム。

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes (Edge Runtime)
- **データベース**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **AI分析**: Anthropic Claude API (claude-opus-4-5)
- **決済**: Stripe (サブスクリプション + Webhook)
- **デプロイ**: Vercel (自動デプロイAPI)
- **アニメーション**: Framer Motion

---

## セットアップ手順

### 1. リポジトリのクローンとインストール

```bash
git clone https://github.com/yourname/philosophy-dashboard
cd philosophy-dashboard
npm install
```

### 2. Supabase プロジェクト作成

1. [supabase.com](https://supabase.com) でプロジェクト作成
2. マイグレーションを実行:
   ```bash
   npx supabase db push
   # または Supabase ダッシュボードの SQL Editor でマイグレーションファイルを実行
   ```
3. Authentication → Providers で Email を有効化
4. Project Settings → API からURLとキーを取得

### 3. Anthropic API キーの取得

1. [console.anthropic.com](https://console.anthropic.com) でAPI key作成
2. モデル: `claude-opus-4-5` を使用

### 4. Stripe セットアップ

```bash
# Stripe CLIをインストール
brew install stripe/stripe-cli/stripe

# ログイン
stripe login
```

Stripeダッシュボードで:
1. **Products** → 3プランを作成:
   - スターター: ¥4,980/月
   - プロフェッショナル: ¥14,800/月
   - エンタープライズ: ¥49,800/月

2. 各プランのPrice IDを `.env.local` に設定

3. **Webhooks** で以下のイベントをエンドポイント (`/api/webhook/stripe`) に登録:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`

### 5. Vercel デプロイAPI設定

1. [vercel.com](https://vercel.com) でプロジェクト作成
2. Settings → Tokens でトークン作成
3. GitHubリポジトリと連携

### 6. 環境変数設定

```bash
cp .env.example .env.local
# .env.local を編集して各値を設定
```

### 7. 開発サーバー起動

```bash
npm run dev
# http://localhost:3000 でアクセス
```

---

## プロジェクト構造

```
philosophy-dashboard/
├── app/
│   ├── (onboarding)/
│   │   └── page.tsx              # オンボーディングフォーム (3ステップ)
│   ├── (dashboard)/
│   │   └── [slug]/page.tsx       # 専用ダッシュボードページ
│   └── api/
│       ├── analyze/route.ts      # Claude API分析エンドポイント
│       ├── deploy/route.ts       # Vercel自動デプロイ
│       └── webhook/stripe/       # Stripe Webhook処理
├── components/
│   ├── onboarding/
│   │   ├── Step1Company.tsx      # 企業情報入力
│   │   ├── Step2Philosophy.tsx   # 経営哲学10問
│   │   ├── Step3Settings.tsx     # ブランディング設定
│   │   └── GeneratingScreen.tsx  # AI生成プログレス画面
│   └── dashboard/
│       └── DashboardContent.tsx  # 生成されたダッシュボードUI
├── lib/
│   ├── supabase.ts              # Supabaseクライアント
│   ├── claude.ts                # Claude API呼び出し
│   ├── stripe.ts                # Stripe処理
│   └── vercel-deploy.ts         # Vercelデプロイ
├── types/index.ts               # TypeScript型定義
└── supabase/migrations/         # DBスキーマ
```

---

## ユーザーフロー

```
1. ランディングページ → プラン選択 → Stripe決済
2. オンボーディング開始 (合計約15分)
   Step 1: 企業情報 (3分)
     - 会社名、業種、規模、設立年
   Step 2: 経営哲学10問 (10分)
     - ミッション、価値観、リーダーシップスタイル
     - 意思決定基準、成功の定義、文化観
     - 顧客哲学、ビジョン、失敗観、チーム観
   Step 3: ブランディング設定 (2分)
     - カラー、フォント、スタイル選択
3. AI分析・生成 (約30秒)
   - Claude APIが哲学を抽出・構造化
   - ダッシュボードをSupabaseに保存
4. 専用ダッシュボード表示
   - philosophyos.com/[会社名-slug]
   - 概要 / コア原則 / カルチャー / 戦略 の4タブ
5. (オプション) カスタムドメイン設定
6. (オプション) Vercel自動デプロイ
```

---

## Vercel本番デプロイ

```bash
# Vercel CLIでデプロイ
npx vercel

# 環境変数をVercelに設定
vercel env add ANTHROPIC_API_KEY production
vercel env add STRIPE_SECRET_KEY production
# ... 他の環境変数も同様に設定
```

---

## カスタマイズ

### AIプロンプトのカスタマイズ
`lib/claude.ts` の `PHILOSOPHY_SYSTEM_PROMPT` を編集することで、
抽出する哲学の観点や表現スタイルをカスタマイズできます。

### ダッシュボードUIのカスタマイズ
`components/dashboard/DashboardContent.tsx` を編集することで、
ダッシュボードのレイアウトやコンポーネントを変更できます。

### プラン・価格のカスタマイズ
`types/index.ts` の `PLANS` オブジェクトを編集してください。

---

## ライセンス
MIT
