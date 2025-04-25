import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../round-state'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A legendary joker that gives bonus points for having a Royal Flush
 */
export class RoyalFavor extends BaseJoker {
    private static readonly BASE_BONUS = 150
    private static readonly LEVEL_BONUS = 150

    constructor() {
        super(
            'royal-favor',
            'Royal Favor',
            `${RoyalFavor.BASE_BONUS} points if your hand is a Royal Flush`,
            JokerRarity.LEGENDARY,
            JokerType.PLAYER
        )
    }  

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.ROYAL_FLUSH) return 0

        const bonus = RoyalFavor.BASE_BONUS + 
            (RoyalFavor.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = RoyalFavor.BASE_BONUS + 
            (RoyalFavor.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if your hand is a Royal Flush`
    }
} 