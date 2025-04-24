import { expect, test, describe } from 'vitest'
import { Card, Suit, Rank } from '../cards'

describe('Card', () => {
    describe('constructor', () => {
        test('creates a card with valid suit and rank', () => {
            const card = new Card(Suit.SPADES, Rank.ACE)
            expect(card.suit).toBe(Suit.SPADES)
            expect(card.rank).toBe(Rank.ACE)
        })
    })

    describe('toString', () => {
        test('formats face cards correctly', () => {
            const aceOfSpades = new Card(Suit.SPADES, Rank.ACE)
            const kingOfHearts = new Card(Suit.HEARTS, Rank.KING)
            const queenOfDiamonds = new Card(Suit.DIAMONDS, Rank.QUEEN)
            const jackOfClubs = new Card(Suit.CLUBS, Rank.JACK)

            expect(aceOfSpades.toString()).toBe('Ace of Spades')
            expect(kingOfHearts.toString()).toBe('King of Hearts')
            expect(queenOfDiamonds.toString()).toBe('Queen of Diamonds')
            expect(jackOfClubs.toString()).toBe('Jack of Clubs')
        })

        test('formats number cards correctly', () => {
            const twoOfSpades = new Card(Suit.SPADES, Rank.TWO)
            const tenOfHearts = new Card(Suit.HEARTS, Rank.TEN)

            expect(twoOfSpades.toString()).toBe('2 of Spades')
            expect(tenOfHearts.toString()).toBe('10 of Hearts')
        })
    })

    describe('compareRank', () => {
        test('correctly compares cards of different ranks', () => {
            const aceOfSpades = new Card(Suit.SPADES, Rank.ACE)
            const kingOfSpades = new Card(Suit.SPADES, Rank.KING)
            const twoOfSpades = new Card(Suit.SPADES, Rank.TWO)

            expect(aceOfSpades.compareRank(kingOfSpades)).toBeGreaterThan(0)
            expect(kingOfSpades.compareRank(aceOfSpades)).toBeLessThan(0)
            expect(kingOfSpades.compareRank(twoOfSpades)).toBeGreaterThan(0)
            expect(twoOfSpades.compareRank(kingOfSpades)).toBeLessThan(0)
        })

        test('returns 0 for cards of the same rank', () => {
            const aceOfSpades = new Card(Suit.SPADES, Rank.ACE)
            const aceOfHearts = new Card(Suit.HEARTS, Rank.ACE)

            expect(aceOfSpades.compareRank(aceOfHearts)).toBe(0)
        })
    })

    describe('compareSuit', () => {
        test('correctly compares cards of different suits', () => {
            const aceOfSpades = new Card(Suit.SPADES, Rank.ACE)
            const aceOfHearts = new Card(Suit.HEARTS, Rank.ACE)
            const aceOfDiamonds = new Card(Suit.DIAMONDS, Rank.ACE)
            const aceOfClubs = new Card(Suit.CLUBS, Rank.ACE)

            expect(aceOfSpades.compareSuit(aceOfHearts)).toBeGreaterThan(0)
            expect(aceOfHearts.compareSuit(aceOfSpades)).toBeLessThan(0)
            expect(aceOfDiamonds.compareSuit(aceOfClubs)).toBeGreaterThan(0)
            expect(aceOfClubs.compareSuit(aceOfSpades)).toBeLessThan(0)
        })

        test('returns 0 for cards of the same suit', () => {
            const aceOfSpades = new Card(Suit.SPADES, Rank.ACE)
            const kingOfSpades = new Card(Suit.SPADES, Rank.KING)

            expect(aceOfSpades.compareSuit(kingOfSpades)).toBe(0)
        })
    })

    describe('equals', () => {
        test('returns true for cards with same suit and rank', () => {
            const aceOfSpades1 = new Card(Suit.SPADES, Rank.ACE)
            const aceOfSpades2 = new Card(Suit.SPADES, Rank.ACE)

            expect(aceOfSpades1.equals(aceOfSpades2)).toBe(true)
        })

        test('returns false for cards with different ranks', () => {
            const aceOfSpades = new Card(Suit.SPADES, Rank.ACE)
            const kingOfSpades = new Card(Suit.SPADES, Rank.KING)

            expect(aceOfSpades.equals(kingOfSpades)).toBe(false)
        })

        test('returns false for cards with different suits', () => {
            const aceOfSpades = new Card(Suit.SPADES, Rank.ACE)
            const aceOfHearts = new Card(Suit.HEARTS, Rank.ACE)

            expect(aceOfSpades.equals(aceOfHearts)).toBe(false)
        })
    })

    describe('create static method', () => {
        test('creates a card with valid suit and rank', () => {
            const card = Card.create(Suit.SPADES, Rank.ACE)
            expect(card).toBeInstanceOf(Card)
            expect(card.suit).toBe(Suit.SPADES)
            expect(card.rank).toBe(Rank.ACE)
        })

        test('created card behaves same as constructor-created card', () => {
            const card1 = Card.create(Suit.SPADES, Rank.ACE)
            const card2 = new Card(Suit.SPADES, Rank.ACE)

            expect(card1.equals(card2)).toBe(true)
            expect(card1.toString()).toBe(card2.toString())
        })
    })
}) 