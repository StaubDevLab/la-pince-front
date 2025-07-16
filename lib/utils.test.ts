import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { formatRelativeDate } from './utils'

describe('formatRelativeDate', () => {
  // Fixe une date "actuelle" pour éviter les tests dépendants du moment d'exécution
  const now = new Date('2025-07-16T12:00:00Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return "Il y a quelques secondes"', () => {
    const date = new Date(now.getTime() - 10 * 1000) // 10s ago
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a quelques secondes')
  })

  it('should return "Il y a 1 minute"', () => {
    const date = new Date(now.getTime() - 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 1 minute')
  })

  it('should return "Il y a 5 minutes"', () => {
    const date = new Date(now.getTime() - 5 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 5 minutes')
  })

  it('should return "Il y a 1 heure"', () => {
    const date = new Date(now.getTime() - 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 1 heure')
  })

  it('should return "Il y a 12 heures"', () => {
    const date = new Date(now.getTime() - 12 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 12 heures')
  })

  it('should return "Il y a 1 jour"', () => {
    const date = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 1 jour')
  })

  it('should return "Il y a 6 jours"', () => {
    const date = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 6 jours')
  })

  it('should return "Il y a 1 semaine"', () => {
    const date = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 1 semaine')
  })

  it('should return "Il y a 3 semaines"', () => {
    const date = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 3 semaines')
  })

  it('should return "Il y a 1 mois"', () => {
    const date = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 1 mois')
  })

  it('should return "Il y a 5 mois"', () => {
    const date = new Date(now.getTime() - 150 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 5 mois')
  })

  it('should return "Il y a 1 an"', () => {
    const date = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 1 an')
  })

  it('should return "Il y a 3 ans"', () => {
    const date = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000)
    expect(formatRelativeDate(date.toISOString())).toBe('Il y a 3 ans')
  })
})
