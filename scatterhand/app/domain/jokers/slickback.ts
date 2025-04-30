import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

/**
 * A joker that gives bonus points for having King-Queen suited
 */
export class Slickback extends BaseJoker {
    private static readonly BASE_BONUS = 7
    private static readonly LEVEL_BONUS = 7

    constructor() {
        super(
            'slickback',
            'Slickback',
            `${Slickback.BASE_BONUS} points if you are holding King and Queen suited`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {

        const sortedCards = [...holeCards].sort((a, b) => a.toNumber() - b.toNumber())

        // Look for King-Queen suited in hole cards
        for (let i = 0; i < sortedCards.length - 1; i++) {
            for (let j = i + 1; j < sortedCards.length; j++) {
                const card1 = sortedCards[i]
                const card2 = sortedCards[j]
                if (!card1 || !card2) continue

                // Check if we have King and Queen of the same suit
                const hasKingQueen = (
                    (card1.rank === Rank.KING && card2.rank === Rank.QUEEN) ||
                    (card1.rank === Rank.QUEEN && card2.rank === Rank.KING)
                )
                const sameSuit = card1.suit === card2.suit

                if (hasKingQueen && sameSuit) {
                    const bonus = Slickback.BASE_BONUS + 
                        (Slickback.LEVEL_BONUS * (this.level - 1))
                    return bonus
                }
            }
        }

        return 0
    }

    getEffectDescription(): string {
        const bonus = Slickback.BASE_BONUS + 
            (Slickback.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if your hole cards are King and Queen suited`
    }
} 