import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

/**
 * A joker that gives bonus points for having Ace-Queen
 */
export class BigChick extends BaseJoker {
    private static readonly BASE_BONUS = 6
    private static readonly LEVEL_BONUS = 6

    constructor() {
        super(
            'big-chick',
            'Big Chick',
            `${BigChick.BASE_BONUS} points if holding Ace-Queen`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase?: Phase
    }): number {
        const hasAce = holeCards.some(card => card.rank === Rank.ACE)
        const hasQueen = holeCards.some(card => card.rank === Rank.QUEEN)
        if (!hasAce || !hasQueen) return 0

        const bonus = BigChick.BASE_BONUS + 
            (BigChick.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = BigChick.BASE_BONUS + 
            (BigChick.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding Ace-Queen`
    }
} 