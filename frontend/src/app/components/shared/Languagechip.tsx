interface LanguageChipProps {
  language: string
}

const languageColors: Record<string, string> = {
  typescript: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  javascript: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  python: 'text-green-400 border-green-500/30 bg-green-500/10',
  rust: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
  go: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  java: 'text-red-400 border-red-500/30 bg-red-500/10',
  sql: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  'node.js': 'text-green-400 border-green-500/30 bg-green-500/10',
  react: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
}

export function LanguageChip({ language }: LanguageChipProps) {
  const colorClass =
    languageColors[language.toLowerCase()] ||
    'text-[var(--muted)] border-border bg-[var(--secondary)]'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono-display ${colorClass}`}
    >
      {language}
    </span>
  )
}