interface LanguageChipProps {
  language: string
}

const languageColors: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  typescript: { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', dot: 'bg-sky-400' },
  javascript: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  python: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  rust: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', dot: 'bg-orange-400' },
  go: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', dot: 'bg-cyan-400' },
  java: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', dot: 'bg-rose-400' },
  sql: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-400' },
  'node.js': { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  react: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', dot: 'bg-cyan-400' },
}

export function LanguageChip({ language }: LanguageChipProps) {
  const conf =
    languageColors[language.toLowerCase()] ||
    { text: 'text-[#8a8f98]', bg: 'bg-white/[0.04]', border: 'border-white/[0.08]', dot: 'bg-[#8a8f98]' }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-mono tracking-tight font-medium ${conf.bg} ${conf.border} ${conf.text}`}
    >
      <span className={`w-1 h-1 rounded-full ${conf.dot}`} />
      <span>{language}</span>
    </span>
  )
}