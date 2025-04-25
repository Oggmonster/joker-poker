import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../round-state'

/**
 * A legendary joker that gives bonus points for having a pocket Ace
 */
export class AceInTheHole extends BaseJoker {
    private static readonly BASE_BONUS = 50
    private static readonly LEVEL_BONUS = 50

    constructor() {
        super(
            'ace-in-the-hole',
            'Ace in the Hole',
            `${AceInTheHole.BASE_BONUS} points if you have a pocket Ace`,
            JokerRarity.LEGENDARY,
            JokerType.PLAYER
        )
    }

    private hasPocketAce(cards: readonly Card[]): boolean {
        return cards.some(card => card?.rank === Rank.ACE)
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!this.hasPocketAce(holeCards)) return 0

        const bonus = AceInTheHole.BASE_BONUS + 
            (AceInTheHole.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = AceInTheHole.BASE_BONUS + 
            (AceInTheHole.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if you have a pocket Ace`
    }
} 