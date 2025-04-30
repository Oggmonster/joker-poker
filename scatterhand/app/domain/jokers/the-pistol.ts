import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

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
       const nineCount = holeCards.filter(card => card.rank === Rank.NINE).length
       if (nineCount < 2) return 0

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