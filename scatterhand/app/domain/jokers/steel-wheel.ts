import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A joker that gives bonus points for hitting a straight flush A-2-3-4-5
 */
export class SteelWheel extends BaseJoker {
    private static readonly BASE_BONUS = 75
    private static readonly LEVEL_BONUS = 75

    constructor() {
        super(
            'steel-wheel',
            'Steel Wheel',
            `${SteelWheel.BASE_BONUS} points if you hit a straight flush A-2-3-4-5`,
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

        // Check for straight flush
        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.STRAIGHT_FLUSH) return 0

        //use card rank to check for A-2-3-4-5
        if (playedHand.some(card => card.rank !== Rank.ACE && card.rank !== Rank.TWO && card.rank !== Rank.THREE && card.rank !== Rank.FOUR && card.rank !== Rank.FIVE)) return 0

        const bonus = SteelWheel.BASE_BONUS + 
            (SteelWheel.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = SteelWheel.BASE_BONUS + 
            (SteelWheel.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if you hit a straight flush A-2-3-4-5`
    }
} 