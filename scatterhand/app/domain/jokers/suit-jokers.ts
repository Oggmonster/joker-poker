import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Suit } from '../cards'
import { Phase } from '../round-state'

/**
 * Base class for suit-based community jokers
 */
abstract class SuitJoker extends BaseJoker {
    protected static readonly BASE_BONUS = 2
    protected static readonly LEVEL_BONUS = 2

    constructor(
        id: string,
        name: string,
        targetSuit: Suit
    ) {
        super(
            id,
            name,
            `${SuitJoker.BASE_BONUS} points for each ${targetSuit.toLowerCase()} card`,
            JokerRarity.COMMON,
            JokerType.COMMUNITY
        )
        this.targetSuit = targetSuit
    }

    protected readonly targetSuit: Suit

    private countSuitCards(cards: readonly Card[]): number {
        return cards.filter(card => card && card.suit === this.targetSuit).length
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const suitCount = this.countSuitCards(playedHand)
        if (suitCount === 0) return 0

        const bonusPerCard = SuitJoker.BASE_BONUS + 
            (SuitJoker.LEVEL_BONUS * (this.level - 1))

        return bonusPerCard * suitCount
    }

    getEffectDescription(): string {
        const bonus = SuitJoker.BASE_BONUS + 
            (SuitJoker.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for each ${this.targetSuit.toLowerCase()} card`
    }
}

/**
 * A community joker that gives bonus points for Diamond cards
 */
export class DiamondDazzle extends SuitJoker {
    constructor() {
        super('diamond-dazzle', 'Diamond Dazzle', Suit.DIAMONDS)
    }
}

/**
 * A community joker that gives bonus points for Heart cards
 */
export class Heartwarming extends SuitJoker {
    constructor() {
        super('heartwarming', 'Heartwarming', Suit.HEARTS)
    }
}

/**
 * A community joker that gives bonus points for Club cards
 */
export class ClubCrawl extends SuitJoker {
    constructor() {
        super('club-crawl', 'Club Crawl', Suit.CLUBS)
    }
}

/**
 * A community joker that gives bonus points for Spade cards
 */
export class SpadeSurge extends SuitJoker {
    constructor() {
        super('spade-surge', 'Spade Surge', Suit.SPADES)
    }
} 