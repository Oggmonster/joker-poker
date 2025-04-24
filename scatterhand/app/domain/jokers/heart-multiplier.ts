import { BaseJoker, JokerRarity } from '../joker'
import { Card, Suit } from '../cards'

/**
 * A joker that multiplies the score for each heart in the hand
 */
export class HeartMultiplier extends BaseJoker {
    private static readonly BASE_MULTIPLIER = 50
    private static readonly LEVEL_MULTIPLIER = 50

    constructor(id: string) {
        super(
            id,
            'Heart Multiplier',
            'Adds score for each heart in your hand',
            JokerRarity.COMMON
        )
    }

    applyEffect(hand: readonly Card[]): number {
        const heartCount = hand.filter(card => card.suit === Suit.HEARTS).length
        const multiplier = HeartMultiplier.BASE_MULTIPLIER + 
            (HeartMultiplier.LEVEL_MULTIPLIER * (this.level - 1))
        return heartCount * multiplier
    }

    getEffectDescription(): string {
        const multiplier = HeartMultiplier.BASE_MULTIPLIER + 
            (HeartMultiplier.LEVEL_MULTIPLIER * (this.level - 1))
        return `+${multiplier} points per heart`
    }
} 