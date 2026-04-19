// app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import {
  createOrRetrieveCustomer,
  createCheckoutSession,
} from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ message: '認証が必要です' }, { status: 401 })
    }

    const { priceId, companyId } = await request.json()
    if (!priceId) {
      return NextResponse.json({ message: 'priceIdが必要です' }, { status: 400 })
    }

    // Stripe顧客IDを取得または作成
    const customerId = await createOrRetrieveCustomer({
      userId: user.id,
      email: user.email!,
      name: user.user_metadata?.name,
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Checkoutセッション作成
    const session = await createCheckoutSession({
      customerId,
      priceId,
      userId: user.id,
      companyId: companyId || '',
      successUrl: `${appUrl}/onboarding?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/pricing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '決済の開始に失敗しました' },
      { status: 500 }
    )
  }
}
