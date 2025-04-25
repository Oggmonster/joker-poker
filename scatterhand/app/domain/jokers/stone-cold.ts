import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';

/**
 * A joker that gives bonus points for having 7-4
 */
export class StoneCold extends BaseJoker {
    private static readonly BASE_BONUS = 3;
    private static readonly LEVEL_BONUS = 3;

    constructor() {
        super(
            'stone-cold',
            'Stone Cold',
            `${StoneCold.BASE_BONUS} points for having 7-4`,
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

        // Check if cards are 7 and 4 in any order
        const has74 = (
            (card1.rank === Rank.SEVEN && card2.rank === Rank.FOUR) ||
            (card1.rank === Rank.FOUR && card2.rank === Rank.SEVEN)
        );
        
        if (!has74) return 0;

        const bonus = StoneCold.BASE_BONUS + 
            (StoneCold.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 