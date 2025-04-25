import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

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
        // Check if we have exactly two hole cards
        if (holeCards.length !== 2) return 0

        // Get the two cards
        const card1 = holeCards[0]
        const card2 = holeCards[1]
        if (!card1 || !card2) return 0

        // Check if we have Ace-Queen
        const hasAceQueen = (
            (card1.rank === Rank.ACE && card2.rank === Rank.QUEEN) ||
            (card1.rank === Rank.QUEEN && card2.rank === Rank.ACE)
        )

        if (!hasAceQueen) return 0

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