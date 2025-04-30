import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../rounds'

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
        // Need at least 2 cards to check for pocket pairs
        if (cards.length < 2) return false

        const sortedCards = [...cards].sort((a, b) => a.toNumber() - b.toNumber())

        // Check all pairs of cards
        for (let i = 0; i < sortedCards.length - 1; i++) {
            for (let j = i + 1; j < sortedCards.length; j++) {
                const card1 = sortedCards[i]
                const card2 = sortedCards[j]
                if (!card1 || !card2) continue

                if (card1.rank === card2.rank) return true
            }
        }

        return false
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