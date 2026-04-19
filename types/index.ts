// types/index.ts

export interface Company {
  id: string
  user_id: string
  name: string
  industry: string
  size: 'startup' | 'sme' | 'enterprise'
  founded_year?: number
  website?: string
  logo_url?: string
  slug: string
  created_at: string
  updated_at: string
}

export interface PhilosophyInput {
  // Step 1: Company Info
  company_name: string
  industry: string
  company_size: 'startup' | 'sme' | 'enterprise'
  founded_year?: number
  website?: string

  // Step 2: Philosophy Questions
  mission: string                    // なぜこの会社を作ったのか
  core_values: string                // 大切にしている価値観（3〜5つ）
  leadership_style: string           // リーダーとしての在り方
  decision_framework: string         // 意思決定の基準
  success_definition: string         // 成功の定義
  culture_description: string        // 作りたい組織文化
  customer_philosophy: string        // 顧客への約束
  long_term_vision: string           // 10年後のビジョン
  failure_response: string           // 失敗・困難への向き合い方
  team_philosophy: string            // チームメンバーへの想い

  // Step 3: Settings
  primary_color: string
  secondary_color: string
  font_preference: 'modern' | 'classic' | 'bold'
  dashboard_style: 'minimal' | 'rich' | 'executive'
  language: 'ja' | 'en'
  custom_domain?: string
}

export interface PhilosophyAnalysis {
  id: string
  company_id: string
  raw_input: PhilosophyInput

  // Claude API が抽出・分析したもの
  core_principles: CorePrinciple[]
  leadership_dna: LeadershipDNA
  culture_blueprint: CultureBlueprint
  strategic_pillars: StrategicPillar[]
  vision_statement: string
  mission_statement: string
  manifesto: string
  key_phrases: string[]
  decision_filters: string[]

  created_at: string
}

export interface CorePrinciple {
  title: string
  description: string
  behavioral_examples: string[]
  priority: number
  icon_suggestion: string
}

export interface LeadershipDNA {
  style: string
  strengths: string[]
  communication_approach: string
  decision_making_pattern: string
  motivational_drivers: string[]
  growth_mindset: string
}

export interface CultureBlueprint {
  values: CultureValue[]
  rituals_suggestions: string[]
  hiring_criteria: string[]
  performance_indicators: string[]
}

export interface CultureValue {
  name: string
  description: string
  in_action: string
}

export interface StrategicPillar {
  name: string
  rationale: string
  metrics: string[]
  timeframe: string
}

export interface DashboardConfig {
  id: string
  company_id: string
  slug: string
  primary_color: string
  secondary_color: string
  font_family: string
  style: 'minimal' | 'rich' | 'executive'
  custom_domain?: string
  vercel_deployment_id?: string
  deployment_url?: string
  is_deployed: boolean
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  company_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan: 'starter' | 'professional' | 'enterprise'
  status: 'active' | 'canceled' | 'past_due'
  current_period_end: string
  created_at: string
}

export interface OnboardingState {
  step: 1 | 2 | 3 | 4  // 4 = generating
  input: Partial<PhilosophyInput>
  isLoading: boolean
  error?: string
}

export type PlanFeature = {
  name: string
  included: boolean
  limit?: string
}

export const PLANS = {
  starter: {
    name: 'スターター',
    price_monthly: 4980,
    stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || '',
    features: [
      { name: 'ダッシュボード生成', included: true },
      { name: 'カスタムURL (slug)', included: true },
      { name: 'カスタムドメイン', included: false },
      { name: 'チームメンバー', included: false, limit: '1名' },
      { name: 'AI再分析', included: false, limit: '月1回' },
      { name: 'PDFエクスポート', included: false },
    ] as PlanFeature[]
  },
  professional: {
    name: 'プロフェッショナル',
    price_monthly: 14800,
    stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    features: [
      { name: 'ダッシュボード生成', included: true },
      { name: 'カスタムURL (slug)', included: true },
      { name: 'カスタムドメイン', included: true },
      { name: 'チームメンバー', included: true, limit: '10名' },
      { name: 'AI再分析', included: true, limit: '月5回' },
      { name: 'PDFエクスポート', included: true },
    ] as PlanFeature[]
  },
  enterprise: {
    name: 'エンタープライズ',
    price_monthly: 49800,
    stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || '',
    features: [
      { name: 'ダッシュボード生成', included: true },
      { name: 'カスタムURL (slug)', included: true },
      { name: 'カスタムドメイン', included: true },
      { name: 'チームメンバー', included: true, limit: '無制限' },
      { name: 'AI再分析', included: true, limit: '無制限' },
      { name: 'PDFエクスポート', included: true },
    ] as PlanFeature[]
  }
} as const
