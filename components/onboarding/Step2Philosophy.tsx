'use client'

import { useState } from 'react'
import type { PhilosophyInput } from '@/types'

interface Props {
  data: Partial<PhilosophyInput>
  onUpdate: (data: Partial<PhilosophyInput>) => void
  onNext: () => void
  onBack: () => void
}

const QUESTIONS = [
  {
    key: 'mission' as const,
    label: 'この会社はなぜ存在するのか',
    sublabel: '創業の理由・社会への約束',
    options: [
      '社会課題を解決し、より良い世界をつくるため',
      'お客様の悩みを解決し、生活を豊かにするため',
      '業界の非効率をなくし、新しい価値を生み出すため',
      '地域・コミュニティに貢献し、人と人をつなぐため',
      '次世代に誇れる仕事・文化を残すため',
      'チームメンバーが誇りを持って働ける場所をつくるため',
    ],
  },
  {
    key: 'core_values' as const,
    label: '最も大切にしている価値観',
    sublabel: '最大3つまで選べます',
    multi: true,
    max: 3,
    options: [
      '誠実さ・正直さ',
      'スピード・行動力',
      '顧客第一・顧客愛',
      '挑戦・イノベーション',
      'チームワーク・仲間を大切に',
      '品質・こだわり',
      '成長・学び続ける',
      '社会貢献・社会責任',
    ],
  },
  {
    key: 'leadership_style' as const,
    label: 'リーダーとしての自分のスタイル',
    sublabel: '最も近いものを選んでください',
    options: [
      '先頭に立って引っ張るリーダー',
      'メンバーを支え、育てるサポーター型',
      'ビジョンを示して任せる委任型',
      'データと論理で判断するアナリスト型',
      'チームで一緒に考える対話型',
      'スピードと決断力で動くドライバー型',
    ],
  },
  {
    key: 'decision_framework' as const,
    label: '意思決定で最も重視すること',
    sublabel: '判断の軸を選んでください',
    options: [
      '顧客・ユーザーにとって価値があるか',
      '10年後も誇れる判断かどうか',
      'チームが納得・共感できるか',
      '数字・データで裏付けられるか',
      '会社のミッション・ビジョンに合うか',
      'スピードと実行可能性があるか',
    ],
  },
  {
    key: 'success_definition' as const,
    label: 'あなたにとっての「成功」とは',
    sublabel: '本当の勝利の定義を選んでください',
    options: [
      '顧客から「ありがとう」と言われること',
      'チームメンバーが成長し独立すること',
      '業界・社会に大きなインパクトを与えること',
      '継続的に成長し続ける会社をつくること',
      '売上・利益など数字で結果を出すこと',
      '10年後も愛される会社・ブランドになること',
    ],
  },
  {
    key: 'culture_description' as const,
    label: '作りたい組織文化',
    sublabel: '理想の会社の雰囲気を選んでください',
    options: [
      '失敗を恐れず挑戦できる文化',
      '役職関係なく意見が言える文化',
      '成果より成長を評価する文化',
      'スピードと実行を重視する文化',
      '深く考え、品質にこだわる文化',
      'お互いを尊重し、助け合う文化',
    ],
  },
  {
    key: 'customer_philosophy' as const,
    label: '顧客への向き合い方',
    sublabel: '顧客との関係性を選んでください',
    options: [
      '課題を自分ごととして一緒に解決するパートナー',
      '期待を超える価値を提供するプロフェッショナル',
      '長期的な信頼関係を大切にする伴走者',
      '正直にNoと言える誠実なアドバイザー',
      '顧客の成功だけを考える専門家',
      '顧客の声を常に聞き、改善し続ける存在',
    ],
  },
  {
    key: 'long_term_vision' as const,
    label: '10年後に実現したい世界',
    sublabel: '長期ビジョンを選んでください',
    options: [
      '業界のスタンダードを塗り替えている',
      '多くの人の生活に欠かせない存在になっている',
      '日本発のグローバルブランドになっている',
      '地域・社会課題を解決したモデルケースになっている',
      'チームが独立し、社会で活躍している',
      '業界で最も信頼されるブランドになっている',
    ],
  },
  {
    key: 'failure_response' as const,
    label: '失敗・困難への向き合い方',
    sublabel: '最も近いものを選んでください',
    options: [
      '失敗は学習コスト、素早く立て直す',
      '原因を徹底分析し、仕組みで再発防止する',
      'チームで振り返り、全員の学びにする',
      'ポジティブに捉え、次のチャンスに変える',
      '誠実に認め、関係者に誠意を示す',
      '小さく試して失敗を最小化する',
    ],
  },
  {
    key: 'team_philosophy' as const,
    label: 'チームメンバーへの想い',
    sublabel: '仲間への姿勢を選んでください',
    options: [
      'メンバーの成長が私の最大の喜び',
      '一人ひとりの強みを活かしたい',
      '心理的安全性を最優先にしたい',
      'ともに夢を追う仲間でいたい',
      '正直なフィードバックで共に高め合いたい',
      'メンバーの人生を豊かにしたい',
    ],
  },
]

export default function Step2Philosophy({ data, onUpdate, onNext, onBack }: Props) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const currentQuestion = QUESTIONS[currentQ]
  const isMulti = currentQuestion.multi === true

  const completedCount = QUESTIONS.filter(q => {
    const ans = answers[q.key]
    return ans && (Array.isArray(ans) ? ans.length > 0 : ans !== '')
  }).length

  const progressPercent = Math.round((completedCount / QUESTIONS.length) * 100)

  const handleSelect = (option: string) => {
    if (isMulti) {
      const current = (answers[currentQuestion.key] as string[]) || []
      const max = currentQuestion.max || 3
      if (current.includes(option)) {
        setAnswers(prev => ({ ...prev, [currentQuestion.key]: current.filter(o => o !== option) }))
      } else if (current.length < max) {
        setAnswers(prev => ({ ...prev, [currentQuestion.key]: [...current, option] }))
      }
    } else {
      setAnswers(prev => ({ ...prev, [currentQuestion.key]: option }))
      setTimeout(() => {
        if (currentQ < QUESTIONS.length - 1) setCurrentQ(q => q + 1)
      }, 400)
    }
  }

  const isSelected = (option: string) => {
    if (isMulti) return ((answers[currentQuestion.key] as string[]) || []).includes(option)
    return answers[currentQuestion.key] === option
  }

  const canProceed = isMulti
    ? ((answers[currentQuestion.key] as string[]) || []).length > 0
    : !!answers[currentQuestion.key]

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1)
    } else {
      const converted: Partial<PhilosophyInput> = {}
      QUESTIONS.forEach(q => {
        const ans = answers[q.key]
        if (ans) (converted as any)[q.key] = Array.isArray(ans) ? ans.join('・') : ans
      })
      onUpdate(converted)
      onNext()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">あなたの経営哲学を教えてください</h1>
        <p className="text-slate-500">選択するだけでOKです。AIが本質を引き出します。</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-500">{currentQ + 1} / {QUESTIONS.length} 問</span>
          <span className="text-sm font-medium text-indigo-600">{progressPercent}% 完了</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="flex gap-1.5 mb-8 flex-wrap">
        {QUESTIONS.map((q, i) => (
          <button key={q.key} onClick={() => setCurrentQ(i)}
            className={`w-8 h-8 rounded-md text-xs font-medium transition-all ${
              i === currentQ ? 'bg-indigo-600 text-white'
              : answers[q.key] ? 'bg-indigo-100 text-indigo-700'
              : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}>
            {i + 1}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-8 mb-6 shadow-sm">
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-2">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center mt-0.5">
              {currentQ + 1}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{currentQuestion.label}</h2>
              <p className="text-sm text-slate-500 mt-0.5">{currentQuestion.sublabel}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, i) => (
            <button key={i} onClick={() => handleSelect(option)}
              className={`text-left px-5 py-4 rounded-xl border-2 transition-all text-sm font-medium ${
                isSelected(option)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
              }`}>
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isSelected(option) ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                }`}>
                  {isSelected(option) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>

        {isMulti && (
          <p className="text-xs text-slate-400 mt-4 text-center">
            {((answers[currentQuestion.key] as string[]) || []).length} / {currentQuestion.max} 個選択中
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button type="button" onClick={currentQ === 0 ? onBack : () => setCurrentQ(q => q - 1)}
          className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
          ← 戻る
        </button>
        <div className="flex-1" />
        <button type="button" onClick={handleNext} disabled={!canProceed}
          className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            canProceed ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}>
          {currentQ < QUESTIONS.length - 1 ? '次の質問 →' : '設定へ進む →'}
        </button>
      </div>
    </div>
  )
}
