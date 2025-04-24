import { expect, test, describe, beforeEach } from 'vitest'
import { Deck } from '../deck'
import { Card, Suit, Rank } from '../cards'

describe('Deck', () => {
    let deck: Deck

    beforeEach(() => {
        deck = new Deck()
    })

    describe('constructor', () => {
        test('creates an empty deck', () => {
            expect(deck.size).toBe(0)
            expect(deck.isEmpty()).toBe(true)
        })
    })

    describe('addCard', () => {
        test('adds a single card to the deck', () => {
            const card = new Card(Suit.SPADES, Rank.ACE)
            deck.addCard(card)
            expect(deck.size).toBe(1)
            expect(deck.isEmpty()).toBe(false)
        })
    })

    describe('drawCard', () => {
        test('removes and returns the top card', () => {
            const card = new Card(Suit.SPADES, Rank.ACE)
            deck.addCard(card)
            const drawn = deck.drawCard()
            expect(drawn.suit).toBe(Suit.SPADES)
            expect(drawn.rank).toBe(Rank.ACE)
            expect(deck.isEmpty()).toBe(true)
        })

        test('throws error when drawing from empty deck', () => {
            expect(() => deck.drawCard()).toThrow('No cards left in the deck')
        })
    })

    describe('tryDrawCard', () => {
        test('removes and returns the top card if available', () => {
            const card = new Card(Suit.SPADES, Rank.ACE)
            deck.addCard(card)
            const drawn = deck.tryDrawCard()
            expect(drawn?.suit).toBe(Suit.SPADES)
            expect(drawn?.rank).toBe(Rank.ACE)
            expect(deck.isEmpty()).toBe(true)
        })

        test('returns undefined when drawing from empty deck', () => {
            expect(deck.tryDrawCard()).toBeUndefined()
        })
    })

    describe('createStandard', () => {
        test('creates a standard 52-card deck', () => {
            deck = Deck.createStandard()
            expect(deck.size).toBe(52)

            // Check if all suits and ranks are present
            const cards = deck.getCards()
            for (const suit of [Suit.CLUBS, Suit.DIAMONDS, Suit.HEARTS, Suit.SPADES]) {
                for (const rank of [Rank.ACE, Rank.TWO, Rank.TEN, Rank.JACK, Rank.QUEEN, Rank.KING]) {
                    expect(cards.some(card => card.suit === suit && card.rank === rank)).toBe(true)
                }
            }
        })
    })

    describe('shuffle', () => {
        test('maintains the same number of cards', () => {
            deck = Deck.createStandard()
            const originalSize = deck.size
            deck.shuffle()
            expect(deck.size).toBe(originalSize)
        })

        test('changes the order of cards', () => {
            deck = Deck.createStandard()
            const originalOrder = deck.getCards().map(card => card.toString())
            deck.shuffle()
            const newOrder = deck.getCards().map(card => card.toString())
            
            // Note: There's a tiny chance this could fail even with a correct shuffle
            // due to the random nature of shuffling
            expect(originalOrder.join(',')).not.toBe(newOrder.join(','))
        })
    })

    describe('drawCards', () => {
        test('draws multiple cards successfully', () => {
            deck = Deck.createStandard()
            const cards = deck.drawCards(5)
            expect(cards.length).toBe(5)
            expect(deck.size).toBe(47)
        })

        test('throws error when drawing too many cards', () => {
            deck = Deck.createStandard()
            expect(() => deck.drawCards(53)).toThrow('Not enough cards in the deck')
        })
    })

    describe('tryDrawCards', () => {
        test('draws multiple cards if available', () => {
            deck = Deck.createStandard()
            const cards = deck.tryDrawCards(5)
            expect(cards?.length).toBe(5)
            expect(deck.size).toBe(47)
        })

        test('returns undefined when drawing too many cards', () => {
            deck = Deck.createStandard()
            expect(deck.tryDrawCards(53)).toBeUndefined()
            expect(deck.size).toBe(52) // Deck should remain unchanged
        })
    })

    describe('clear', () => {
        test('removes all cards from the deck', () => {
            deck = Deck.createStandard()
            expect(deck.size).toBe(52)
            deck.clear()
            expect(deck.size).toBe(0)
            expect(deck.isEmpty()).toBe(true)
        })
    })

    describe('addCards', () => {
        test('adds multiple cards to the deck', () => {
            const cards = [
                new Card(Suit.SPADES, Rank.ACE),
                new Card(Suit.HEARTS, Rank.KING)
            ]
            deck.addCards(cards)
            expect(deck.size).toBe(2)
            expect(deck.getCards()).toEqual(cards)
        })
    })

    describe('toString', () => {
        test('returns correct string representation', () => {
            deck.addCard(new Card(Suit.SPADES, Rank.ACE))
            deck.addCard(new Card(Suit.HEARTS, Rank.KING))
            expect(deck.toString()).toBe('Ace of Spades, King of Hearts')
        })

        test('returns empty string for empty deck', () => {
            expect(deck.toString()).toBe('')
        })
    })
}) 