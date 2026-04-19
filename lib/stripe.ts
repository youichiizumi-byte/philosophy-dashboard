// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export async function createOrRetrieveCustomer({
  userId,
  email,
  name,
}: {
  userId: string
  email: string
  name?: string
}): Promise<string> {
  const { createServiceClient } = await import('./supabase')
  const supabase = createServiceClient()

  // 既存のサブスクリプションからcustomer_idを確認
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id
  }

  // 新規顧客作成
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { supabase_user_id: userId },
  })

  return customer.id
}

export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  companyId,
  successUrl,
  cancelUrl,
}: {
  customerId: string
  priceId: string
  userId: string
  companyId: string
  successUrl: string
  cancelUrl: string
}): Promise<Stripe.Checkout.Session> {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        user_id: userId,
        company_id: companyId,
      },
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: userId,
      company_id: companyId,
    },
  })
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}

// プランのpriceIdからplan nameを取得
export function getPlanFromPriceId(priceId: string): 'starter' | 'professional' | 'enterprise' {
  const priceMap: Record<string, 'starter' | 'professional' | 'enterprise'> = {
    [process.env.STRIPE_STARTER_PRICE_ID!]: 'starter',
    [process.env.STRIPE_PRO_PRICE_ID!]: 'professional',
    [process.env.STRIPE_ENTERPRISE_PRICE_ID!]: 'enterprise',
  }
  return priceMap[priceId] || 'starter'
}
