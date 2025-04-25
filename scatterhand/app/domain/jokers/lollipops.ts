import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../round-state';

/**
 * A joker that gives bonus points for pocket nines (9-9)
 */
export class Lollipops extends BaseJoker {
    private static readonly BASE_BONUS = 4;
    private static readonly LEVEL_BONUS = 4;

    constructor() {
        super(
            'lollipops',
            'Lollipops',
            `${Lollipops.BASE_BONUS} points for pocket nines (9-9)`,
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

        // Check if both cards are nines
        const hasNines = card1.rank === Rank.NINE && card2.rank === Rank.NINE;
        if (!hasNines) return 0;

        const bonus = Lollipops.BASE_BONUS + 
            (Lollipops.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 