import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../round-state'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A joker that gives bonus points for making two pairs using both hole cards
 */
export class DoubleTrouble extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'double-trouble',
            'Double Trouble',
            `${DoubleTrouble.BASE_BONUS} points if you make two pairs using both hole cards`,
            JokerRarity.RARE,
            JokerType.PLAYER
        )
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        // Check for two pair
        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.TWO_PAIR) return 0

        // Check if both hole cards were used
        if (holeCards.some(card => !playedHand.includes(card))) return 0

        const bonus = DoubleTrouble.BASE_BONUS + 
            (DoubleTrouble.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = DoubleTrouble.BASE_BONUS + 
            (DoubleTrouble.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if you make two pairs using both hole cards`
    }
} 