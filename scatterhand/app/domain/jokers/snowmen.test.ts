import { expect, test, describe, beforeEach } from 'vitest'
import { Snowmen } from './snowmen'
import { Card, Rank, Suit } from '../cards'
import { JokerRarity, JokerType } from '../joker'
import { Phase } from '../round-state'

describe('Snowmen', () => {
    let snowmen: Snowmen

    beforeEach(() => {
        snowmen = new Snowmen()
    })

    const createCard = (rank: Rank, suit: Suit): Card => new Card(suit, rank)

    describe('basic effects', () => {
        test('no cards should give 0 points', () => {
            expect(snowmen.calculateBonus({ holeCards: [], phase: Phase.FLOP })).toBe(0)
        })

        test('single card should give 0 points', () => {
            const hand = [createCard(Rank.EIGHT, Suit.HEARTS)]
            expect(snowmen.calculateBonus({ holeCards: hand, phase: Phase.FLOP })).toBe(0)
        })

        test('pair of eights should give base bonus', () => {
            const hand = [
                createCard(Rank.EIGHT, Suit.HEARTS),
                createCard(Rank.EIGHT, Suit.DIAMONDS)
            ]
            expect(snowmen.calculateBonus({ holeCards: hand, phase: Phase.FLOP })).toBe(4)
        })

        test('non-eight pair should give 0 points', () => {
            const hand = [
                createCard(Rank.SEVEN, Suit.HEARTS),
                createCard(Rank.SEVEN, Suit.DIAMONDS)
            ]
            expect(snowmen.calculateBonus({ holeCards: hand, phase: Phase.FLOP })).toBe(0)
        })

        test('one eight and another card should give 0 points', () => {
            const hand = [
                createCard(Rank.EIGHT, Suit.HEARTS),
                createCard(Rank.KING, Suit.DIAMONDS)
            ]
            expect(snowmen.calculateBonus({ holeCards: hand, phase: Phase.FLOP })).toBe(0)
        })
    })

    describe('level effects', () => {
        test('level 2 should increase bonus', () => {
            snowmen.upgrade() // Level 1 -> 2
            const hand = [
                createCard(Rank.EIGHT, Suit.HEARTS),
                createCard(Rank.EIGHT, Suit.DIAMONDS)
            ]
            expect(snowmen.calculateBonus({ holeCards: hand, phase: Phase.FLOP })).toBe(8) // base + level bonus
        })

        test('level 3 should further increase bonus', () => {
            snowmen.upgrade() // Level 1 -> 2
            snowmen.upgrade() // Level 2 -> 3
            const hand = [
                createCard(Rank.EIGHT, Suit.HEARTS),
                createCard(Rank.EIGHT, Suit.DIAMONDS)
            ]
            expect(snowmen.calculateBonus({ holeCards: hand, phase: Phase.FLOP })).toBe(12) // base + 2*level bonus
        })
    })

    describe('effect description', () => {
        test('should include level and bonus information', () => {
            snowmen.upgrade() // Level 1 -> 2
            const description = snowmen.getDescription()
            expect(description).toContain('Level 2')
            expect(description).toContain('8') // base + level bonus
            expect(description.toLowerCase()).toContain('pocket eights')
        })
    })

    test('should initialize with correct properties', () => {
        expect(snowmen.name).toBe('Snowmen')
        expect(snowmen.effect).toBe('Bonus points for pocket eights (8-8)')
        expect(snowmen.rarity).toBe(JokerRarity.COMMON)
        expect(snowmen.type).toBe(JokerType.PLAYER)
    })

    test('should award bonus points for pocket eights', () => {
        const holeCards = [
            new Card(Suit.HEARTS, Rank.EIGHT),
            new Card(Suit.DIAMONDS, Rank.EIGHT)
        ]

        const bonus = snowmen.calculateBonus({ holeCards, phase: Phase.FLOP })
        expect(bonus).toBe(4)
    })

    test('should not award points for non-matching hole cards', () => {
        const holeCards = [
            new Card(Suit.HEARTS, Rank.EIGHT),
            new Card(Suit.DIAMONDS, Rank.SEVEN)
        ]

        const bonus = snowmen.calculateBonus({ holeCards, phase: Phase.FLOP })
        expect(bonus).toBe(0)
    })

    test('should not award points for single card', () => {
        const holeCards = [new Card(Suit.HEARTS, Rank.EIGHT)]

        const bonus = snowmen.calculateBonus({ holeCards, phase: Phase.FLOP })
        expect(bonus).toBe(0)
    })


    test('should scale bonus with level', () => {
        const holeCards = [
            new Card(Suit.HEARTS, Rank.EIGHT),
            new Card(Suit.DIAMONDS, Rank.EIGHT)
        ]

        snowmen.upgrade() // Level 2
        const bonus = snowmen.calculateBonus({ holeCards, phase: Phase.FLOP })
        expect(bonus).toBe(8) // Base bonus (4) + Level bonus (4)
    })
}) 