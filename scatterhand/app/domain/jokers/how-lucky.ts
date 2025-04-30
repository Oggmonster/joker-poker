import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

/**
 * A unique joker that gives bonus points for each 7 in your playing hand
 */
export class HowLucky extends BaseJoker {
    private static readonly BASE_BONUS = 77
    private static readonly LEVEL_BONUS = 77

    constructor() {
        super(
            'how-lucky',
            'How Lucky',
            `${HowLucky.BASE_BONUS} points for each 7 in your playing hand`,
            JokerRarity.UNIQUE,
            JokerType.PLAYER
        )
    }

    private countSevens(cards: readonly Card[]): number {
        return cards.filter(card => card && card.rank === Rank.SEVEN).length
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const sevenCount = this.countSevens(playedHand)
        if (sevenCount === 0) return 0

        const bonusPerSeven = HowLucky.BASE_BONUS + 
            (HowLucky.LEVEL_BONUS * (this.level - 1))

        return bonusPerSeven * sevenCount
    }

    getEffectDescription(): string {
        const bonus = HowLucky.BASE_BONUS + 
            (HowLucky.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for each 7 in your playing hand`
    }
} 