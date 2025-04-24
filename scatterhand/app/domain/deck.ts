import { Card, Suit, Rank, SUITS_ORDER, RANKS_ORDER } from './cards'

export class Deck {
    private cards: Card[]

    constructor() {
        this.cards = []
    }

    /**
     * Add a card to the deck
     */
    addCard(card: Card): void {
        this.cards.push(card)
    }

    /**
     * Remove and return the top card from the deck
     * @throws Error if the deck is empty
     */
    drawCard(): Card {
        const card = this.cards.pop()
        if (!card) {
            throw new Error('No cards left in the deck')
        }
        return card
    }

    /**
     * Try to draw a card, returning undefined if the deck is empty
     */
    tryDrawCard(): Card | undefined {
        return this.cards.pop()
    }

    /**
     * Shuffle the deck using the Fisher-Yates algorithm
     */
    shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            //@ts-ignore            
            ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
        }
    }

    /**
     * Create a new standard 52-card deck
     */
    static createStandard(): Deck {
        const deck = new Deck()
        for (const suit of SUITS_ORDER) {
            for (const rank of RANKS_ORDER) {
                deck.addCard(new Card(suit, rank))
            }
        }
        return deck
    }

    /**
     * Get the number of cards in the deck
     */
    get size(): number {
        return this.cards.length
    }

    /**
     * Check if the deck is empty
     */
    isEmpty(): boolean {
        return this.cards.length === 0
    }

    /**
     * Get all cards in the deck
     */
    getCards(): readonly Card[] {
        return [...this.cards]
    }

    /**
     * Remove all cards from the deck
     */
    clear(): void {
        this.cards = []
    }

    /**
     * Add multiple cards to the deck
     */
    addCards(cards: Card[]): void {
        this.cards.push(...cards)
    }

    /**
     * Draw multiple cards from the deck
     * @throws Error if there aren't enough cards
     */
    drawCards(count: number): Card[] {
        if (count > this.cards.length) {
            throw new Error('Not enough cards in the deck')
        }
        return this.cards.splice(this.cards.length - count, count)
    }

    /**
     * Try to draw multiple cards, returning undefined if there aren't enough
     */
    tryDrawCards(count: number): Card[] | undefined {
        if (count > this.cards.length) {
            return undefined
        }
        return this.cards.splice(this.cards.length - count, count)
    }

    /**
     * Return string representation of the deck
     */
    toString(): string {
        return this.cards.map(card => card.toString()).join(', ')
    }
} 