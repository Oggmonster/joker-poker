import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';

/**
 * A joker that gives bonus points for having pocket Aces
 */
export class Eagles extends BaseJoker {
    private static readonly BASE_BONUS = 8;
    private static readonly LEVEL_BONUS = 8;

    constructor() {
        super(
            'eagles',
            'Eagles',
            `${Eagles.BASE_BONUS} points for having pocket Aces`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards, phase }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: GamePhase;
    }): number {
        // Only check hole cards
        if (holeCards.length !== 2) return 0;

        const [card1, card2] = holeCards;
        if (!card1 || !card2) return 0;

        // Check for pocket Aces
        if (card1.rank !== Rank.ACE || card2.rank !== Rank.ACE) return 0;

        const bonus = Eagles.BASE_BONUS + 
            (Eagles.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 