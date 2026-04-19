// app/api/deploy/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import { deployDashboard, getDeploymentStatus } from '@/lib/vercel-deploy'

// POST: デプロイ開始
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 })
    }

    const { slug } = await request.json()
    if (!slug) {
      return NextResponse.json({ message: 'slugが必要です' }, { status: 400 })
    }

    // 会社とダッシュボード設定を取得
    const { data: company } = await supabase
      .from('companies')
      .select('id, user_id')
      .eq('slug', slug)
      .single()

    if (!company || company.user_id !== user.id) {
      return NextResponse.json({ message: '権限がありません' }, { status: 403 })
    }

    // サブスクリプション確認（Proプラン以上が必要）
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('company_id', company.id)
      .single()

    if (!subscription || subscription.status !== 'active') {
      return NextResponse.json(
        { message: 'アクティブなサブスクリプションが必要です' },
        { status: 403 }
      )
    }

    const { data: config } = await supabase
      .from('dashboard_configs')
      .select('*')
      .eq('slug', slug)
      .single()

    if (!config) {
      return NextResponse.json(
        { message: 'ダッシュボード設定が見つかりません' },
        { status: 404 }
      )
    }

    // Vercelへデプロイ
    const deployment = await deployDashboard({
      slug,
      companyId: company.id,
      primaryColor: config.primary_color,
      secondaryColor: config.secondary_color,
      fontFamily: config.font_family,
      style: config.style,
    })

    // デプロイ情報をSupabaseに保存
    await supabase
      .from('dashboard_configs')
      .update({
        vercel_deployment_id: deployment.deploymentId,
        deployment_url: deployment.url,
        is_deployed: true,
      })
      .eq('slug', slug)

    return NextResponse.json({
      success: true,
      deploymentId: deployment.deploymentId,
      url: deployment.url,
      readyState: deployment.readyState,
    })
  } catch (error) {
    console.error('Deploy API error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'デプロイに失敗しました' },
      { status: 500 }
    )
  }
}

// GET: デプロイ状態確認
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deploymentId = searchParams.get('deploymentId')

    if (!deploymentId) {
      return NextResponse.json({ message: 'deploymentIdが必要です' }, { status: 400 })
    }

    const status = await getDeploymentStatus(deploymentId)

    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      { message: 'デプロイ状態の取得に失敗しました' },
      { status: 500 }
    )
  }
}
