import { BaseJoker, GamePhase, JokerRarity, JokerType } from '../joker'
import { Card, Rank, RANKS_ORDER } from '../cards'

/**
 * A joker that gives bonus points for cards that could form a straight
 */
export class StraightSeeker extends BaseJoker {
    private static readonly BASE_BONUS = 150
    private static readonly LEVEL_BONUS = 150

    constructor() {
        const maxGaps = 1; // Level 1 starts with 1 gap
        super(
            'straight-seeker',
            'Straight Seeker',
            `${StraightSeeker.BASE_BONUS} points for 3 cards that could form a straight, doubles for each additional card. Can fill up to ${maxGaps} gap between cards`,
            JokerRarity.RARE,
            JokerType.PLAYER
        )
    }

    private findLongestPotentialStraight(cards: readonly Card[]): number {
        // Get unique ranks and sort them
        const ranks = [...new Set(cards.map(card => RANKS_ORDER.indexOf(card.rank)))]
            .sort((a, b) => a - b)

        if (ranks.length === 0) return 0

        let maxLength = 1
        let currentLength = 1
        let gapsUsed = 0
        let maxGapsAllowed = this.level - 1
        let startIndex = 0

        // Try each starting position
        while (startIndex < ranks.length) {
            currentLength = 1
            gapsUsed = 0
            let currentIndex = startIndex

            // Try to extend the sequence
            while (currentIndex < ranks.length - 1) {
                const nextRank = ranks[currentIndex + 1]
                const currentRank = ranks[currentIndex]
                if (nextRank === undefined || currentRank === undefined) break

                const gap = nextRank - currentRank
                
                if (gap === 1) {
                    // Consecutive cards
                    currentLength++
                    currentIndex++
                } else if (gap > 1 && gap <= maxGapsAllowed + 1 && gapsUsed < maxGapsAllowed) {
                    // Gap that can be filled with available gaps
                    const gapsNeeded = gap - 1
                    if (gapsUsed + gapsNeeded <= maxGapsAllowed) {
                        currentLength++
                        gapsUsed += gapsNeeded
                        currentIndex++
                    } else {
                        break
                    }
                } else {
                    break
                }
                maxLength = Math.max(maxLength, currentLength)
            }
            startIndex++
        }

        return maxLength
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[];
        playedHand?: readonly Card[];
        phase: GamePhase;
    }): number {
        // Consider all available cards
        const allCards = playedHand ? [...holeCards, ...playedHand] : holeCards;
        
        const longestPotential = this.findLongestPotentialStraight(allCards);
        if (longestPotential < 3) return 0;

        const bonus = StraightSeeker.BASE_BONUS + 
            (StraightSeeker.LEVEL_BONUS * (this.level - 1));

        // Exponential bonus for longer potential straights
        return bonus * Math.pow(2, longestPotential - 3);
    }

    getEffectDescription(): string {
        const bonus = StraightSeeker.BASE_BONUS + 
            (StraightSeeker.LEVEL_BONUS * (this.level - 1))
        const maxGaps = this.level - 1
        return `${bonus} points for 3 cards that could form a straight, doubles for each additional card. Level ${this.level}: Can fill up to ${maxGaps} gap(s) between cards`
    }
} 