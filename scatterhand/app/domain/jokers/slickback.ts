import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

/**
 * A joker that gives bonus points for having King-Queen suited
 */
export class Slickback extends BaseJoker {
    private static readonly BASE_BONUS = 7
    private static readonly LEVEL_BONUS = 7

    constructor() {
        super(
            'slickback',
            'Slickback',
            `${Slickback.BASE_BONUS} points if your hole cards are King and Queen suited`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        // Check if we have exactly two hole cards
        if (holeCards.length !== 2) return 0

        // Safely get the two cards
        const card1 = holeCards[0]
        const card2 = holeCards[1]
        if (!card1 || !card2) return 0

        // Check if we have King and Queen of the same suit
        const hasKingQueen = (
            (card1.rank === Rank.KING && card2.rank === Rank.QUEEN) ||
            (card1.rank === Rank.QUEEN && card2.rank === Rank.KING)
        )
        const sameSuit = card1.suit === card2.suit

        if (!hasKingQueen || !sameSuit) return 0

        const bonus = Slickback.BASE_BONUS + 
            (Slickback.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = Slickback.BASE_BONUS + 
            (Slickback.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if your hole cards are King and Queen suited`
    }
} 