import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

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
        const foursCount = holeCards.filter(card => card.rank === Rank.FOUR).length
        if (foursCount < 2) return 0

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