import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';

/**
 * A joker that gives bonus points for pocket sevens (7-7)
 */
export class WalkingSticks extends BaseJoker {
    private static readonly BASE_BONUS = 4;
    private static readonly LEVEL_BONUS = 4;

    constructor() {
        super(
            'walking-sticks',
            'Walking Sticks',
            `${WalkingSticks.BASE_BONUS} points for pocket sevens (7-7)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    public calculateBonus({ holeCards, phase }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: GamePhase;
    }): number {
        // Only check hole cards for pocket pairs
        if (holeCards.length !== 2) return 0;

        const [card1, card2] = holeCards;
        if (!card1 || !card2) return 0;

        // Check if both cards are sevens
        const hasSevens = card1.rank === Rank.SEVEN && card2.rank === Rank.SEVEN;
        if (!hasSevens) return 0;

        const bonus = WalkingSticks.BASE_BONUS + 
            (WalkingSticks.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 