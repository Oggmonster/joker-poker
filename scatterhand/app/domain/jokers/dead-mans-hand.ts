import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank, Suit } from '../cards';
import { Phase } from '../round-state';


/**
 * A joker that gives bonus points for having Ace of Spades and Eight of Spades
 */
export class DeadMansHand extends BaseJoker {
    private static readonly BASE_BONUS = 6;
    private static readonly LEVEL_BONUS = 6;

    constructor() {
        super(
            'dead-mans-hand',
            'Dead Man\'s Hand',
            `${DeadMansHand.BASE_BONUS} points for having A♠ and 8♠`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        // Only check hole cards
        if (holeCards.length !== 2) return 0;

        const [card1, card2] = holeCards;
        if (!card1 || !card2) return 0;

        // Check for Ace of Spades and Eight of Spades in any order
        const hasAceSpades = (
            (card1.rank === Rank.ACE && card1.suit === Suit.SPADES) ||
            (card2.rank === Rank.ACE && card2.suit === Suit.SPADES)
        );
        
        const hasEightSpades = (
            (card1.rank === Rank.EIGHT && card1.suit === Suit.SPADES) ||
            (card2.rank === Rank.EIGHT && card2.suit === Suit.SPADES)
        );
        
        if (!hasAceSpades || !hasEightSpades) return 0;

        const bonus = DeadMansHand.BASE_BONUS + 
            (DeadMansHand.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 