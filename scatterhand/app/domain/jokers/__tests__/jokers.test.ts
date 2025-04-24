import { expect, test, describe } from 'vitest'
import { Card, Suit, Rank } from '../../cards'
import { HeartMultiplier } from '../heart-multiplier'
import { FaceCollector } from '../face-collector'
import { StraightSeeker } from '../straight-seeker'
import { LegendaryFlush } from '../legendary-flush'

describe('Joker Implementations', () => {
    describe('HeartMultiplier', () => {
        test('calculates correct bonus for hearts', () => {
            const joker = new HeartMultiplier('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.ACE),
                new Card(Suit.HEARTS, Rank.KING),
                new Card(Suit.SPADES, Rank.QUEEN)
            ]
            expect(joker.applyEffect(hand)).toBe(100) // 2 hearts * 50 points
        })

        test('increases bonus with level', () => {
            const joker = new HeartMultiplier('test')
            const hand = [new Card(Suit.HEARTS, Rank.ACE)]
            expect(joker.applyEffect(hand)).toBe(50) // Level 1: 50 points
            joker.upgrade()
            expect(joker.applyEffect(hand)).toBe(100) // Level 2: 100 points
        })
    })

    describe('FaceCollector', () => {
        test('calculates exponential bonus for face cards', () => {
            const joker = new FaceCollector('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.JACK),
                new Card(Suit.SPADES, Rank.QUEEN),
                new Card(Suit.DIAMONDS, Rank.KING)
            ]
            // 3 face cards: 100 * 2^2 = 400 points
            expect(joker.applyEffect(hand)).toBe(400)
        })

        test('gives no bonus for non-face cards', () => {
            const joker = new FaceCollector('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.ACE),
                new Card(Suit.SPADES, Rank.TEN)
            ]
            expect(joker.applyEffect(hand)).toBe(0)
        })

        test('increases bonus with level', () => {
            const joker = new FaceCollector('test')
            const hand = [new Card(Suit.HEARTS, Rank.JACK)]
            expect(joker.applyEffect(hand)).toBe(100) // Level 1: 100 points
            joker.upgrade()
            expect(joker.applyEffect(hand)).toBe(200) // Level 2: 200 points
        })
    })

    describe('StraightSeeker', () => {
        test('calculates bonus for potential straights', () => {
            const joker = new StraightSeeker('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.SEVEN),
                new Card(Suit.SPADES, Rank.EIGHT),
                new Card(Suit.DIAMONDS, Rank.NINE),
                new Card(Suit.CLUBS, Rank.TEN)
            ]
            // 4 cards in sequence: 150 * 2^1 = 300 points
            expect(joker.applyEffect(hand)).toBe(300)
        })

        test('handles gaps based on level', () => {
            const joker = new StraightSeeker('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.SEVEN),
                new Card(Suit.SPADES, Rank.NINE), // Gap
                new Card(Suit.DIAMONDS, Rank.TEN)
            ]
            // Level 1: Can't handle gaps, so only counts 2 cards (no bonus)
            expect(joker.applyEffect(hand)).toBe(0)
        })

        test('gives no bonus for less than 3 cards', () => {
            const joker = new StraightSeeker('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.SEVEN),
                new Card(Suit.SPADES, Rank.EIGHT)
            ]
            expect(joker.applyEffect(hand)).toBe(0)
        })
    })

    describe('LegendaryFlush', () => {
        test('calculates bonus for same suit', () => {
            const joker = new LegendaryFlush('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.TWO),
                new Card(Suit.HEARTS, Rank.FIVE),
                new Card(Suit.HEARTS, Rank.KING),
                new Card(Suit.HEARTS, Rank.ACE)
            ]
            // 4 hearts: 500 * 3^2 = 4500 points
            expect(joker.applyEffect(hand)).toBe(4500)
        })

        test('uses suit with most cards', () => {
            const joker = new LegendaryFlush('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.TWO),
                new Card(Suit.HEARTS, Rank.FIVE),
                new Card(Suit.HEARTS, Rank.KING),
                new Card(Suit.SPADES, Rank.ACE)
            ]
            // 3 hearts: 500 * 3^1 = 1500 points
            expect(joker.applyEffect(hand)).toBe(1500)
        })

        test('gives no bonus for less than 3 cards of same suit', () => {
            const joker = new LegendaryFlush('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.TWO),
                new Card(Suit.HEARTS, Rank.FIVE),
                new Card(Suit.SPADES, Rank.KING)
            ]
            expect(joker.applyEffect(hand)).toBe(0)
        })

        test('increases bonus with level', () => {
            const joker = new LegendaryFlush('test')
            const hand = [
                new Card(Suit.HEARTS, Rank.TWO),
                new Card(Suit.HEARTS, Rank.FIVE),
                new Card(Suit.HEARTS, Rank.KING)
            ]
            expect(joker.applyEffect(hand)).toBe(1500) // Level 1: 500 * 3^1 = 1500
            joker.upgrade()
            expect(joker.applyEffect(hand)).toBe(3000) // Level 2: (500 + 500) * 3^1 = 3000
        })
    })
}) 