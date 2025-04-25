import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../round-state';

/**
 * A joker that gives bonus points for pocket Kings
 */
export class Cowboys extends BaseJoker {
    private static readonly BASE_BONUS = 5;
    private static readonly LEVEL_BONUS = 5;

    constructor() {
        super(
            'cowboys',
            'Cowboys',
            `${Cowboys.BASE_BONUS} points for pocket Kings (KK)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase?: Phase;
    }): number {
        // Only check hole cards for pocket pairs
        if (holeCards.length !== 2) return 0;

        const [card1, card2] = holeCards;
        if (!card1 || !card2) return 0;

        // Check if both cards are Kings
        const hasKings = card1.rank === Rank.KING && card2.rank === Rank.KING;
        if (!hasKings) return 0;

        const bonus = Cowboys.BASE_BONUS + 
            (Cowboys.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 