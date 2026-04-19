// app/(dashboard)/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase'
import DashboardContent from '@/components/dashboard/DashboardContent'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = await createServerSupabaseClient()

  const { data: company } = await supabase
    .from('companies')
    .select('name, industry')
    .eq('slug', params.slug)
    .single()

  if (!company) return { title: 'Dashboard Not Found' }

  return {
    title: `${company.name} | 経営哲学ダッシュボード`,
    description: `${company.name}の経営哲学・ビジョン・カルチャーブループリント`,
    openGraph: {
      title: `${company.name} | 経営哲学ダッシュボード`,
      description: `${company.industry}業界をリードする${company.name}の経営哲学`,
    },
  }
}

export default async function DashboardPage({ params }: Props) {
  const supabase = await createServerSupabaseClient()

  // 会社情報取得
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!company) notFound()

  // 哲学分析取得（最新版）
  const { data: analysis } = await supabase
    .from('philosophy_analyses')
    .select('*')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!analysis) notFound()

  // ダッシュボード設定取得
  const { data: config } = await supabase
    .from('dashboard_configs')
    .select('*')
    .eq('slug', params.slug)
    .single()

  return (
    <DashboardContent
      company={company as any}
      analysis={analysis as any}
      config={config as any}
    />
  )
}
