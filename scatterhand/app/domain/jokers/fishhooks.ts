import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from "../rounds"

/**
 * A joker that gives bonus points for having pocket Jacks (JJ)
 */
export class Fishhooks extends BaseJoker {
    private static readonly BASE_BONUS = 15
    private static readonly LEVEL_BONUS = 15

    constructor() {
        super(
            'fishhooks',
            'Fishhooks',
            `${Fishhooks.BASE_BONUS} points if holding pocket Jacks (JJ)`,
            JokerRarity.RARE,
            JokerType.PLAYER
        )
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        const jacksCount = holeCards.filter(card => card.rank === Rank.JACK).length
        if (jacksCount < 2) return 0

        const bonus = Fishhooks.BASE_BONUS + 
            (Fishhooks.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = Fishhooks.BASE_BONUS + 
            (Fishhooks.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding pocket Jacks (JJ)`
    }
} 