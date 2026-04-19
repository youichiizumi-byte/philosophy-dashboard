'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import type { PhilosophyInput } from '@/types'

const GENERATION_STEPS = [
  { id: 1, label: '入力内容を解析中...', sublabel: 'あなたの言葉の背後にある意図を読み取ります', duration: 2000 },
  { id: 2, label: '経営哲学のパターンを抽出中...', sublabel: 'コア原則・価値観・リーダーシップDNAを特定', duration: 4000 },
  { id: 3, label: 'ビジョン・ミッションを言語化中...', sublabel: '経営者の想いを洗練された表現に変換', duration: 3000 },
  { id: 4, label: 'カルチャーブループリントを設計中...', sublabel: '組織文化の設計図と採用基準を策定', duration: 3000 },
  { id: 5, label: 'ダッシュボードを生成中...', sublabel: 'カスタムブランディングで専用UIを構築', duration: 3000 },
  { id: 6, label: 'デプロイの準備中...', sublabel: 'あなた専用のURLへの配信を設定', duration: 2000 },
]

interface Props {
  input: PhilosophyInput
}

export default function GeneratingScreen({ input }: Props) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [dashboardSlug, setDashboardSlug] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    startGeneration()
  }, [])

  const startGeneration = async () => {
    // UIアニメーションを進めながら、バックグラウンドでAPI呼び出し
    const progressAnimation = async () => {
      for (let i = 0; i < GENERATION_STEPS.length; i++) {
        setCurrentStep(i)
        await sleep(GENERATION_STEPS[i].duration)
        setCompletedSteps(prev => [...prev, i])
      }
    }

    const apiCall = async () => {
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input }),
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(err.message || '分析に失敗しました')
        }

        const data = await response.json()
        setDashboardSlug(data.slug)
        return data.slug
      } catch (err) {
        throw err
      }
    }

    try {
      // 両方を並行実行
      const [, slug] = await Promise.all([progressAnimation(), apiCall()])
      setDashboardSlug(slug)
      setIsComplete(true)

      // 3秒後にダッシュボードへリダイレクト
      setTimeout(() => {
        router.push(`/dashboard/${slug}`)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    }
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const totalDuration = GENERATION_STEPS.reduce((sum, s) => sum + s.duration, 0)
  const elapsedDuration = GENERATION_STEPS
    .slice(0, completedSteps.length)
    .reduce((sum, s) => sum + s.duration, 0)
  const progressPercent = Math.round((elapsedDuration / totalDuration) * 100)

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-24">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-3">エラーが発生しました</h2>
        <p className="text-slate-500 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
        >
          再試行する
        </button>
      </div>
    )
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto text-center py-24"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-8"
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          ダッシュボードが完成しました！
        </h2>
        <p className="text-slate-500 mb-2">
          あなただけの経営哲学ダッシュボードを生成しました
        </p>
        <p className="text-indigo-600 font-mono text-sm mb-8">
          philosophyos.com/{dashboardSlug}
        </p>
        <p className="text-sm text-slate-400">ダッシュボードへ移動中...</p>
      </motion.div>
    )
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      {/* Animated logo */}
      <div className="mb-12 relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center"
        >
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl border-2 border-indigo-200 animate-ping opacity-30" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-3">
        あなたの哲学を分析中...
      </h2>
      <p className="text-slate-500 mb-12">
        Claude AIがあなたの言葉の奥にある経営哲学を抽出しています
      </p>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-sm text-slate-400">{progressPercent}%</p>
      </div>

      {/* Steps */}
      <div className="space-y-3 text-left">
        {GENERATION_STEPS.map((step, i) => (
          <AnimatePresence key={step.id}>
            {i <= currentStep && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 p-4 rounded-xl transition-all ${
                  i === currentStep
                    ? 'bg-indigo-50 border border-indigo-100'
                    : 'bg-slate-50'
                }`}
              >
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                  completedSteps.includes(i)
                    ? 'bg-indigo-600'
                    : i === currentStep
                    ? 'bg-indigo-200'
                    : 'bg-slate-200'
                }`}>
                  {completedSteps.includes(i) ? (
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i === currentStep ? (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-indigo-600"
                    />
                  ) : null}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    i === currentStep ? 'text-indigo-700' : 'text-slate-600'
                  }`}>
                    {step.label}
                  </p>
                  {i === currentStep && (
                    <p className="text-xs text-slate-400 mt-0.5">{step.sublabel}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ))}
      </div>
    </div>
  )
}
