// lib/vercel-deploy.ts

interface VercelDeploymentResult {
  deploymentId: string
  url: string
  readyState: string
}

interface VercelEnvVar {
  key: string
  value: string
  target: ('production' | 'preview' | 'development')[]
  type: 'plain' | 'secret' | 'encrypted'
}

export async function deployDashboard({
  slug,
  companyId,
  primaryColor,
  secondaryColor,
  fontFamily,
  style,
}: {
  slug: string
  companyId: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  style: string
}): Promise<VercelDeploymentResult> {
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID

  if (!VERCEL_TOKEN) {
    throw new Error('VERCEL_TOKEN が設定されていません')
  }

  // Vercel Deployments API を使ってデプロイ
  // ダッシュボードの設定をenv varとして渡す
  const deploymentPayload = {
    name: `philosophy-${slug}`,
    gitSource: {
      type: 'github',
      repoId: process.env.GITHUB_REPO_ID,
      ref: 'main',
    },
    env: [
      {
        key: 'NEXT_PUBLIC_COMPANY_SLUG',
        value: slug,
        target: ['production'],
        type: 'plain',
      },
      {
        key: 'NEXT_PUBLIC_PRIMARY_COLOR',
        value: primaryColor,
        target: ['production'],
        type: 'plain',
      },
      {
        key: 'NEXT_PUBLIC_SECONDARY_COLOR',
        value: secondaryColor,
        target: ['production'],
        type: 'plain',
      },
      {
        key: 'NEXT_PUBLIC_FONT_FAMILY',
        value: fontFamily,
        target: ['production'],
        type: 'plain',
      },
      {
        key: 'NEXT_PUBLIC_DASHBOARD_STYLE',
        value: style,
        target: ['production'],
        type: 'plain',
      },
      // Supabase接続情報を引き継ぎ
      {
        key: 'NEXT_PUBLIC_SUPABASE_URL',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        target: ['production'],
        type: 'plain',
      },
      {
        key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        target: ['production'],
        type: 'plain',
      },
    ] as VercelEnvVar[],
    projectSettings: {
      framework: 'nextjs',
      installCommand: 'npm install',
      buildCommand: `COMPANY_SLUG=${slug} npm run build`,
      outputDirectory: '.next',
    },
    meta: {
      company_id: companyId,
      slug: slug,
    },
  }

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
  }

  if (VERCEL_TEAM_ID) {
    headers['X-Vercel-Team-Id'] = VERCEL_TEAM_ID
  }

  const response = await fetch('https://api.vercel.com/v13/deployments', {
    method: 'POST',
    headers,
    body: JSON.stringify(deploymentPayload),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Vercel デプロイ失敗: ${JSON.stringify(error)}`)
  }

  const deployment = await response.json()

  return {
    deploymentId: deployment.id,
    url: `https://${deployment.url}`,
    readyState: deployment.readyState,
  }
}

export async function getDeploymentStatus(
  deploymentId: string
): Promise<{ readyState: string; url?: string }> {
  const response = await fetch(
    `https://api.vercel.com/v13/deployments/${deploymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error('デプロイ状態の取得に失敗しました')
  }

  const data = await response.json()
  return {
    readyState: data.readyState,
    url: data.url ? `https://${data.url}` : undefined,
  }
}

export async function addCustomDomain(
  deploymentId: string,
  domain: string
): Promise<void> {
  const response = await fetch(
    `https://api.vercel.com/v10/projects/${process.env.VERCEL_PROJECT_ID}/domains`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: domain }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`カスタムドメイン追加失敗: ${JSON.stringify(error)}`)
  }
}

// デプロイなしでダッシュボードをプレビュー用にSupabaseに保存
export async function saveDashboardConfig({
  companyId,
  slug,
  config,
}: {
  companyId: string
  slug: string
  config: Record<string, string>
}): Promise<void> {
  const { createServiceClient } = await import('./supabase')
  const supabase = createServiceClient()

  await supabase.from('dashboard_configs').upsert({
    company_id: companyId,
    slug,
    ...config,
    is_deployed: false,
  })
}
