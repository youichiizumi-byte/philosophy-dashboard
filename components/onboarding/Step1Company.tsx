'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { PhilosophyInput } from '@/types'

const schema = z.object({
  company_name: z.string().min(1, '会社名を入力してください').max(100),
  industry: z.string().min(1, '業界を選択してください'),
  company_size: z.enum(['startup', 'sme', 'enterprise']),
  founded_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  website: z.string().url('正しいURLを入力してください').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

const INDUSTRIES = [
  'テクノロジー・IT', 'SaaS・クラウド', 'EC・小売', '製造業', '建設・不動産',
  '医療・ヘルスケア', '教育・EdTech', '金融・FinTech', 'コンサルティング',
  'マーケティング・広告', '飲食・フード', 'エンタメ・メディア', '物流・運輸',
  '人材・HR', 'その他',
]

interface Props {
  data: Partial<PhilosophyInput>
  onUpdate: (data: Partial<PhilosophyInput>) => void
  onNext: () => void
}

export default function Step1Company({ data, onUpdate, onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      company_name: data.company_name || '',
      industry: data.industry || '',
      company_size: data.company_size || 'startup',
      founded_year: data.founded_year,
      website: data.website || '',
    },
  })

  const onSubmit = (formData: FormData) => {
    onUpdate(formData)
    onNext()
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          まず、会社のことを教えてください
        </h1>
        <p className="text-slate-500">
          基本情報を入力します。後から変更できます。
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 会社名 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            会社名 <span className="text-red-400">*</span>
          </label>
          <input
            {...register('company_name')}
            type="text"
            placeholder="例：株式会社フューチャーワークス"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          />
          {errors.company_name && (
            <p className="mt-1.5 text-xs text-red-500">{errors.company_name.message}</p>
          )}
        </div>

        {/* 業界 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            業界 <span className="text-red-400">*</span>
          </label>
          <select
            {...register('industry')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all bg-white"
          >
            <option value="">業界を選択</option>
            {INDUSTRIES.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {errors.industry && (
            <p className="mt-1.5 text-xs text-red-500">{errors.industry.message}</p>
          )}
        </div>

        {/* 会社規模 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            会社規模 <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {([
              { value: 'startup', label: 'スタートアップ', sub: '〜50名' },
              { value: 'sme', label: '中小企業', sub: '51〜300名' },
              { value: 'enterprise', label: '大企業', sub: '300名〜' },
            ] as const).map(option => (
              <label
                key={option.value}
                className="relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-indigo-300"
              >
                <input
                  {...register('company_size')}
                  type="radio"
                  value={option.value}
                  className="sr-only peer"
                />
                <span className="font-semibold text-sm text-slate-700 peer-checked:text-indigo-600">
                  {option.label}
                </span>
                <span className="text-xs text-slate-400 mt-1">{option.sub}</span>
                <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-indigo-500 peer-checked:bg-indigo-50 transition-all pointer-events-none" />
              </label>
            ))}
          </div>
        </div>

        {/* 設立年 */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            設立年 <span className="text-slate-400 font-normal">(任意)</span>
          </label>
          <input
            {...register('founded_year', { valueAsNumber: true })}
            type="number"
            placeholder="例：2018"
            min="1800"
            max={new Date().getFullYear()}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          />
        </div>

        {/* ウェブサイト */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Webサイト <span className="text-slate-400 font-normal">(任意)</span>
          </label>
          <input
            {...register('website')}
            type="url"
            placeholder="https://example.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
          />
          {errors.website && (
            <p className="mt-1.5 text-xs text-red-500">{errors.website.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200 mt-8"
        >
          次へ：経営哲学の質問へ →
        </button>
      </form>
    </div>
  )
}
