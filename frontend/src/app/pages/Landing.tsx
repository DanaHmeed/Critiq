import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import {
  Code,
  MessageSquare,
  Users,
  Zap,
  Github,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  CheckCircle2,
  GitPullRequest,
  Check,
  Eye,
  Command,
  ShieldCheck,
  ChevronRight,
  Layers,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { useAuth } from '../context/AuthContext'
import { CodeBlock, type CodeComment } from '../components/shared/CodeBlock'
import { StatusBadge } from '../components/shared/Statusbadge'
import { LanguageChip } from '../components/shared/Languagechip'
import { UserAvatar } from '../components/shared/Useravatar'

const demoCode = `// Authenticate and dispatch webhook events
export async function dispatchReviewEvent(payload: ReviewEvent): Promise<Result> {
  const token = await verifySignature(payload.signature);
  if (!token.valid) {
    throw new AuthenticationError("Invalid webhook signature");
  }

  const queue = await getNotificationQueue(payload.reviewerId);
  return queue.enqueue({
    type: payload.eventType,
    timestamp: Date.now(),
    priority: payload.urgency === "high" ? 1 : 3,
  });
}`

export function Landing() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'typescript' | 'rust' | 'go'>('typescript')
  const [sandboxComments, setSandboxComments] = useState<CodeComment[]>([
    {
      line: 4,
      author: 'Elena Rostova',
      text: 'Good catch on the signature verification before queueing.',
      timestamp: '10m ago',
    },
    {
      line: 8,
      author: 'Marcus Vance',
      text: 'Should we add fallback retry logic if the queue is saturated?',
      timestamp: '2m ago',
    },
  ])
  const [selectedLine, setSelectedLine] = useState<number | null>(null)
  const [newCommentText, setNewCommentText] = useState('')

  const handleAddSandboxComment = () => {
    if (!newCommentText.trim() || !selectedLine) return
    setSandboxComments((prev) => [
      ...prev,
      {
        line: selectedLine,
        author: user?.name || 'You (Developer)',
        text: newCommentText,
        timestamp: 'Just now',
      },
    ])
    setNewCommentText('')
    setSelectedLine(null)
  }

  return (
    <div className="min-h-screen bg-[#08090a] text-[#f7f8f8] selection:bg-[#5e6ad2]/30 selection:text-white relative overflow-hidden">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none linear-glow -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 linear-glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-m font-semibold tracking-tight text-white flex items-center gap-1">
              Critiq
              <span className="text-[10px] text-[#8a8f98] font-mono font-normal ml-1 px-1.5 py-0.2 rounded bg-white/[0.06] border border-white/[0.08]">
                v1.0
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs text-[#8a8f98]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#showcase" className="hover:text-white transition-colors">Experience</a>
            <a href="#sandbox" className="hover:text-white transition-colors">Sandbox</a>
            <a href="#workflow" className="hover:text-white transition-colors">Workflow</a>
          </nav>

          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm" className="gap-1.5">
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#5e6ad2]" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="text-xs">
                    Start reviewing
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 sm:pt-28 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-[#8a8f98] mb-8 hover:border-white/[0.18] transition-colors cursor-pointer shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2] animate-pulse" />
          <span className="text-[#d0d6e0] font-medium">Critiq Engine 2.0</span>
          <span className="text-[#525660]">·</span>
          <span>Line-anchored code reviews built for speed</span>
          <ChevronRight className="w-3 h-3 text-[#8a8f98]" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          The system for <br />
          <span className="bg-gradient-to-r from-[#f7f8f8] via-[#d0d6e0] to-[#8a8f98] bg-clip-text text-transparent">
            peer code reviews.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-base text-[#8a8f98] max-w-2xl mx-auto leading-relaxed mb-10">
          Critiq is purpose-built for engineering teams who take code quality seriously.
          Pinpoint line comments, assign qualified peers, and close review cycles in hours, not days.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <Link to="/register">
            <Button variant="primary" size="lg" className="gap-2 text-xs font-medium">
              Start reviewing free
              <span className="kbd-badge bg-white/20 text-white border-white/30 text-[10px]">
                ↵
              </span>
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="gap-2 text-xs font-medium">
              <Github className="w-3.5 h-3.5" />
              Continue with GitHub
            </Button>
          </Link>
        </div>

        {/* Hero Preview: Interactive Code Studio */}
        <div id="showcase" className="relative mt-8 rounded-2xl p-1.5 bg-gradient-to-b from-white/[0.12] to-white/[0.02] shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
          <div className="rounded-xl bg-[#0b0c10] border border-white/[0.06] overflow-hidden text-left">
            {/* Window Topbar */}
            <div className="px-4 py-3 bg-[#0e0f14] border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/80" />
                </div>
                <span className="text-xs font-mono text-[#8a8f98] ml-2">
                  critiq / auth-service / <span className="text-white">webhook-dispatcher.ts</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="in-review" size="sm" />
                <LanguageChip language="TypeScript" />
              </div>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-6 bg-[#08090a]">
              <CodeBlock
                code={demoCode}
                language="typescript"
                comments={sandboxComments}
                showLineNumbers={true}
                maxHeight="none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Pillars */}
      <section id="features" className="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/[0.06]">
        <div className="mb-14 text-center max-w-xl mx-auto">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#5e6ad2] mb-2 font-medium">
            Core Philosophy
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Engineered for velocity & precision
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8f98] mt-2">
            Every feature is crafted to eliminate friction and focus on what matters: the code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bento Card 1 */}
          <div className="md:col-span-2 p-6 rounded-2xl linear-panel flex flex-col justify-between group">
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center mb-4 text-[#5e6ad2]">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Line-Anchored Discussions
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed max-w-md">
                Pin comments directly to specific line numbers. Reviewers leave context-rich feedback without confusing PR thread sprawl.
              </p>
            </div>
            <div className="mt-6 p-3 rounded-lg bg-[#0b0c10] border border-white/[0.06] font-mono text-[11px] text-[#d0d6e0] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Line 4: "Consider adding cache fallback here"
              </span>
              <span className="text-[#8a8f98]">Elena R. · 2m ago</span>
            </div>
          </div>

          {/* Bento Card 2 */}
          <div className="p-6 rounded-2xl linear-panel flex flex-col justify-between group">
            <div>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-4 text-sky-400">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Peer Reviewer Routing
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Directly route requests to specialized peers based on language tags and review history.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <UserAvatar name="Alex Rivera" size="sm" online />
              <UserAvatar name="Sarah Chen" size="sm" online />
              <UserAvatar name="David Kim" size="sm" />
              <span className="text-[10px] text-[#8a8f98] font-mono ml-1">+12 Active Reviewers</span>
            </div>
          </div>

          {/* Bento Card 3 */}
          <div className="p-6 rounded-2xl linear-panel flex flex-col justify-between group">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                <Command className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Keyboard-First Flow
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed">
                Navigate review requests, jump to line comments, and update statuses using crisp shortcuts.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="kbd-badge">C</span>
              <span className="text-[10px] text-[#8a8f98]">New Request</span>
              <span className="kbd-badge ml-2">G D</span>
              <span className="text-[10px] text-[#8a8f98]">Dashboard</span>
            </div>
          </div>

          {/* Bento Card 4 */}
          <div className="md:col-span-2 p-6 rounded-2xl linear-panel flex flex-col justify-between group">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                Turnaround Time & Velocity Tracking
              </h3>
              <p className="text-xs text-[#8a8f98] leading-relaxed max-w-md">
                Monitor response times, completed reviews, and quality scores in real-time across your workspace.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-[#0b0c10] border border-white/[0.06]">
                <div className="text-lg font-mono font-medium text-white">&lt; 1.5h</div>
                <div className="text-[10px] text-[#8a8f98]">Avg Turnaround</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0b0c10] border border-white/[0.06]">
                <div className="text-lg font-mono font-medium text-white">99.4%</div>
                <div className="text-[10px] text-[#8a8f98]">Resolution Rate</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0b0c10] border border-white/[0.06]">
                <div className="text-lg font-mono font-medium text-white">100%</div>
                <div className="text-[10px] text-[#8a8f98]">Inline Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox Section */}
      <section id="sandbox" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.06]">
        <div className="text-center mb-10">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#5e6ad2] mb-2 font-medium">
            Interactive Demo
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Try the inline review experience
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8f98] mt-2">
            Hover over any line below and click the comment icon to leave a test note.
          </p>
        </div>

        <div className="rounded-2xl p-1 bg-gradient-to-b from-white/[0.1] to-transparent">
          <div className="p-4 sm:p-6 rounded-xl bg-[#0b0c10] border border-white/[0.06]">
            <CodeBlock
              code={demoCode}
              language="typescript"
              comments={sandboxComments}
              onAddComment={(line) => setSelectedLine(line)}
              highlightedLine={selectedLine}
              maxHeight="none"
            />

            {selectedLine && (
              <div className="mt-4 p-4 rounded-xl bg-[#12131a] border border-[#5e6ad2]/40 shadow-lg animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#5e6ad2]" />
                  <span className="text-xs font-mono text-[#8a8f98]">
                    Leaving note on Line {selectedLine}
                  </span>
                </div>
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Type your peer review comment..."
                  className="w-full h-20 p-2.5 rounded-lg bg-[#08090a] border border-white/[0.08] text-xs text-[#f7f8f8] placeholder:text-[#525660] focus:outline-none focus:border-[#5e6ad2] resize-none mb-3"
                />
                <div className="flex items-center gap-2">
                  <Button variant="primary" size="sm" onClick={handleAddSandboxComment}>
                    Submit comment
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedLine(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/[0.06] text-center">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-[#12131a] to-[#0a0b0e] border border-white/[0.1] overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#5e6ad2]/20 blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
            Level up your code review culture today
          </h2>
          <p className="text-xs sm:text-sm text-[#8a8f98] max-w-md mx-auto mb-8 leading-relaxed">
            Free forever for individual developers and small peer teams. Experience the clarity of modern reviews.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button variant="primary" size="lg" className="text-xs font-medium">
                Get started free
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="text-xs font-medium">
                Sign in to workspace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-4 sm:px-6 bg-[#0a0b0e]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#8a8f98]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-md bg-[#5e6ad2] flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white">Critiq</span>
            <span className="text-[#525660]">·</span>
            <span>© 2026 Critiq Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-[#d0d6e0]">All systems operational</span>
            </div>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
