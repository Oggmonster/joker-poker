import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

/**
 * A joker that gives bonus points for having pocket Aces (AA)
 */
export class TheRocket extends BaseJoker {
    private static readonly BASE_BONUS = 20
    private static readonly LEVEL_BONUS = 20

    constructor() {
        super(
            'the-rocket',
            'The Rocket',
            `${TheRocket.BASE_BONUS} points if holding pocket Aces (AA)`,
            JokerRarity.RARE,
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

        // Check if both cards are Aces
        if (card1.rank !== Rank.ACE || card2.rank !== Rank.ACE) return 0

        const bonus = TheRocket.BASE_BONUS + 
            (TheRocket.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = TheRocket.BASE_BONUS + 
            (TheRocket.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding pocket Aces (AA)`
    }
} 