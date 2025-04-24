export const Suit = {
    CLUBS: 'clubs',
    DIAMONDS: 'diamonds',
    HEARTS: 'hearts',
    SPADES: 'spades',
} as const

export type Suit = typeof Suit[keyof typeof Suit]

export const Rank = {
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    EIGHT: '8',
    NINE: '9',
    TEN: '10',
    JACK: 'jack',
    QUEEN: 'queen',
    KING: 'king',
    ACE: 'ace',
} as const

export type Rank = typeof Rank[keyof typeof Rank]

// Array of ranks in order from lowest to highest
export const RANKS_ORDER = [
    Rank.TWO,
    Rank.THREE,
    Rank.FOUR,
    Rank.FIVE,
    Rank.SIX,
    Rank.SEVEN,
    Rank.EIGHT,
    Rank.NINE,
    Rank.TEN,
    Rank.JACK,
    Rank.QUEEN,
    Rank.KING,
    Rank.ACE,
] as const

// Array of suits in alphabetical order
export const SUITS_ORDER = [
    Suit.CLUBS,
    Suit.DIAMONDS,
    Suit.HEARTS,
    Suit.SPADES,
] as const

// Helper function to get the display name of a rank
function getRankDisplay(rank: Rank): string {
    switch (rank) {
        case Rank.ACE: return 'Ace'
        case Rank.KING: return 'King'
        case Rank.QUEEN: return 'Queen'
        case Rank.JACK: return 'Jack'
        default: return rank
    }
}

// Helper function to get the display name of a suit
function getSuitDisplay(suit: Suit): string {
    return suit.charAt(0).toUpperCase() + suit.slice(1)
}

export class Card {
    readonly suit: Suit
    readonly rank: Rank

    constructor(suit: Suit, rank: Rank) {
        this.suit = suit
        this.rank = rank
    }

    toString(): string {
        return `${getRankDisplay(this.rank)} of ${getSuitDisplay(this.suit)}`
    }

    // Utility method to compare cards by rank
    compareRank(other: Card): number {
        return RANKS_ORDER.indexOf(this.rank) - RANKS_ORDER.indexOf(other.rank)
    }

    // Utility method to compare cards by suit
    compareSuit(other: Card): number {
        return SUITS_ORDER.indexOf(this.suit) - SUITS_ORDER.indexOf(other.suit)
    }

    // Utility method to check if two cards are equal
    equals(other: Card): boolean {
        return this.suit === other.suit && this.rank === other.rank
    }

    // Factory method to create a card
    static create(suit: Suit, rank: Rank): Card {
        return new Card(suit, rank)
    }
} 