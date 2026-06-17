export function formatRelativeTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const diffMs = Date.now() - date.getTime()
  const absMs = Math.abs(diffMs)
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
  ]

  for (const [unit, ms] of units) {
    if (absMs >= ms) {
      return new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' }).format(
        Math.round(-diffMs / ms),
        unit
      )
    }
  }

  return 'just now'
}

export function countValue(value: string | number | undefined) {
  return typeof value === 'string' ? Number(value) : value ?? 0
}
