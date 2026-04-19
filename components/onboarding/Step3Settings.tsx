'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { PhilosophyInput } from '@/types'

const schema = z.object({
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '正しいカラーコードを入力してください'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  font_preference: z.enum(['modern', 'classic', 'bold']),
  dashboard_style: z.enum(['minimal', 'rich', 'executive']),
  language: z.enum(['ja', 'en']),
  custom_domain: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const COLOR_PRESETS = [
  { primary: '#6366f1', secondary: '#8b5cf6', name: 'インディゴ' },
  { primary: '#0ea5e9', secondary: '#06b6d4', name: 'スカイ' },
  { primary: '#10b981', secondary: '#059669', name: 'エメラルド' },
  { primary: '#f59e0b', secondary: '#d97706', name: 'アンバー' },
  { primary: '#ef4444', secondary: '#dc2626', name: 'レッド' },
  { primary: '#ec4899', secondary: '#db2777', name: 'ピンク' },
  { primary: '#1e293b', secondary: '#334155', name: 'ダーク' },
  { primary: '#7c3aed', secondary: '#6d28d9', name: 'バイオレット' },
]

const FONT_OPTIONS = [
  {
    value: 'modern' as const,
    label: 'モダン',
    sample: 'Inter',
    description: 'クリーンで読みやすい',
    preview: 'font-sans',
  },
  {
    value: 'classic' as const,
    label: 'クラシック',
    sample: 'Georgia',
    description: '格調と信頼感',
    preview: 'font-serif',
  },
  {
    value: 'bold' as const,
    label: 'ボールド',
    sample: 'Sora',
    description: '力強く印象的',
    preview: 'font-sans font-bold',
  },
]

const STYLE_OPTIONS = [
  {
    value: 'minimal' as const,
    label: 'ミニマル',
    description: '洗練・シンプル',
    icon: '○',
  },
  {
    value: 'rich' as const,
    label: 'リッチ',
    description: '情報量多め・詳細',
    icon: '◉',
  },
  {
    value: 'executive' as const,
    label: 'エグゼクティブ',
    description: '重厚感・プレミアム',
    icon: '◆',
  },
]

interface Props {
  data: Partial<PhilosophyInput>
  onUpdate: (data: Partial<PhilosophyInput>) => void
  onGenerate: () => void
  onBack: () => void
}

export default function Step3Settings({ data, onUpdate, onGenerate, onBack }: Props) {
  const [primaryColor, setPrimaryColor] = useState(data.primary_color || '#6366f1')
  const [secondaryColor, setSecondaryColor] = useState(data.secondary_color || '#8b5cf6')

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      primary_color: data.primary_color || '#6366f1',
      secondary_color: data.secondary_color || '#8b5cf6',
      font_preference: data.font_preference || 'modern',
      dashboard_style: data.dashboard_style || 'minimal',
      language: data.language || 'ja',
      custom_domain: data.custom_domain || '',
    },
  })

  const watchedFont = watch('font_preference')
  const watchedStyle = watch('dashboard_style')

  const applyColorPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setPrimaryColor(preset.primary)
    setSecondaryColor(preset.secondary)
    setValue('primary_color', preset.primary)
    setValue('secondary_color', preset.secondary)
  }

  const onSubmit = (formData: FormData) => {
    onUpdate({ ...formData, primary_color: primaryColor, secondary_color: secondaryColor })
    onGenerate()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          ダッシュボードのスタイルを設定
        </h1>
        <p className="text-slate-500">
          ブランドカラーとデザインスタイルを選択してください
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* カラー設定 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-5">ブランドカラー</h2>

          {/* プリセット */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {COLOR_PRESETS.map(preset => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyColorPreset(preset)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                  primaryColor === preset.primary
                    ? 'border-slate-400 shadow-md'
                    : 'border-transparent'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                  }}
                />
                <span className="text-xs text-slate-500">{preset.name}</span>
              </button>
            ))}
          </div>

          {/* カスタムカラー */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                メインカラー
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={e => {
                    setPrimaryColor(e.target.value)
                    setValue('primary_color', e.target.value)
                  }}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-1"
                />
                <input
                  {...register('primary_color')}
                  type="text"
                  value={primaryColor}
                  onChange={e => {
                    setPrimaryColor(e.target.value)
                    setValue('primary_color', e.target.value)
                  }}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                サブカラー
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={e => {
                    setSecondaryColor(e.target.value)
                    setValue('secondary_color', e.target.value)
                  }}
                  className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-1"
                />
                <input
                  {...register('secondary_color')}
                  type="text"
                  value={secondaryColor}
                  onChange={e => {
                    setSecondaryColor(e.target.value)
                    setValue('secondary_color', e.target.value)
                  }}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* プレビュー */}
          <div
            className="mt-5 rounded-xl p-5 text-white text-sm"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
          >
            <p className="font-bold text-lg mb-1">{data.company_name || '会社名'}</p>
            <p className="text-white/70 text-sm">カラープレビュー</p>
          </div>
        </div>

        {/* フォント設定 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-5">フォントスタイル</h2>
          <div className="grid grid-cols-3 gap-4">
            {FONT_OPTIONS.map(option => (
              <label
                key={option.value}
                className={`relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all hover:border-indigo-300 ${
                  watchedFont === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200'
                }`}
              >
                <input
                  {...register('font_preference')}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <span
                  className={`text-2xl font-semibold text-slate-900 mb-2 ${option.preview}`}
                  style={option.value === 'classic' ? { fontFamily: 'Georgia, serif' } : {}}
                >
                  Aa
                </span>
                <span className="text-sm font-semibold text-slate-700">{option.label}</span>
                <span className="text-xs text-slate-400 mt-0.5">{option.description}</span>
              </label>
            ))}
          </div>
        </div>

        {/* スタイル設定 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-5">ダッシュボードスタイル</h2>
          <div className="grid grid-cols-3 gap-4">
            {STYLE_OPTIONS.map(option => (
              <label
                key={option.value}
                className={`relative flex flex-col items-center p-5 rounded-xl border-2 cursor-pointer transition-all hover:border-indigo-300 ${
                  watchedStyle === option.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200'
                }`}
              >
                <input
                  {...register('dashboard_style')}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <span className="text-3xl mb-3 text-slate-600">{option.icon}</span>
                <span className="text-sm font-semibold text-slate-700">{option.label}</span>
                <span className="text-xs text-slate-400 mt-1 text-center">{option.description}</span>
              </label>
            ))}
          </div>
        </div>

        {/* カスタムドメイン（任意） */}
        <div className="bg-white rounded-2xl border border-slate-200 p-7 shadow-sm">
          <h2 className="text-base font-semibold text-slate-800 mb-1">
            カスタムドメイン
            <span className="ml-2 text-xs font-normal text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              Proプラン以上
            </span>
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            独自ドメインでダッシュボードを公開できます（任意）
          </p>
          <input
            {...register('custom_domain')}
            type="text"
            placeholder="philosophy.yourcompany.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            ← 戻る
          </button>
          <button
            type="submit"
            className="flex-1 py-3.5 rounded-xl text-white font-bold text-base hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
          >
            ✨ ダッシュボードを生成する
          </button>
        </div>
      </form>
    </div>
  )
}
