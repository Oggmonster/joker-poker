import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker';
import { Card, Rank, RANKS_ORDER } from '../cards';

/**
 * A joker that gives bonus points for completing a Broadway straight (10-J-Q-K-A)
 */
export class Broadway extends BaseJoker {
    private static readonly BASE_BONUS = 5;
    private static readonly LEVEL_BONUS = 5;
    private static readonly BROADWAY_RANKS = [
        Rank.TEN,
        Rank.JACK,
        Rank.QUEEN,
        Rank.KING,
        Rank.ACE
    ];

    constructor() {
        super(
            'broadway',
            'Broadway',
            `${Broadway.BASE_BONUS} points for completing a Broadway straight (10-J-Q-K-A)`,
            JokerRarity.COMMON,
            JokerType.PLAYER
        );
    }

    private hasBroadwayStraight(cards: readonly Card[]): boolean {
        if (cards.length < 5) return false;

        // Get unique ranks and sort them
        const ranks = [...new Set(cards.map(card => card.rank))]
            .sort((a, b) => 
                RANKS_ORDER.indexOf(a) - RANKS_ORDER.indexOf(b)
            );

        // Check if we have all Broadway ranks
        return Broadway.BROADWAY_RANKS.every(rank => 
            ranks.includes(rank)
        );
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: GamePhase;
    }): number {
        // Need both hole cards and played hand to check for Broadway
        if (!playedHand) return 0;

        // Consider all available cards
        const allCards = [...holeCards, ...playedHand];
        
        // Check for Broadway straight
        if (!this.hasBroadwayStraight(allCards)) return 0;

        const bonus = Broadway.BASE_BONUS + 
            (Broadway.LEVEL_BONUS * (this.level - 1));

        return bonus;
    }
} 