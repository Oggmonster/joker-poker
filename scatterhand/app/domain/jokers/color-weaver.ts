import { BaseJoker, JokerRarity } from '../joker'
import { Card, Suit, RANKS_ORDER } from '../cards'

/**
 * A joker that gives bonus points for sequences of alternating card colors
 */
export class ColorWeaver extends BaseJoker {
    private static readonly BASE_BONUS = 200
    private static readonly LEVEL_BONUS = 200

    constructor(id: string) {
        super(
            id,
            'Color Weaver',
            'Bonus points for sequences of alternating red and black cards',
            JokerRarity.RARE
        )
    }

    private isRed(suit: Suit): boolean {
        return suit === Suit.HEARTS || suit === Suit.DIAMONDS
    }

    private findLongestAlternatingSequence(hand: readonly Card[]): number {
        if (hand.length < 2) return 0

        // Sort cards by rank
        const sortedCards = [...hand].sort((a, b) => 
            RANKS_ORDER.indexOf(a.rank) - RANKS_ORDER.indexOf(b.rank)
        )

        let maxLength = 1
        let currentLength = 1
        let lastColor: boolean | null = null
        let gapsAllowed = this.level - 1

        for (let i = 0; i < sortedCards.length - 1; i++) {
            const currentCard = sortedCards[i]!
            const nextCard = sortedCards[i + 1]!
            
            const currentIsRed = this.isRed(currentCard.suit)
            const nextIsRed = this.isRed(nextCard.suit)
            
            const rankDiff = RANKS_ORDER.indexOf(nextCard.rank) - 
                RANKS_ORDER.indexOf(currentCard.rank)

            // Check if colors alternate and ranks are consecutive (or within gap allowance)
            if (currentIsRed !== nextIsRed && 
                (rankDiff === 1 || (rankDiff <= gapsAllowed + 1 && gapsAllowed > 0))) {
                
                if (lastColor === null || currentIsRed !== lastColor) {
                    currentLength++
                    maxLength = Math.max(maxLength, currentLength)
                    if (rankDiff > 1) gapsAllowed--
                } else {
                    currentLength = 2
                    gapsAllowed = this.level - 1
                }
                lastColor = currentIsRed
            } else {
                currentLength = 1
                lastColor = null
                gapsAllowed = this.level - 1
            }
        }

        return maxLength
    }

    applyEffect(hand: readonly Card[]): number {
        const sequenceLength = this.findLongestAlternatingSequence(hand)
        if (sequenceLength < 2) return 0

        const bonus = ColorWeaver.BASE_BONUS + 
            (ColorWeaver.LEVEL_BONUS * (this.level - 1))

        // Exponential bonus for longer sequences
        return bonus * Math.pow(2, sequenceLength - 2)
    }

    getEffectDescription(): string {
        const bonus = ColorWeaver.BASE_BONUS + 
            (ColorWeaver.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for 2 alternating color cards in sequence, doubles for each additional card. Level ${this.level}: Can have ${this.level - 1} gap(s) between cards`
    }
} 