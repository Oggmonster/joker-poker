import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card, Rank, Suit } from '../cards'
import { Phase } from '../rounds'
import { HandEvaluator, HandRank } from '../scoring'

/**
 * A community joker that gives bonus points when the board has two pairs
 */
export class DualThreat extends BaseJoker {
    private static readonly BASE_BONUS = 8
    private static readonly LEVEL_BONUS = 8

    constructor() {
        super(
            'dual-threat',
            'Dual Threat',
            `${DualThreat.BASE_BONUS} points if the board has two pairs`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasTwoPairsOnBoard(cards: readonly Card[]): boolean {
        const result = HandEvaluator.evaluate([...cards])
        return result.handRank === HandRank.TWO_PAIR
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || !this.hasTwoPairsOnBoard(playedHand)) return 0

        const bonus = DualThreat.BASE_BONUS + 
            (DualThreat.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = DualThreat.BASE_BONUS + 
            (DualThreat.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if the board has two pairs`
    }
}

/**
 * A community joker that gives bonus points for flushes when four suited cards are on board
 */
export class FlushLane extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'flush-lane',
            'Flush Lane',
            `${FlushLane.BASE_BONUS} points for flushes if four cards of the same suit are on board`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasFourSuitedCards(cards: readonly Card[]): boolean {
        const suitCounts = new Map<Suit, number>()
        for (const card of cards) {
            if (!card) continue
            const count = (suitCounts.get(card.suit) || 0) + 1
            suitCounts.set(card.suit, count)
            if (count >= 4) return true
        }
        return false
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.FLUSH || !this.hasFourSuitedCards(playedHand)) {
            return 0
        }

        const bonus = FlushLane.BASE_BONUS + 
            (FlushLane.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = FlushLane.BASE_BONUS + 
            (FlushLane.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for flushes if four cards of the same suit are on board`
    }
}

/**
 * A community joker that gives bonus points for full houses when board has two pairs
 */
export class PairedUp extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'paired-up',
            'Paired Up',
            `${PairedUp.BASE_BONUS} points for Full Houses if board has two pairs`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasTwoPairsOnBoard(cards: readonly Card[]): boolean {
        const result = HandEvaluator.evaluate([...cards])
        return result.handRank === HandRank.TWO_PAIR
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.FULL_HOUSE || !this.hasTwoPairsOnBoard(playedHand)) {
            return 0
        }

        const bonus = PairedUp.BASE_BONUS + 
            (PairedUp.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = PairedUp.BASE_BONUS + 
            (PairedUp.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points for Full Houses if board has two pairs`
    }
}

/**
 * A community joker that gives bonus points when the turn card is 6, 7, or 8
 */
export class MiddleMadness extends BaseJoker {
    private static readonly BASE_BONUS = 4
    private static readonly LEVEL_BONUS = 4

    constructor() {
        super(
            'middle-madness',
            'Middle Madness',
            `${MiddleMadness.BASE_BONUS} points if the turn card is 6, 7, or 8`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private isMiddleRank(rank: Rank): boolean {
        return rank === Rank.SIX || rank === Rank.SEVEN || rank === Rank.EIGHT
    }

    public calculateBonus({ phase, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (phase !== Phase.TURN || !playedHand || playedHand.length !== 4) return 0

        const turnCard = playedHand[3]
        if (!turnCard || !this.isMiddleRank(turnCard.rank)) return 0

        const bonus = MiddleMadness.BASE_BONUS + 
            (MiddleMadness.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = MiddleMadness.BASE_BONUS + 
            (MiddleMadness.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if the turn card is 6, 7, or 8`
    }
}

/**
 * A community joker that gives bonus points when three suited cards appear on the flop
 */
export class SuitedSpeed extends BaseJoker {
    private static readonly BASE_BONUS = 6
    private static readonly LEVEL_BONUS = 6

    constructor() {
        super(
            'suited-speed',
            'Suited Speed',
            `${SuitedSpeed.BASE_BONUS} points if three suited cards appear on the flop`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasThreeSuitedOnFlop(cards: readonly Card[]): boolean {
        if (cards.length !== 3) return false

        const firstCard = cards[0]
        if (!firstCard) return false

        return cards.every(card => card && card.suit === firstCard.suit)
    }

    public calculateBonus({ phase, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (phase !== Phase.FLOP || !playedHand || playedHand.length !== 3) return 0

        if (!this.hasThreeSuitedOnFlop(playedHand)) return 0

        const bonus = SuitedSpeed.BASE_BONUS + 
            (SuitedSpeed.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = SuitedSpeed.BASE_BONUS + 
            (SuitedSpeed.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if three suited cards appear on the flop`
    }
}

/**
 * A community joker that gives bonus points for flushes using both hole cards
 */
export class EdgeFlush extends BaseJoker {
    private static readonly BASE_BONUS = 12
    private static readonly LEVEL_BONUS = 12

    constructor() {
        super(
            'edge-flush',
            'Edge Flush',
            `${EdgeFlush.BASE_BONUS} points if the flush uses both hole cards`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private usesHoleCards(playedHand: readonly Card[], holeCards: readonly Card[]): boolean {
        if (!playedHand || !holeCards || holeCards.length !== 2) return false

        const [hole1, hole2] = holeCards
        if (!hole1 || !hole2) return false

        return playedHand.includes(hole1) && playedHand.includes(hole2)
    }

    public calculateBonus({ holeCards, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const result = HandEvaluator.evaluate([...playedHand])
        if (result.handRank !== HandRank.FLUSH || !this.usesHoleCards(playedHand, holeCards)) {
            return 0
        }

        const bonus = EdgeFlush.BASE_BONUS + 
            (EdgeFlush.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = EdgeFlush.BASE_BONUS + 
            (EdgeFlush.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if the flush uses both hole cards`
    }
}

/**
 * A community joker that gives bonus points when all board cards are above 9
 */
export class ClimbingHigh extends BaseJoker {
    private static readonly BASE_BONUS = 5
    private static readonly LEVEL_BONUS = 5

    constructor() {
        super(
            'climbing-high',
            'Climbing High',
            `${ClimbingHigh.BASE_BONUS} points if all board cards are above 9`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private isHighCard(card: Card): boolean {
        return card.rank > Rank.NINE
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || playedHand.length === 0) return 0

        if (!playedHand.every(card => card && this.isHighCard(card))) return 0

        const bonus = ClimbingHigh.BASE_BONUS + 
            (ClimbingHigh.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = ClimbingHigh.BASE_BONUS + 
            (ClimbingHigh.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if all board cards are above 9`
    }
}

/**
 * A community joker that gives bonus points when river pairs the board
 */
export class SplitRiver extends BaseJoker {
    private static readonly BASE_BONUS = 6
    private static readonly LEVEL_BONUS = 6

    constructor() {
        super(
            'split-river',
            'Split River',
            `${SplitRiver.BASE_BONUS} points if river pairs the board`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private riverPairsBoard(cards: readonly Card[]): boolean {
        if (cards.length !== 5) return false

        const riverCard = cards[4]
        if (!riverCard) return false

        return cards.slice(0, 4).some(card => card && card.rank === riverCard.rank)
    }

    public calculateBonus({ phase, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (phase !== Phase.RIVER || !playedHand || !this.riverPairsBoard(playedHand)) return 0

        const bonus = SplitRiver.BASE_BONUS + 
            (SplitRiver.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = SplitRiver.BASE_BONUS + 
            (SplitRiver.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if river pairs the board`
    }
}

/**
 * A community joker that gives bonus points when board shows three of one suit
 */
export class ThreesCompany extends BaseJoker {
    private static readonly BASE_BONUS = 4
    private static readonly LEVEL_BONUS = 4

    constructor() {
        super(
            'threes-company',
            'Three\'s Company',
            `${ThreesCompany.BASE_BONUS} points if board shows three of one suit`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasThreeSameSuit(cards: readonly Card[]): boolean {
        const suitCounts = new Map<Suit, number>()
        for (const card of cards) {
            if (!card) continue
            const count = (suitCounts.get(card.suit) || 0) + 1
            suitCounts.set(card.suit, count)
            if (count >= 3) return true
        }
        return false
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || !this.hasThreeSameSuit(playedHand)) return 0

        const bonus = ThreesCompany.BASE_BONUS + 
            (ThreesCompany.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = ThreesCompany.BASE_BONUS + 
            (ThreesCompany.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if board shows three of one suit`
    }
}

/**
 * A community joker that gives bonus points when board includes both Ace and 2
 */
export class FullRange extends BaseJoker {
    private static readonly BASE_BONUS = 6
    private static readonly LEVEL_BONUS = 6

    constructor() {
        super(
            'full-range',
            'Full Range',
            `${FullRange.BASE_BONUS} points if board includes both Ace and 2`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasAceAndTwo(cards: readonly Card[]): boolean {
        const hasAce = cards.some(card => card && card.rank === Rank.ACE)
        const hasTwo = cards.some(card => card && card.rank === Rank.TWO)
        return hasAce && hasTwo
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || !this.hasAceAndTwo(playedHand)) return 0

        const bonus = FullRange.BASE_BONUS + 
            (FullRange.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = FullRange.BASE_BONUS + 
            (FullRange.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if board includes both Ace and 2`
    }
}

/**
 * A community joker that gives bonus points when 4+ suited cards are on board
 */
export class FloodWarning extends BaseJoker {
    private static readonly BASE_BONUS = 8
    private static readonly LEVEL_BONUS = 8

    constructor() {
        super(
            'flood-warning',
            'Flood Warning',
            `${FloodWarning.BASE_BONUS} points if 4+ suited cards on board`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasFourPlusSuited(cards: readonly Card[]): boolean {
        const suitCounts = new Map<Suit, number>()
        for (const card of cards) {
            if (!card) continue
            const count = (suitCounts.get(card.suit) || 0) + 1
            suitCounts.set(card.suit, count)
            if (count >= 4) return true
        }
        return false
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || !this.hasFourPlusSuited(playedHand)) return 0

        const bonus = FloodWarning.BASE_BONUS + 
            (FloodWarning.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = FloodWarning.BASE_BONUS + 
            (FloodWarning.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if 4+ suited cards on board`
    }
}

/**
 * A community joker that gives bonus points when three or more of the same rank appear
 */
export class Boardquake extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'boardquake',
            'Boardquake',
            `${Boardquake.BASE_BONUS} points if three or more of the same rank appear`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasThreeSameRank(cards: readonly Card[]): boolean {
        const rankCounts = new Map<Rank, number>()
        for (const card of cards) {
            if (!card) continue
            const count = (rankCounts.get(card.rank) || 0) + 1
            rankCounts.set(card.rank, count)
            if (count >= 3) return true
        }
        return false
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || !this.hasThreeSameRank(playedHand)) return 0

        const bonus = Boardquake.BASE_BONUS + 
            (Boardquake.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = Boardquake.BASE_BONUS + 
            (Boardquake.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if three or more of the same rank appear`
    }
}

/**
 * A community joker that gives bonus points when board is rainbow and unpaired
 */
export class TrapSet extends BaseJoker {
    private static readonly BASE_BONUS = 4
    private static readonly LEVEL_BONUS = 4

    constructor() {
        super(
            'trap-set',
            'Trap Set',
            `${TrapSet.BASE_BONUS} points if board is rainbow and unpaired`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private isRainbowAndUnpaired(cards: readonly Card[]): boolean {
        const suits = new Set<Suit>()
        const ranks = new Set<Rank>()

        for (const card of cards) {
            if (!card) continue
            if (suits.has(card.suit) || ranks.has(card.rank)) return false
            suits.add(card.suit)
            ranks.add(card.rank)
        }

        return true
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || !this.isRainbowAndUnpaired(playedHand)) return 0

        const bonus = TrapSet.BASE_BONUS + 
            (TrapSet.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = TrapSet.BASE_BONUS + 
            (TrapSet.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if board is rainbow and unpaired`
    }
}

/**
 * A community joker that gives bonus points when board contains J, Q, K, A
 */
export class RoyalSetup extends BaseJoker {
    private static readonly BASE_BONUS = 8
    private static readonly LEVEL_BONUS = 8

    constructor() {
        super(
            'royal-setup',
            'Royal Setup',
            `${RoyalSetup.BASE_BONUS} points if board contains J, Q, K, A`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private hasRoyalSetup(cards: readonly Card[]): boolean {
        const hasJack = cards.some(card => card && card.rank === Rank.JACK)
        const hasQueen = cards.some(card => card && card.rank === Rank.QUEEN)
        const hasKing = cards.some(card => card && card.rank === Rank.KING)
        const hasAce = cards.some(card => card && card.rank === Rank.ACE)

        return hasJack && hasQueen && hasKing && hasAce
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || !this.hasRoyalSetup(playedHand)) return 0

        const bonus = RoyalSetup.BASE_BONUS + 
            (RoyalSetup.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = RoyalSetup.BASE_BONUS + 
            (RoyalSetup.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if board contains J, Q, K, A`
    }
}

/**
 * A community joker that gives bonus points when all community cards are face cards
 */
export class HighSociety extends BaseJoker {
    private static readonly BASE_BONUS = 10
    private static readonly LEVEL_BONUS = 10

    constructor() {
        super(
            'high-society',
            'High Society',
            `${HighSociety.BASE_BONUS} points if all community cards are face cards`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private isFaceCard(card: Card): boolean {
        return card.rank === Rank.JACK || 
               card.rank === Rank.QUEEN || 
               card.rank === Rank.KING
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand || playedHand.length === 0) return 0

        if (!playedHand.every(card => card && this.isFaceCard(card))) return 0

        const bonus = HighSociety.BASE_BONUS + 
            (HighSociety.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = HighSociety.BASE_BONUS + 
            (HighSociety.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if all community cards are face cards`
    }
}

/**
 * A community joker that gives bonus points when board contains 3+ cards under 6
 */
export class LowLadder extends BaseJoker {
    private static readonly BASE_BONUS = 6
    private static readonly LEVEL_BONUS = 6

    constructor() {
        super(
            'low-ladder',
            'Low Ladder',
            `${LowLadder.BASE_BONUS} points if board contains 3+ cards under 6`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private isUnderSix(card: Card): boolean {
        return card.rank < Rank.SIX
    }

    private countLowCards(cards: readonly Card[]): number {
        return cards.filter(card => card && this.isUnderSix(card)).length
    }

    public calculateBonus({ playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (!playedHand) return 0

        const lowCount = this.countLowCards(playedHand)
        if (lowCount < 3) return 0

        const bonus = LowLadder.BASE_BONUS + 
            (LowLadder.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = LowLadder.BASE_BONUS + 
            (LowLadder.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if board contains 3+ cards under 6`
    }
}

/**
 * A community joker that gives bonus points for hands using all 3 flop cards when flop is rainbow
 */
export class FrozenFlop extends BaseJoker {
    private static readonly BASE_BONUS = 3
    private static readonly LEVEL_BONUS = 3

    constructor() {
        super(
            'frozen-flop',
            'Frozen Flop',
            `${FrozenFlop.BASE_BONUS} points if flop is rainbow and hand uses all 3 cards`,
            JokerRarity.UNCOMMON,
            JokerType.COMMUNITY
        )
    }

    private isRainbowFlop(cards: readonly Card[]): boolean {
        if (cards.length !== 3) return false

        const suits = new Set<Suit>()
        for (const card of cards) {
            if (!card) return false
            if (suits.has(card.suit)) return false
            suits.add(card.suit)
        }

        return suits.size === 3
    }

    private usesAllFlopCards(playedHand: readonly Card[], flopCards: readonly Card[]): boolean {
        return flopCards.every(flopCard => 
            flopCard && playedHand.some(card => card && card.rank === flopCard.rank && card.suit === flopCard.suit)
        )
    }

    public calculateBonus({ phase, playedHand }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (phase !== Phase.FLOP || !playedHand || playedHand.length !== 3) return 0

        if (!this.isRainbowFlop(playedHand) || !this.usesAllFlopCards(playedHand, playedHand)) return 0

        const bonus = FrozenFlop.BASE_BONUS + 
            (FrozenFlop.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = FrozenFlop.BASE_BONUS + 
            (FrozenFlop.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if flop is rainbow and hand uses all 3 cards`
    }
} 