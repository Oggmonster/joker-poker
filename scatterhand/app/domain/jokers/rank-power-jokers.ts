import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank } from '../cards'
import { Phase } from '../rounds'

/**
 * Base class for rank-based community jokers
 */
abstract class RankPowerJoker extends BaseJoker {
    protected static readonly BASE_BONUS = 1
    protected static readonly LEVEL_BONUS = 1

    constructor(
        id: string,
        name: string,
        targetRank: Rank
    ) {
        super(
            id,
            name,
            `${RankPowerJoker.BASE_BONUS} point for each ${targetRank} on the board`,
            JokerRarity.COMMON,
            JokerType.COMMUNITY
        )
        this.targetRank = targetRank
    }

    protected readonly targetRank: Rank

    private countRankCards(cards: readonly Card[]): number {
        return cards.filter(card => card && card.rank === this.targetRank).length
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const rankCount = this.countRankCards(playedHand)
        if (rankCount === 0) return 0

        const bonusPerCard = RankPowerJoker.BASE_BONUS + 
            (RankPowerJoker.LEVEL_BONUS * (this.level - 1))

        return bonusPerCard * rankCount
    }

    getEffectDescription(): string {
        const bonus = RankPowerJoker.BASE_BONUS + 
            (RankPowerJoker.LEVEL_BONUS * (this.level - 1))
        return `${bonus} point for each ${this.targetRank} on the board`
    }
}

/**
 * A community joker that gives bonus points for 2s
 */
export class Rank2Power extends RankPowerJoker {
    constructor() {
        super('rank-2-power', 'Rank 2 Power', Rank.TWO)
    }
}

/**
 * A community joker that gives bonus points for 3s
 */
export class Rank3Power extends RankPowerJoker {
    constructor() {
        super('rank-3-power', 'Rank 3 Power', Rank.THREE)
    }
}

/**
 * A community joker that gives bonus points for 4s
 */
export class Rank4Power extends RankPowerJoker {
    constructor() {
        super('rank-4-power', 'Rank 4 Power', Rank.FOUR)
    }
}

/**
 * A community joker that gives bonus points for 5s
 */
export class Rank5Power extends RankPowerJoker {
    constructor() {
        super('rank-5-power', 'Rank 5 Power', Rank.FIVE)
    }
}

/**
 * A community joker that gives bonus points for 6s
 */
export class Rank6Power extends RankPowerJoker {
    constructor() {
        super('rank-6-power', 'Rank 6 Power', Rank.SIX)
    }
}

/**
 * A community joker that gives bonus points for 7s
 */
export class Rank7Power extends RankPowerJoker {
    constructor() {
        super('rank-7-power', 'Rank 7 Power', Rank.SEVEN)
    }
}

/**
 * A community joker that gives bonus points for 8s
 */
export class Rank8Power extends RankPowerJoker {
    constructor() {
        super('rank-8-power', 'Rank 8 Power', Rank.EIGHT)
    }
}

/**
 * A community joker that gives bonus points for 9s
 */
export class Rank9Power extends RankPowerJoker {
    constructor() {
        super('rank-9-power', 'Rank 9 Power', Rank.NINE)
    }
}

/**
 * A community joker that gives bonus points for 10s
 */
export class Rank10Power extends RankPowerJoker {
    constructor() {
        super('rank-10-power', 'Rank 10 Power', Rank.TEN)
    }
}

/**
 * A community joker that gives bonus points for Jacks
 */
export class RankJPower extends RankPowerJoker {
    constructor() {
        super('rank-j-power', 'Rank J Power', Rank.JACK)
    }
}

/**
 * A community joker that gives bonus points for Queens
 */
export class RankQPower extends RankPowerJoker {
    constructor() {
        super('rank-q-power', 'Rank Q Power', Rank.QUEEN)
    }
}

/**
 * A community joker that gives bonus points for Kings
 */
export class RankKPower extends RankPowerJoker {
    constructor() {
        super('rank-k-power', 'Rank K Power', Rank.KING)
    }
}

/**
 * A community joker that gives bonus points for Aces
 */
export class RankAPower extends RankPowerJoker {
    constructor() {
        super('rank-a-power', 'Rank A Power', Rank.ACE)
    }
} 