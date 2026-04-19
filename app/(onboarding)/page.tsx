'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Step1Company from '@/components/onboarding/Step1Company'
import Step2Philosophy from '@/components/onboarding/Step2Philosophy'
import Step3Settings from '@/components/onboarding/Step3Settings'
import GeneratingScreen from '@/components/onboarding/GeneratingScreen'
import type { OnboardingState, PhilosophyInput } from '@/types'

const STEPS = [
  { number: 1, label: '企業情報', sublabel: '3分' },
  { number: 2, label: '経営哲学', sublabel: '10分' },
  { number: 3, label: '設定', sublabel: '2分' },
]

export default function OnboardingPage() {
  const [state, setState] = useState<OnboardingState>({
    step: 1,
    input: {},
    isLoading: false,
  })

  const updateInput = (data: Partial<PhilosophyInput>) => {
    setState(prev => ({
      ...prev,
      input: { ...prev.input, ...data },
    }))
  }

  const goToStep = (step: 1 | 2 | 3 | 4) => {
    setState(prev => ({ ...prev, step }))
  }

  const handleGenerate = async () => {
    goToStep(4)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="font-semibold text-slate-800">PhilosophyOS</span>
          </div>
          {state.step < 4 && (
            <span className="text-sm text-slate-500">
              残り約 {state.step === 1 ? '12' : state.step === 2 ? '9' : '2'} 分
            </span>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Step indicator */}
        {state.step < 4 && (
          <div className="mb-12">
            <div className="flex items-center justify-center gap-0">
              {STEPS.map((step, i) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        state.step === step.number
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                          : state.step > step.number
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {state.step > step.number ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-xs font-medium ${state.step === step.number ? 'text-indigo-600' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-slate-300">{step.sublabel}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`w-24 h-0.5 mb-6 mx-2 transition-all duration-300 ${
                        state.step > step.number ? 'bg-indigo-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          {state.step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step1Company
                data={state.input}
                onUpdate={updateInput}
                onNext={() => goToStep(2)}
              />
            </motion.div>
          )}

          {state.step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step2Philosophy
                data={state.input}
                onUpdate={updateInput}
                onNext={() => goToStep(3)}
                onBack={() => goToStep(1)}
              />
            </motion.div>
          )}

          {state.step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Step3Settings
                data={state.input}
                onUpdate={updateInput}
                onGenerate={handleGenerate}
                onBack={() => goToStep(2)}
              />
            </motion.div>
          )}

          {state.step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <GeneratingScreen input={state.input as PhilosophyInput} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
