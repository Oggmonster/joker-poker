import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A joker that gives bonus points for having 10-2 and making two pair
 */
export class TheBrunson extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'the-brunson',
            'The Brunson',
            `${TheBrunson.BASE_BONUS} points if holding 10-2 and make two pair`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }


    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        const has10 = holeCards.some(card => card.rank === Rank.TEN)
        const has2 = holeCards.some(card => card.rank === Rank.TWO)
        if (!has10 || !has2) return 0

        if (!playedHand) return 0

        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.TWO_PAIR) return 0

        const bonus = TheBrunson.BASE_BONUS + 
            (TheBrunson.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = TheBrunson.BASE_BONUS + 
            (TheBrunson.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding 10-2 and make two pair`
    }
} 