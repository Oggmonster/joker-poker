import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker'
import { Card, Suit } from '../cards'

/**
 * A joker that gives bonus points for alternating card colors
 */
export class ColorWeaver extends BaseJoker {
    private static readonly BASE_BONUS = 100
    private static readonly LEVEL_BONUS = 100

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
        phase: GamePhase
    }): number {
        // Consider all available cards
        const allCards = playedHand ? [...holeCards, ...playedHand] : holeCards
        
        const alternatingPairs = this.countAlternatingColors(allCards)
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