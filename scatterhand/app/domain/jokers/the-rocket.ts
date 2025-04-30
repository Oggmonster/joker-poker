import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

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
        const acesCount = holeCards.filter(card => card.rank === Rank.ACE).length
        if (acesCount < 2) return 0

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