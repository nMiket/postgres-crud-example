/** Format a rating value into a string */
export const formatRating = (value: number | null) => {
  if (value === null || Number.isNaN(value)) {
    return 'N/A'
  }

  return value.toFixed(1)
}
