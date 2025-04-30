import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../rounds'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * Base class for hand-rank based community jokers
 */
abstract class HandRankJoker extends BaseJoker {
    constructor(
        id: string,
        name: string,
        effect: string,
        protected readonly targetRank: HandRank,
        protected readonly baseBonus: number,
        protected readonly levelBonus: number
    ) {
        super(
            id,
            name,
            effect,
            JokerRarity.COMMON,
            JokerType.COMMUNITY
        )
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== this.targetRank) return 0

        const bonus = this.baseBonus + 
            (this.levelBonus * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = this.baseBonus + 
            (this.levelBonus * (this.level - 1))
        return `${bonus} points for a ${this.targetRank.toLowerCase()}`
    }
}

/**
 * A community joker that gives bonus points for pairs
 */
export class PairUp extends HandRankJoker {
    constructor() {
        super(
            'pair-up',
            'Pair Up',
            '3 points for each pair made',
            HandRank.PAIR,
            3,
            3
        )
    }
}

/**
 * A community joker that gives bonus points for three of a kind
 */
export class TripleThreat extends HandRankJoker {
    constructor() {
        super(
            'triple-threat',
            'Triple Threat',
            '4 points for three of a kind',
            HandRank.THREE_OF_A_KIND,
            4,
            4
        )
    }
}

/**
 * A community joker that gives bonus points for four of a kind
 */
export class QuadsBoost extends HandRankJoker {
    constructor() {
        super(
            'quads-boost',
            'Quads Boost',
            '6 points for four of a kind',
            HandRank.FOUR_OF_A_KIND,
            6,
            6
        )
    }
}

/**
 * A community joker that gives bonus points for flushes
 */
export class FlushBonus extends HandRankJoker {
    constructor() {
        super(
            'flush-bonus',
            'Flush Bonus',
            '4 points for a flush',
            HandRank.FLUSH,
            4,
            4
        )
    }
}

/**
 * A community joker that gives bonus points for straights
 */
export class StraightReward extends HandRankJoker {
    constructor() {
        super(
            'straight-reward',
            'Straight Reward',
            '3 points for a straight',
            HandRank.STRAIGHT,
            3,
            3
        )
    }
}

/**
 * A community joker that gives bonus points for full houses
 */
export class FullHouseFeast extends HandRankJoker {
    constructor() {
        super(
            'full-house-feast',
            'Full House Feast',
            '5 points for a full house',
            HandRank.FULL_HOUSE,
            5,
            5
        )
    }
} 