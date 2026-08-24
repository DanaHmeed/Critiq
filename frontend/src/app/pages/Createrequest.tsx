import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { StepTracker } from '../components/shared/StepTracker'
import { UserAvatar } from '../components/shared/Useravatar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code2,
  FileText,
  UserCheck,
  Sparkles,
} from 'lucide-react'
import { cn } from '../components/ui/utils'
import { requestApi } from '../../api/requests'
import { userApi } from '../../api/users'
import type { User } from '../../api/types'

const languages = ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'SQL', 'C++']
const urgencies = [
  { id: 'low', label: 'Low', desc: 'Standard review cadence' },
  { id: 'normal', label: 'Normal', desc: 'Standard 24h turnaround' },
  { id: 'high', label: 'High Priority', desc: 'Urgent blocking PR' },
] as const

export function CreateRequest() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [reviewers, setReviewers] = useState<User[]>([])
  const [loadingReviewers, setLoadingReviewers] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: 'TypeScript',
    code: '',
    reviewerId: null as string | null,
    urgency: 'normal' as 'low' | 'normal' | 'high',
  })

  useEffect(() => {
    let active = true

    userApi.reviewers()
      .then(({ reviewers }) => {
        if (active) setReviewers(reviewers)
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load reviewers')
      })
      .finally(() => {
        if (active) setLoadingReviewers(false)
      })

    return () => {
      active = false
    }
  }, [])

  const steps = [
    { label: 'Details', completed: currentStep > 0 },
    { label: 'Code', completed: currentStep > 1 },
    { label: 'Reviewer', completed: currentStep > 2 },
  ]

  const canContinue =
    currentStep === 0
      ? formData.title.trim().length > 0 && formData.language.length > 0
      : formData.code.trim().length > 0

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const { request } = await requestApi.create({
        title: formData.title,
        description: formData.description,
        language: formData.language,
        code: formData.code,
        urgency: formData.urgency,
        reviewer_id: formData.reviewerId || undefined,
      })
      navigate(`/review/${request.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#08090a] text-[#f7f8f8]">
      <AppSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-xs font-mono text-[#8a8f98] hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#5e6ad2] mb-1 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              New Peer Request
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Create Review Request
            </h1>
            <p className="text-xs text-[#8a8f98] mt-1">
              Submit code snippet for inline peer review and discussion.
            </p>
          </div>

          <div className="mb-8 overflow-x-auto pb-1">
            <StepTracker steps={steps} currentStep={currentStep} />
          </div>

          <div className="rounded-2xl linear-panel p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                {error}
              </div>
            )}

            {/* Step 0: Metadata */}
            {currentStep === 0 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs text-[#d0d6e0]">
                    Request Title <span className="text-[#5e6ad2]">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Refactor Webhook Signature Verification"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-10 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs text-[#d0d6e0]">
                    Context & Questions (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what areas you'd like reviewers to inspect, performance questions, or edge cases..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="language" className="text-xs text-[#d0d6e0]">
                    Language Engine
                  </Label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full h-10 px-3 bg-[#0b0c10] border border-white/[0.08] rounded-lg text-xs text-[#f7f8f8] focus:outline-none focus:border-[#5e6ad2] focus:ring-2 focus:ring-[#5e6ad2]/20"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang} className="bg-[#0b0c10] text-white">
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 1: Code */}
            {currentStep === 1 && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <Label htmlFor="code" className="text-xs text-[#d0d6e0] flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    Paste Code Snippet
                  </Label>
                  <span className="text-[10px] font-mono text-[#8a8f98]">
                    {formData.code.split('\n').length} lines
                  </span>
                </div>
                <Textarea
                  id="code"
                  placeholder="// Paste your code snippet here...&#10;export async function handler() {&#10;  // ...&#10;}"
                  rows={18}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="font-mono text-xs leading-relaxed bg-[#0b0c10] border-white/[0.08] p-4 text-[#f7f8f8]"
                />
              </div>
            )}

            {/* Step 2: Reviewer & Urgency */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <Label className="text-xs text-[#d0d6e0] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    Assign Peer Reviewer (Optional)
                  </Label>

                  {loadingReviewers && (
                    <div className="p-4 text-center text-xs text-[#8a8f98] font-mono">
                      Loading available reviewers...
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, reviewerId: null })}
                      className={cn(
                        'p-3.5 rounded-xl border text-left transition-all select-none',
                        formData.reviewerId === null
                          ? 'border-[#5e6ad2] bg-[#5e6ad2]/10 shadow-[0_0_12px_rgba(94,106,210,0.2)]'
                          : 'border-white/[0.06] bg-[#0b0c10] hover:border-white/[0.15]'
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-white">Open to Pool</span>
                        {formData.reviewerId === null && (
                          <div className="w-4 h-4 rounded-full bg-[#5e6ad2] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8a8f98]">
                        Any reviewer can claim and review this request.
                      </p>
                    </button>

                    {reviewers.map((reviewer) => (
                      <button
                        key={reviewer.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, reviewerId: reviewer.id })}
                        className={cn(
                          'p-3.5 rounded-xl border text-left transition-all select-none',
                          formData.reviewerId === reviewer.id
                            ? 'border-[#5e6ad2] bg-[#5e6ad2]/10 shadow-[0_0_12px_rgba(94,106,210,0.2)]'
                            : 'border-white/[0.06] bg-[#0b0c10] hover:border-white/[0.15]'
                        )}
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <UserAvatar name={reviewer.name} size="sm" online />
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-white truncate">{reviewer.name}</div>
                            <div className="text-[10px] text-[#8a8f98] font-mono">
                              {reviewer.review_count} reviews
                            </div>
                          </div>
                          {formData.reviewerId === reviewer.id && (
                            <div className="ml-auto w-4 h-4 rounded-full bg-[#5e6ad2] flex items-center justify-center shrink-0">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <Label className="text-xs text-[#d0d6e0]">Urgency Level</Label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {urgencies.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, urgency: u.id })}
                        className={cn(
                          'p-3 rounded-xl border text-left transition-all select-none',
                          formData.urgency === u.id
                            ? 'border-[#5e6ad2] bg-[#5e6ad2]/10 text-white shadow-[0_0_12px_rgba(94,106,210,0.2)]'
                            : 'border-white/[0.06] bg-[#0b0c10] text-[#8a8f98] hover:border-white/[0.15]'
                        )}
                      >
                        <div className="text-xs font-medium text-white mb-0.5">{u.label}</div>
                        <div className="text-[10px] text-[#8a8f98] leading-snug">{u.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
              <Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                variant="outline"
                size="sm"
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>

              {currentStep < 2 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  variant="primary"
                  size="sm"
                  disabled={!canContinue}
                  className="gap-1.5"
                >
                  Continue
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  size="sm"
                  disabled={submitting}
                  className="gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  {submitting ? 'Submitting Request...' : 'Publish Request'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
