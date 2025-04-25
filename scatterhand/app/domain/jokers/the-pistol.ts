import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

/**
 * A joker that gives bonus points for having pocket 9s (99)
 */
export class ThePistol extends BaseJoker {
    private static readonly BASE_BONUS = 6
    private static readonly LEVEL_BONUS = 6

    constructor() {
        super(
            'the-pistol',
            'The Pistol',
            `${ThePistol.BASE_BONUS} points if holding pocket 9s (99)`,
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

        // Get the two cards
        const card1 = holeCards[0]
        const card2 = holeCards[1]
        if (!card1 || !card2) return 0

        // Check if both cards are 9s
        if (card1.rank !== Rank.NINE || card2.rank !== Rank.NINE) return 0

        const bonus = ThePistol.BASE_BONUS + 
            (ThePistol.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = ThePistol.BASE_BONUS + 
            (ThePistol.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding pocket 9s (99)`
    }
} 