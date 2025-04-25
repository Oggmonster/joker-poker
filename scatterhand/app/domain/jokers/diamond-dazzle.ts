import { BaseJoker, GamePhase, JokerRarity } from '../joker';
import { Card, Suit } from '../cards';

export class DiamondDazzle extends BaseJoker {
    private static readonly POINTS_PER_DIAMOND = 2;

    constructor() {
        super(
            'diamond-dazzle',
            'Diamond Dazzle',
            `+${DiamondDazzle.POINTS_PER_DIAMOND} points for each Diamond card in your hand`,
            JokerRarity.COMMON
        );
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: GamePhase;
    }): number {
        // Count diamonds in hole cards
        const diamondsInHole = holeCards.filter(card => card.suit === Suit.DIAMONDS).length;
        
        // Count diamonds in played hand if available
        const diamondsInPlayed = playedHand?.filter(card => card.suit === Suit.DIAMONDS).length ?? 0;
        
        // Calculate total bonus
        return (diamondsInHole + diamondsInPlayed) * DiamondDazzle.POINTS_PER_DIAMOND;
    }
} 