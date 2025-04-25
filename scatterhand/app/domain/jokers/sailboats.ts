import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

/**
 * A joker that gives bonus points for having pocket 4s (44)
 */
export class Sailboats extends BaseJoker {
    private static readonly BASE_BONUS = 5
    private static readonly LEVEL_BONUS = 5

    constructor() {
        super(
            'sailboats',
            'Sailboats',
            `${Sailboats.BASE_BONUS} points if holding pocket 4s (44)`,
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

        // Check if both cards are 4s
        if (card1.rank !== Rank.FOUR || card2.rank !== Rank.FOUR) return 0

        const bonus = Sailboats.BASE_BONUS + 
            (Sailboats.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = Sailboats.BASE_BONUS + 
            (Sailboats.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding pocket 4s (44)`
    }
} 