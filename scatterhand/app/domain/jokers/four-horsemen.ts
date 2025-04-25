import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../round-state'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A joker that gives bonus points for making Four of a Kind
 */
export class FourHorsemen extends BaseJoker {
    private static readonly BASE_BONUS = 25
    private static readonly LEVEL_BONUS = 25

    constructor() {
        super(
            'four-horsemen',
            'Four Horsemen',
            `${FourHorsemen.BASE_BONUS} points if you make Four of a Kind`,
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

        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.FOUR_OF_A_KIND) return 0

        const bonus = FourHorsemen.BASE_BONUS + 
            (FourHorsemen.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = FourHorsemen.BASE_BONUS + 
            (FourHorsemen.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if you make Four of a Kind`
    }
} 