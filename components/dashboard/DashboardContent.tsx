'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Company, PhilosophyAnalysis, DashboardConfig } from '@/types'

interface Props {
  company: Company
  analysis: PhilosophyAnalysis
  config: DashboardConfig
}

const ICON_MAP: Record<string, string> = {
  Heart: '❤️', Target: '🎯', Users: '👥', Star: '⭐', Zap: '⚡',
  Shield: '🛡️', Compass: '🧭', Lightbulb: '💡', Globe: '🌐', Crown: '👑',
}

function getFont(font: string) {
  const fonts: Record<string, string> = {
    modern: '"Inter", system-ui, sans-serif',
    classic: '"Georgia", "Times New Roman", serif',
    bold: '"Sora", "DM Sans", sans-serif',
  }
  return fonts[font] || fonts.modern
}

export default function DashboardContent({ company, analysis, config }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'principles' | 'culture' | 'strategy'>('overview')

  const primaryColor = config?.primary_color || '#6366f1'
  const secondaryColor = config?.secondary_color || '#8b5cf6'
  const fontFamily = getFont(config?.font_family || 'modern')

  const principles = analysis.core_principles as any[]
  const leadership = analysis.leadership_dna as any
  const culture = analysis.culture_blueprint as any
  const pillars = analysis.strategic_pillars as any[]

  return (
    <div style={{ fontFamily }} className="min-h-screen bg-slate-50">
      {/* Custom CSS variables */}
      <style>{`
        :root {
          --primary: ${primaryColor};
          --secondary: ${secondaryColor};
          --primary-light: ${primaryColor}20;
          --primary-border: ${primaryColor}40;
        }
      `}</style>

      {/* Hero Header */}
      <div
        className="relative overflow-hidden py-20 px-8"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.3,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto">
          {company.logo_url && (
            <img
              src={company.logo_url}
              alt={company.name}
              className="h-16 mb-8 object-contain brightness-0 invert"
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/90 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {company.industry} · {company.size === 'startup' ? 'スタートアップ' : company.size === 'sme' ? '中小企業' : 'エンタープライズ'}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {company.name}
            </h1>

            {analysis.vision_statement && (
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed font-light">
                {analysis.vision_statement}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex gap-1">
            {([
              { key: 'overview', label: '概要' },
              { key: 'principles', label: 'コア原則' },
              { key: 'culture', label: 'カルチャー' },
              { key: 'strategy', label: '戦略' },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-4 text-sm font-medium border-b-2 transition-all ${
                  activeTab === tab.key
                    ? 'border-b-2 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
                style={activeTab === tab.key ? { borderColor: primaryColor, color: primaryColor } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Mission & Vision cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <div
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: primaryColor }}
                >
                  ミッション
                </div>
                <p className="text-lg text-slate-800 leading-relaxed font-medium">
                  {analysis.mission_statement}
                </p>
              </div>
              <div
                className="rounded-2xl p-8 shadow-sm text-white"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-4">
                  ビジョン
                </div>
                <p className="text-lg leading-relaxed font-medium">
                  {analysis.vision_statement}
                </p>
              </div>
            </div>

            {/* Manifesto */}
            {analysis.manifesto && (
              <div className="bg-slate-900 rounded-2xl p-10 text-white">
                <div
                  className="text-xs font-semibold uppercase tracking-widest mb-6"
                  style={{ color: primaryColor }}
                >
                  マニフェスト
                </div>
                <blockquote className="text-xl leading-relaxed text-white/90 font-light italic">
                  &ldquo;{analysis.manifesto}&rdquo;
                </blockquote>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-white/50 text-sm">— {company.name} 代表</p>
                </div>
              </div>
            )}

            {/* Key phrases */}
            {(analysis.key_phrases as string[])?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  キーワード
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(analysis.key_phrases as string[]).map((phrase, i) => (
                    <span
                      key={i}
                      className="px-5 py-2.5 rounded-full text-sm font-medium border-2"
                      style={{
                        borderColor: primaryColor,
                        color: primaryColor,
                        backgroundColor: `${primaryColor}08`,
                      }}
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Leadership DNA */}
            {leadership && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  リーダーシップDNA
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">スタイル</p>
                    <p className="text-slate-800 font-medium">{leadership.style}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">意思決定</p>
                    <p className="text-slate-800">{leadership.decision_making_pattern}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">コミュニケーション</p>
                    <p className="text-slate-800">{leadership.communication_approach}</p>
                  </div>
                </div>
                {leadership.strengths?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">強み</p>
                    <div className="flex flex-wrap gap-2">
                      {leadership.strengths.map((s: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Principles Tab */}
        {activeTab === 'principles' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">コア原則</h2>
              <p className="text-slate-500">この会社の意思決定・行動の根幹となる原則</p>
            </div>

            {principles?.map((principle: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-6">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${primaryColor}15` }}
                  >
                    {ICON_MAP[principle.icon_suggestion] || '◆'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-slate-900">{principle.title}</h3>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                      >
                        優先度 {principle.priority}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-5">{principle.description}</p>
                    {principle.behavioral_examples?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                          行動例
                        </p>
                        <ul className="space-y-2">
                          {principle.behavioral_examples.map((ex: string, j: number) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                              <span style={{ color: primaryColor }} className="mt-1 flex-shrink-0">→</span>
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Decision filters */}
            {(analysis.decision_filters as string[])?.length > 0 && (
              <div className="bg-slate-900 rounded-2xl p-8 text-white mt-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <span style={{ color: primaryColor }}>✦</span>
                  意思決定フィルター
                </h3>
                <p className="text-white/60 text-sm mb-6">
                  「やる・やらない」を判断する5つの問い
                </p>
                <ol className="space-y-4">
                  {(analysis.decision_filters as string[]).map((filter, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-slate-900"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-white/80 leading-relaxed pt-0.5">{filter}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </motion.div>
        )}

        {/* Culture Tab */}
        {activeTab === 'culture' && culture && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">カルチャーブループリント</h2>
              <p className="text-slate-500">私たちが大切にする組織文化の設計図</p>
            </div>

            {/* Values */}
            {culture.values?.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-5">価値観</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {culture.values.map((value: any, i: number) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                    >
                      <div
                        className="text-lg font-bold mb-2"
                        style={{ color: primaryColor }}
                      >
                        {value.name}
                      </div>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                        {value.description}
                      </p>
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                          行動で見せると
                        </p>
                        <p className="text-sm text-slate-700">{value.in_action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hiring criteria */}
            {culture.hiring_criteria?.length > 0 && (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-5">採用基準</h3>
                <div className="space-y-3">
                  {culture.hiring_criteria.map((criterion: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-slate-700">{criterion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ritual suggestions */}
            {culture.rituals_suggestions?.length > 0 && (
              <div
                className="rounded-2xl p-8 text-white"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <h3 className="text-lg font-bold mb-5">組織儀式の提案</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {culture.rituals_suggestions.map((ritual: string, i: number) => (
                    <div key={i} className="bg-white/15 rounded-xl p-4 text-sm">
                      {ritual}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Strategy Tab */}
        {activeTab === 'strategy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">戦略的柱</h2>
              <p className="text-slate-500">事業成長を支える優先事項</p>
            </div>

            {pillars?.map((pillar: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{pillar.name}</h3>
                  <span className="ml-auto text-sm text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {pillar.timeframe}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">{pillar.rationale}</p>
                {pillar.metrics?.length > 0 && (
                  <div className="pt-5 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                      成果指標
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pillar.metrics.map((metric: string, j: number) => (
                        <span
                          key={j}
                          className="px-3 py-1.5 text-sm rounded-lg border font-medium"
                          style={{
                            borderColor: `${primaryColor}40`,
                            color: primaryColor,
                            backgroundColor: `${primaryColor}08`,
                          }}
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20 py-8">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Powered by <span className="font-semibold text-slate-600">PhilosophyOS</span>
          </p>
          <p className="text-sm text-slate-400">
            {company.name} · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
