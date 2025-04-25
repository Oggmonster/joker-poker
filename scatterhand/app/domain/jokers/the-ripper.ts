import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

/**
 * A unique joker that gives bonus points for each jack in your playing hand
 */
export class TheRipper extends BaseJoker {
    private static readonly BASE_BONUS = 50
    private static readonly LEVEL_BONUS = 50

    constructor() {
        super(
            'the-ripper',
            'The Ripper',
            `${TheRipper.BASE_BONUS} points for each jack in your playing hand`,
            JokerRarity.UNIQUE,
            JokerType.PLAYER
        )
    }

    private countJacks(cards: readonly Card[]): number {
        return cards.filter(card => card && card.rank === Rank.JACK).length
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const jackCount = this.countJacks(playedHand)
        if (jackCount === 0) return 0

        const bonusPerJack = TheRipper.BASE_BONUS + 
            (TheRipper.LEVEL_BONUS * (this.level - 1))

        return bonusPerJack * jackCount
    }

    getEffectDescription(): string {
        const bonus = TheRipper.BASE_BONUS + 
            (TheRipper.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for each jack in your playing hand`
    }
} 