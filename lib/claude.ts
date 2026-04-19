// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'
import type { PhilosophyInput, PhilosophyAnalysis } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const PHILOSOPHY_SYSTEM_PROMPT = `
あなたは経営者の哲学・ビジョンを深く理解し、それを構造化されたダッシュボード用コンテンツに変換する
エキスパートコンサルタントです。

経営者が入力した回答を分析し、以下を抽出・生成してください：

1. コア原則 (core_principles): 5〜7つの根本的な経営原則
2. リーダーシップDNA (leadership_dna): リーダーシップスタイルの本質
3. カルチャーブループリント (culture_blueprint): 組織文化の設計図
4. 戦略的柱 (strategic_pillars): 3〜5つの戦略的優先事項
5. ビジョンステートメント (vision_statement): 1〜2文の力強いビジョン
6. ミッションステートメント (mission_statement): 1〜2文の明確なミッション
7. マニフェスト (manifesto): 経営者の言葉で語る200〜300文字の宣言文
8. キーフレーズ (key_phrases): ブランドを象徴する5〜8つの言葉
9. 意思決定フィルター (decision_filters): 判断基準となる5つの問い

必ずJSON形式で返してください。日本語で生成してください。
経営者の実際の言葉や価値観を反映し、一般的なビジネス用語の羅列にならないようにしてください。
`

export async function analyzePhilosophy(
  input: PhilosophyInput
): Promise<Omit<PhilosophyAnalysis, 'id' | 'company_id' | 'created_at'>> {
  const userMessage = `
以下の経営者の回答を分析してください：

【企業情報】
会社名: ${input.company_name}
業界: ${input.industry}
規模: ${input.company_size}
設立年: ${input.founded_year || '未回答'}

【経営哲学の質問回答】

Q1. なぜこの会社を作ったのか・会社の存在意義:
${input.mission}

Q2. 大切にしている価値観（3〜5つ）:
${input.core_values}

Q3. リーダーとしての在り方:
${input.leadership_style}

Q4. 意思決定の基準:
${input.decision_framework}

Q5. 成功の定義:
${input.success_definition}

Q6. 作りたい組織文化:
${input.culture_description}

Q7. 顧客への約束:
${input.customer_philosophy}

Q8. 10年後のビジョン:
${input.long_term_vision}

Q9. 失敗・困難への向き合い方:
${input.failure_response}

Q10. チームメンバーへの想い:
${input.team_philosophy}

---
以下のJSONスキーマで返してください：

{
  "core_principles": [
    {
      "title": "原則名（3〜5文字）",
      "description": "説明（50〜80文字）",
      "behavioral_examples": ["具体的行動例1", "具体的行動例2", "具体的行動例3"],
      "priority": 1,
      "icon_suggestion": "lucide-react のアイコン名（例: Heart, Target, Users）"
    }
  ],
  "leadership_dna": {
    "style": "リーダーシップスタイルの一言表現",
    "strengths": ["強み1", "強み2", "強み3"],
    "communication_approach": "コミュニケーションの特徴",
    "decision_making_pattern": "意思決定パターン",
    "motivational_drivers": ["動機1", "動機2"],
    "growth_mindset": "成長への姿勢"
  },
  "culture_blueprint": {
    "values": [
      {
        "name": "価値観名",
        "description": "説明",
        "in_action": "行動で見せると"
      }
    ],
    "rituals_suggestions": ["組織儀式の提案1", "提案2", "提案3"],
    "hiring_criteria": ["採用基準1", "採用基準2", "採用基準3"],
    "performance_indicators": ["評価指標1", "評価指標2", "評価指標3"]
  },
  "strategic_pillars": [
    {
      "name": "戦略的柱の名前",
      "rationale": "なぜこれが重要か",
      "metrics": ["測定指標1", "測定指標2"],
      "timeframe": "時間軸"
    }
  ],
  "vision_statement": "力強いビジョンステートメント（1〜2文）",
  "mission_statement": "明確なミッションステートメント（1〜2文）",
  "manifesto": "経営者の言葉で語る宣言文（200〜300文字）",
  "key_phrases": ["フレーズ1", "フレーズ2", "フレーズ3", "フレーズ4", "フレーズ5"],
  "decision_filters": ["判断基準の問い1", "問い2", "問い3", "問い4", "問い5"]
}
`

  const message = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: PHILOSOPHY_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: userMessage }
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  // JSON抽出（マークダウンコードブロックを除去）
  const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) ||
                    responseText.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    throw new Error('Claude API からJSONレスポンスを取得できませんでした')
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0]
  const analysis = JSON.parse(jsonStr)

  return {
    raw_input: input,
    core_principles: analysis.core_principles || [],
    leadership_dna: analysis.leadership_dna || {},
    culture_blueprint: analysis.culture_blueprint || {},
    strategic_pillars: analysis.strategic_pillars || [],
    vision_statement: analysis.vision_statement || '',
    mission_statement: analysis.mission_statement || '',
    manifesto: analysis.manifesto || '',
    key_phrases: analysis.key_phrases || [],
    decision_filters: analysis.decision_filters || [],
  }
}

// ストリーミング版（プログレス表示用）
export async function analyzePhilosophyStream(
  input: PhilosophyInput,
  onChunk: (text: string) => void
) {
  const stream = await client.messages.stream({
    model: 'claude-opus-4-5',
    max_tokens: 4096,
    system: PHILOSOPHY_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: `経営哲学分析: ${JSON.stringify(input)}` }
    ],
  })

  let fullText = ''
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullText += chunk.delta.text
      onChunk(chunk.delta.text)
    }
  }

  return fullText
}
