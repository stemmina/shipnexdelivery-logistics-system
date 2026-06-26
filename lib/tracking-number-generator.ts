/**
 * Generates unique tracking numbers in the format SNX100001, SNX100002, etc.
 * This is a client-side utility for generating new tracking numbers.
 * In production, this should be called server-side to ensure uniqueness.
 */

export function generateTrackingNumber(): string {
  // Generate a unique timestamp-based sequence
  const now = Date.now()
  const random = Math.floor(Math.random() * 10000)
  const sequence = ((now % 1000000) + random) % 1000000

  // Format as SNX followed by 6 digits
  return `SNX${String(sequence).padStart(6, '0')}`
}

/**
 * Validates if a string is a valid tracking number format
 */
export function isValidTrackingNumber(trackingNumber: string): boolean {
  const pattern = /^SNX\d{6}$/
  return pattern.test(trackingNumber)
}
