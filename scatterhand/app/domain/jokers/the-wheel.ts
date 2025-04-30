import { BaseJoker, JokerRarity, JokerType } from '../joker';
import { Card, Rank } from '../cards';
import { Phase } from '../rounds';

/**
 * A joker that gives bonus points for completing a 5-high straight (A-2-3-4-5)
 */
export class TheWheel extends BaseJoker {
    private static readonly BASE_BONUS = 6;
    private static readonly LEVEL_BONUS = 6;
    private static readonly WHEEL_RANKS = [
        Rank.ACE,
        Rank.TWO,
        Rank.THREE,
        Rank.FOUR,
        Rank.FIVE
    ];

    constructor() {
        super(
            'the-wheel',
            'The Wheel',
            `${TheWheel.BASE_BONUS} points for completing a 5-high straight (A-2-3-4-5)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    private hasWheelStraight(cards: readonly Card[]): boolean {
        if (cards.length < 5) return false;

        // Get unique ranks
        const ranks = [...new Set(cards.map(card => card.rank))];

        // Check if we have all wheel ranks
        return TheWheel.WHEEL_RANKS.every(rank => 
            ranks.includes(rank)
        );
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: Phase;
    }): number {
        // Need both hole cards and played hand to check for wheel
        if (!playedHand) return 0;
        
        // Check for wheel straight
        if (!this.hasWheelStraight([...playedHand])) return 0;

        const bonus = TheWheel.BASE_BONUS + 
            (TheWheel.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 