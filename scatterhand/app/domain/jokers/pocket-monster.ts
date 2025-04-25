import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../round-state'

/**
 * A joker that gives bonus points for having any pocket pair
 */
export class PocketMonster extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'pocket-monster',
            'Pocket Monster',
            `${PocketMonster.BASE_BONUS} points if holding any pocket pair`,
            JokerRarity.RARE,
            JokerType.PLAYER
        )
    }

    private hasPocketPair(cards: readonly Card[]): boolean {
        if (cards.length !== 2) return false

        const card1 = cards[0]
        const card2 = cards[1]
        if (!card1 || !card2) return false

        return card1.rank === card2.rank
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!this.hasPocketPair(holeCards)) return 0

        const bonus = PocketMonster.BASE_BONUS + 
            (PocketMonster.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = PocketMonster.BASE_BONUS + 
            (PocketMonster.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if holding any pocket pair`
    }
} 