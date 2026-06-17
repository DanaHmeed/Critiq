import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { AppSidebar } from '../components/shared/AppSidebar'
import { StepTracker } from '../components/shared/StepTracker'
import { UserAvatar } from '../components/shared/Useravatar'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { cn } from '../components/ui/utils'
import { requestApi } from '../../api/requests'
import { userApi } from '../../api/users'
import type { User } from '../../api/types'

const languages = ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'SQL', 'C++']
const urgencies = ['low', 'normal', 'high'] as const

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
    if (!formData.reviewerId) return

    setSubmitting(true)
    setError('')
    try {
      const { request } = await requestApi.create({
        title: formData.title,
        description: formData.description,
        language: formData.language,
        code: formData.code,
        urgency: formData.urgency,
        reviewer_id: formData.reviewerId,
      })
      navigate(`/review/${request.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-foreground mb-6 mt-10 lg:mt-0 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="mb-8">
            <h1 className="mb-1">New Review Request</h1>
            <p className="text-sm text-[var(--muted)]">Submit code for peer review</p>
          </div>

          <div className="mb-8 overflow-x-auto pb-1">
            <StepTracker steps={steps} currentStep={currentStep} />
          </div>

          <div className="bg-[var(--surface)] border border-border rounded-md p-6 sm:p-8">
            {error && <div className="mb-4 text-sm text-red-400">{error}</div>}

            {currentStep === 0 && (
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of what you need reviewed"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide context, specific concerns, or areas you'd like feedback on"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 bg-[var(--input-background)] border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-1.5">
                <Label htmlFor="code">Code Snippet</Label>
                <Textarea
                  id="code"
                  placeholder="Paste your code here..."
                  rows={20}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="bg-[var(--code-surface)] font-mono text-sm"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Select Reviewer</Label>
                  <div className="space-y-3">
                    {loadingReviewers && (
                      <p className="text-sm text-[var(--muted)]">Loading reviewers...</p>
                    )}
                    {!loadingReviewers && reviewers.length === 0 && (
                      <p className="text-sm text-[var(--muted)]">No reviewers are available yet.</p>
                    )}
                    {reviewers.map((reviewer) => (
                      <button
                        key={reviewer.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, reviewerId: reviewer.id })}
                        className={cn(
                          'w-full p-4 border rounded-md text-left transition-all',
                          formData.reviewerId === reviewer.id
                            ? 'border-[var(--accent)] bg-[var(--accent)]/8'
                            : 'border-border hover:border-[var(--accent)]/40'
                        )}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <UserAvatar name={reviewer.name} />
                          <div>
                            <div className="font-medium text-sm">{reviewer.name}</div>
                            <div className="text-xs text-[var(--muted)]">{reviewer.review_count} reviews</div>
                          </div>
                          {formData.reviewerId === reviewer.id && (
                            <div className="ml-auto w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-[var(--secondary)] border border-border rounded font-mono-display text-[var(--muted)]">
                          {reviewer.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Urgency</Label>
                  <div className="flex gap-2">
                    {urgencies.map((urgency) => (
                      <button
                        key={urgency}
                        type="button"
                        onClick={() => setFormData({ ...formData, urgency })}
                        className={cn(
                          'px-4 py-2 border rounded-md text-sm capitalize transition-all font-mono-display',
                          formData.urgency === urgency
                            ? 'border-[var(--accent)] bg-[var(--accent)]/8 text-[var(--accent)]'
                            : 'border-border text-[var(--muted)] hover:border-[var(--accent)]/40'
                        )}
                      >
                        {urgency}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                variant="outline"
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              {currentStep < 2 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canContinue}
                  className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.reviewerId || submitting}
                  className="bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 border-0 disabled:opacity-40"
                >
                  <Check className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
