import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank, Suit } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points when Queen of Spades appears
 */
export class BlackMariah extends BaseJoker {
    private static readonly BASE_BONUS = 3;
    private static readonly LEVEL_BONUS = 3;

    constructor() {
        super(
            'black-mariah',
            'Black Mariah',
            `${BlackMariah.BASE_BONUS} points when Q♠ appears in your hand`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        if (!playedHand) return 0
        
        // Check for Queen of Spades
        const hasQueenSpades = playedHand.some(card => 
            card.rank === Rank.QUEEN && card.suit === Suit.SPADES
        );
        
        if (!hasQueenSpades) return 0;

        const bonus = BlackMariah.BASE_BONUS + 
            (BlackMariah.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 