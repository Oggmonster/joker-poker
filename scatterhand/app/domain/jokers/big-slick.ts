import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Phase } from '../rounds';
import { Card, Rank } from '../cards';

/**
 * A joker that gives bonus points for Ace-King in your hole cards
 */
export class BigSlick extends BaseJoker {
    private static readonly BASE_BONUS = 5;
    private static readonly LEVEL_BONUS = 5;

    constructor() {
        super(
            'big-slick',
            'Big Slick',
            `${BigSlick.BASE_BONUS} points if holding Ace-King`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        const hasAce = holeCards.some(card => card.rank === Rank.ACE)
        const hasKing = holeCards.some(card => card.rank === Rank.KING)
        if (!hasAce || !hasKing) return 0


        const bonus = BigSlick.BASE_BONUS + 
            (BigSlick.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 