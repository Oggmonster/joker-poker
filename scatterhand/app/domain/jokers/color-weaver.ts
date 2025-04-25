import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Suit } from '../cards'
import { Phase } from '../round-state';

/**
 * A joker that gives bonus points for alternating card colors
 */
export class ColorWeaver extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 5

    constructor() {
        super(
            'color-weaver',
            'Color Weaver',
            `${ColorWeaver.BASE_BONUS} points for each pair of alternating card colors`,
            JokerRarity.UNCOMMON,
            JokerType.PLAYER
        )
    }

    private isRedSuit(suit: Suit): boolean {
        return suit === Suit.HEARTS || suit === Suit.DIAMONDS
    }

    private countAlternatingColors(cards: readonly Card[]): number {
        if (cards.length < 2) return 0

        let alternatingPairs = 0
        
        // Check each adjacent pair of cards
        for (let i = 0; i < cards.length - 1; i++) {
            const currentCard = cards[i]!
            const nextCard = cards[i + 1]!
            
            // If current is red and next is black (or vice versa)
            if (this.isRedSuit(currentCard.suit) !== this.isRedSuit(nextCard.suit)) {
                alternatingPairs++
            }
        }

        return alternatingPairs
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0
        
        const alternatingPairs = this.countAlternatingColors([...playedHand])
        if (alternatingPairs === 0) return 0

        const bonus = ColorWeaver.BASE_BONUS + 
            (ColorWeaver.LEVEL_BONUS * (this.level - 1))

        return bonus * alternatingPairs
    }

    getEffectDescription(): string {
        const bonus = ColorWeaver.BASE_BONUS + 
            (ColorWeaver.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for each pair of alternating card colors. Level ${this.level}: Can have ${this.level - 1} gap(s) between cards`
    }
} 