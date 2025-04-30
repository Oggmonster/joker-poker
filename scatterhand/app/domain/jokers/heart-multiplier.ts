import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Suit } from '../cards'
import { Phase } from '../rounds'

/**
 * A joker that multiplies points based on the number of hearts
 */
export class HeartMultiplier extends BaseJoker {
    private static readonly BASE_MULTIPLIER = 0.5; // 50% bonus per heart
    private static readonly LEVEL_MULTIPLIER = 0.5; // Additional 50% per level

    constructor() {
        super(
            'heart-multiplier',
            'Heart Multiplier',
            `Multiply points by ${(HeartMultiplier.BASE_MULTIPLIER * 100).toFixed(0)}% for each heart`,
            JokerRarity.RARE,
            JokerType.COMMUNITY
        )
    }

    private countHearts(cards: readonly Card[]): number {
        return cards.filter(card => card.suit === Suit.HEARTS).length
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        if (!playedHand) return 0;
        
        const heartCount = this.countHearts([...playedHand, ...holeCards]);
        if (heartCount === 0) return 0;

        const multiplier = HeartMultiplier.BASE_MULTIPLIER + 
            (HeartMultiplier.LEVEL_MULTIPLIER * (this.level - 1));

        // Return the multiplier as points (will be applied as a percentage)
        return multiplier * heartCount * 100;
    }
} 