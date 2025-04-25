import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Phase } from '../round-state';
import { Card, Rank } from '../cards';

/**
 * A joker that gives bonus points for Ace-King (suited or not)
 */
export class BigSlick extends BaseJoker {
    private static readonly BASE_BONUS = 5;
    private static readonly LEVEL_BONUS = 5;

    constructor() {
        super(
            'big-slick',
            'Big Slick',
            `${BigSlick.BASE_BONUS} points for Ace-King (suited or not)`,
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

        // Check if cards are Ace and King in any order
        const hasAceKing = (
            (card1.rank === Rank.ACE && card2.rank === Rank.KING) ||
            (card1.rank === Rank.KING && card2.rank === Rank.ACE)
        );
        
        if (!hasAceKing) return 0;

        const bonus = BigSlick.BASE_BONUS + 
            (BigSlick.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 