import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../rounds'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A joker that gives bonus points for making a straight with hole cards
 */
export class SneakyStraight extends BaseJoker {
    private static readonly BASE_BONUS = 15
    private static readonly LEVEL_BONUS = 15 

    constructor() {
        super(
            'sneaky-straight',
            'Sneaky Straight',
            `${SneakyStraight.BASE_BONUS} points if your straight is made with hole cards`,
            JokerRarity.RARE,
            JokerType.PLAYER
        )
    }
   
    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        // Need both hole cards and played cards to make a straight
        if (!playedHand) return 0

        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.STRAIGHT) return 0
        
        //check if hole cards are part of played hand
        if (holeCards.some(c => !playedHand.includes(c))) return 0

        const bonus = SneakyStraight.BASE_BONUS + 
            (SneakyStraight.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = SneakyStraight.BASE_BONUS + 
            (SneakyStraight.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if your straight is made with hole cards`
    }
} 