// app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { analyzePhilosophy } from '@/lib/claude'
import type { PhilosophyInput } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // 認証確認
    
const user = { id: 'demo-user-001' }
    const { input }: { input: PhilosophyInput } = await request.json()

    // バリデーション
    if (!input.company_name || !input.mission || !input.core_values) {
      return NextResponse.json(
        { message: '必須フィールドが不足しています' },
        { status: 400 }
      )
    }

    // slugを生成（会社名からURLフレンドリーな文字列を生成）
    const baseSlug = input.company_name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30)

    const uniqueSuffix = Math.random().toString(36).substring(2, 7)
    const slug = `${baseSlug}-${uniqueSuffix}`

    // 1. 会社レコードを作成
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        user_id: user.id,
        name: input.company_name,
        industry: input.industry,
        size: input.company_size,
        founded_year: input.founded_year,
        website: input.website,
        slug,
      })
      .select()
      .single()

    if (companyError) {
      console.error('Company creation error:', companyError)
      return NextResponse.json(
        { message: '会社情報の保存に失敗しました' },
        { status: 500 }
      )
    }

    // 2. Claude APIで哲学を分析
    const analysis = await analyzePhilosophy(input)

    // 3. 分析結果をSupabaseに保存
    const { error: analysisError } = await supabase
      .from('philosophy_analyses')
      .insert({
        company_id: company.id,
        raw_input: input as any,
        core_principles: analysis.core_principles as any,
        leadership_dna: analysis.leadership_dna as any,
        culture_blueprint: analysis.culture_blueprint as any,
        strategic_pillars: analysis.strategic_pillars as any,
        vision_statement: analysis.vision_statement,
        mission_statement: analysis.mission_statement,
        manifesto: analysis.manifesto,
        key_phrases: analysis.key_phrases as any,
        decision_filters: analysis.decision_filters as any,
      })

    if (analysisError) {
      console.error('Analysis save error:', analysisError)
      return NextResponse.json(
        { message: '分析結果の保存に失敗しました' },
        { status: 500 }
      )
    }

    // 4. ダッシュボード設定を保存
    const { error: dashboardError } = await supabase
      .from('dashboard_configs')
      .insert({
        company_id: company.id,
        slug,
        primary_color: input.primary_color || '#6366f1',
        secondary_color: input.secondary_color || '#8b5cf6',
        font_family: input.font_preference || 'modern',
        style: input.dashboard_style || 'minimal',
        custom_domain: input.custom_domain,
        is_deployed: false,
      })

    if (dashboardError) {
      console.error('Dashboard config error:', dashboardError)
    }

    return NextResponse.json({
      success: true,
      slug,
      company_id: company.id,
      message: 'ダッシュボードを生成しました',
    })
  } catch (error) {
    console.error('Analyze API error:', error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : '分析中にエラーが発生しました',
      },
      { status: 500 }
    )
  }
}
