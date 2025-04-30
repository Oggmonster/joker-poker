import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank, Suit } from '../cards'
import { Phase } from '../rounds'

/**
 * A joker that gives bonus points for holding J♠ or J♥ (the one-eyed jacks)
 */
export class OneEyedJack extends BaseJoker {
    private static readonly BASE_BONUS = 5
    private static readonly LEVEL_BONUS = 5

    constructor() {
        super(
            'one-eyed-jack',
            'One-Eyed Jack',
            `${OneEyedJack.BASE_BONUS} points if holding J♠ or J♥ (the one-eyed jacks)`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    private isOneEyedJack(card: Card): boolean {
        return card.rank === Rank.JACK && 
            (card.suit === Suit.SPADES || card.suit === Suit.HEARTS)
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        // Check if any hole card is a one-eyed jack
        if (!holeCards.some(card => this.isOneEyedJack(card))) return 0

        const bonus = OneEyedJack.BASE_BONUS + 
            (OneEyedJack.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = OneEyedJack.BASE_BONUS + 
            (OneEyedJack.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding J♠ or J♥ (the one-eyed jacks)`
    }
} 