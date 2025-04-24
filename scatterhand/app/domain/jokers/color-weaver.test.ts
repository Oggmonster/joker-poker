import { expect, test, describe, beforeEach } from 'vitest'
import { ColorWeaver } from './color-weaver'
import { Card, Rank, Suit } from '../cards'

describe('ColorWeaver', () => {
    let colorWeaver: ColorWeaver

    beforeEach(() => {
        colorWeaver = new ColorWeaver('test-id')
    })

    const createCard = (rank: Rank, suit: Suit): Card => new Card(suit, rank)

    describe('basic sequences', () => {
        test('no cards should give 0 points', () => {
            expect(colorWeaver.applyEffect([])).toBe(0)
        })

        test('single card should give 0 points', () => {
            const hand = [createCard(Rank.ACE, Suit.HEARTS)]
            expect(colorWeaver.applyEffect(hand)).toBe(0)
        })

        test('two cards of same color should give 0 points', () => {
            const hand = [
                createCard(Rank.ACE, Suit.HEARTS),
                createCard(Rank.KING, Suit.DIAMONDS)
            ]
            expect(colorWeaver.applyEffect(hand)).toBe(0)
        })

        test('two consecutive alternating cards should give base bonus', () => {
            const hand = [
                createCard(Rank.KING, Suit.HEARTS),
                createCard(Rank.ACE, Suit.SPADES)
            ]
            expect(colorWeaver.applyEffect(hand)).toBe(200) // BASE_BONUS
        })

        test('three consecutive alternating cards should give 2x base bonus', () => {
            const hand = [
                createCard(Rank.QUEEN, Suit.HEARTS),
                createCard(Rank.KING, Suit.SPADES),
                createCard(Rank.ACE, Suit.DIAMONDS)
            ]
            expect(colorWeaver.applyEffect(hand)).toBe(400) // BASE_BONUS * 2
        })
    })

    describe('level effects', () => {
        test('level 2 should allow one gap in sequence', () => {
            colorWeaver.upgrade() // Level 1 -> 2
            const hand = [
                createCard(Rank.JACK, Suit.HEARTS),
                createCard(Rank.KING, Suit.SPADES), // Gap of one (missing QUEEN)
                createCard(Rank.ACE, Suit.DIAMONDS)
            ]
            expect(colorWeaver.applyEffect(hand)).toBe(800) // (BASE_BONUS + LEVEL_BONUS) * 2
        })

        test('level 3 should allow two gaps in sequence', () => {
            colorWeaver.upgrade() // Level 1 -> 2
            colorWeaver.upgrade() // Level 2 -> 3
            const hand = [
                createCard(Rank.TEN, Suit.HEARTS),
                createCard(Rank.KING, Suit.SPADES), // Gap of two (missing JACK, QUEEN)
                createCard(Rank.ACE, Suit.DIAMONDS)
            ]
            expect(colorWeaver.applyEffect(hand)).toBe(1200) // (BASE_BONUS + 2*LEVEL_BONUS) * 2
        })
    })

    describe('edge cases', () => {
        test('should find best sequence in unordered hand', () => {
            const hand = [
                createCard(Rank.ACE, Suit.SPADES),
                createCard(Rank.TWO, Suit.HEARTS),
                createCard(Rank.KING, Suit.DIAMONDS),
                createCard(Rank.QUEEN, Suit.CLUBS)
            ]
            expect(colorWeaver.applyEffect(hand)).toBe(400) // BASE_BONUS * 2^1 for QUEEN-KING-ACE
        })

        test('should handle multiple possible sequences', () => {
            const hand = [
                createCard(Rank.NINE, Suit.HEARTS),
                createCard(Rank.TEN, Suit.SPADES),
                createCard(Rank.JACK, Suit.HEARTS),
                createCard(Rank.QUEEN, Suit.SPADES),
                createCard(Rank.KING, Suit.HEARTS)
            ]
            expect(colorWeaver.applyEffect(hand)).toBe(1600) // BASE_BONUS * 2^3 for sequence of 5
        })

        test('should reset sequence when color pattern breaks', () => {
            const hand = [
                createCard(Rank.NINE, Suit.HEARTS),
                createCard(Rank.TEN, Suit.SPADES),
                createCard(Rank.JACK, Suit.SPADES), // Pattern breaks here
                createCard(Rank.QUEEN, Suit.HEARTS),
                createCard(Rank.KING, Suit.SPADES)
            ]
            expect(colorWeaver.applyEffect(hand)).toBe(400) // BASE_BONUS * 2^1 for best sequence of 3
        })
    })

    describe('effect description', () => {
        test('should include level-specific gap information', () => {
            colorWeaver.upgrade() // Level 1 -> 2
            colorWeaver.upgrade() // Level 2 -> 3
            const description = colorWeaver.getEffectDescription()
            expect(description).toContain('Level 3')
            expect(description).toContain('2 gap(s)')
            expect(description).toContain('600') // BASE_BONUS + 2*LEVEL_BONUS
        })
    })
}) 