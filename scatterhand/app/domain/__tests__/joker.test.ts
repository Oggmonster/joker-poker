import { expect, test, describe } from 'vitest'
import { BaseJoker, JokerRarity } from '../joker'

// Test implementation of BaseJoker
class TestJoker extends BaseJoker {
    constructor(
        id: string,
        name: string,
        effect: string,
        rarity: JokerRarity = JokerRarity.COMMON,
        level: number = 1
    ) {
        super(id, name, effect, rarity, level)
    }

    applyEffect(hand: readonly any[]): number {
        return hand.length * this.level // Simple test implementation
    }
}

describe('BaseJoker', () => {
    describe('constructor', () => {
        test('initializes with correct values', () => {
            const joker = new TestJoker('j1', 'Test Joker', 'Test Effect')
            expect(joker.id).toBe('j1')
            expect(joker.name).toBe('Test Joker')
            expect(joker.effect).toBe('Test Effect')
            expect(joker.rarity).toBe(JokerRarity.COMMON)
            expect(joker.level).toBe(1)
        })

        test('initializes with custom level', () => {
            const joker = new TestJoker('j1', 'Test Joker', 'Test Effect', JokerRarity.COMMON, 3)
            expect(joker.level).toBe(3)
        })

        test('throws error on invalid level below 1', () => {
            expect(() => new TestJoker('j1', 'Test Joker', 'Test Effect', JokerRarity.COMMON, 0))
                .toThrow('Joker level must be between 1 and 5')
        })

        test('throws error on invalid level above 5', () => {
            expect(() => new TestJoker('j1', 'Test Joker', 'Test Effect', JokerRarity.COMMON, 6))
                .toThrow('Joker level must be between 1 and 5')
        })
    })

    describe('upgrade', () => {
        test('upgrades level correctly', () => {
            const joker = new TestJoker('j1', 'Test Joker', 'Test Effect')
            expect(joker.level).toBe(1)
            joker.upgrade()
            expect(joker.level).toBe(2)
        })

        test('throws error when upgrading at max level', () => {
            const joker = new TestJoker('j1', 'Test Joker', 'Test Effect', JokerRarity.COMMON, 5)
            expect(() => joker.upgrade()).toThrow('Joker is already at max level')
        })
    })

    describe('applyEffect', () => {
        test('applies effect based on level', () => {
            const joker = new TestJoker('j1', 'Test Joker', 'Test Effect')
            const hand = [1, 2, 3] // Mock hand
            expect(joker.applyEffect(hand)).toBe(3) // 3 cards * level 1
            joker.upgrade()
            expect(joker.applyEffect(hand)).toBe(6) // 3 cards * level 2
        })
    })

    describe('rarity', () => {
        test('initializes with different rarities', () => {
            const commonJoker = new TestJoker('j1', 'Common', 'Effect', JokerRarity.COMMON)
            const uncommonJoker = new TestJoker('j2', 'Uncommon', 'Effect', JokerRarity.UNCOMMON)
            const rareJoker = new TestJoker('j3', 'Rare', 'Effect', JokerRarity.RARE)
            const legendaryJoker = new TestJoker('j4', 'Legendary', 'Effect', JokerRarity.LEGENDARY)
            const uniqueJoker = new TestJoker('j5', 'Unique', 'Effect', JokerRarity.UNIQUE)

            expect(commonJoker.rarity).toBe(JokerRarity.COMMON)
            expect(uncommonJoker.rarity).toBe(JokerRarity.UNCOMMON)
            expect(rareJoker.rarity).toBe(JokerRarity.RARE)
            expect(legendaryJoker.rarity).toBe(JokerRarity.LEGENDARY)
            expect(uniqueJoker.rarity).toBe(JokerRarity.UNIQUE)
        })
    })
}) 