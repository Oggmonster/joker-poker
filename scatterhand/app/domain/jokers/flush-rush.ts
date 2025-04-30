import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../rounds'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A joker that gives bonus points for completing a flush with at least one hole card
 */
export class FlushRush extends BaseJoker {
    private static readonly BASE_BONUS = 12
    private static readonly LEVEL_BONUS = 12

    constructor() {
        super(
            'flush-rush',
            'Flush Rush',
            `${FlushRush.BASE_BONUS} points if you complete a flush with at least one hole card`,
            JokerRarity.RARE,
            JokerType.PLAYER
        )
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        // Need both hole cards and played cards to make a flush
        if (!playedHand) return 0

        //check for flush with handevaluator
        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.FLUSH) return 0

        //check if at least one hole card is part of played hand
        if (holeCards.some(card => !playedHand.includes(card))) return 0

        const bonus = FlushRush.BASE_BONUS + 
            (FlushRush.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = FlushRush.BASE_BONUS + 
            (FlushRush.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if you complete a flush with at least one hole card`
    }
} 