/** Formats a release date into a year string */
export const getReleaseYear = (value: string | null) => {
  if (!value) {
    return '----'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '----'
  }

  return String(date.getFullYear())
}

/** Formats a date into a readable string */
export const formatDate = (value: string | null) => {
  if (!value) {
    return 'UNKNOWN'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'UNKNOWN'
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}
