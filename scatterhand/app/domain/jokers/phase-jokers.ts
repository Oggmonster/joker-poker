import { BaseJoker, JokerRarity, JokerType } from '../joker'
import { Card } from '../cards'
import { Phase } from '../round-state'

/**
 * Base class for phase-based legendary jokers
 */
abstract class PhaseJoker extends BaseJoker {
    protected static readonly BASE_BONUS = 50
    protected static readonly LEVEL_BONUS = 50

    constructor(
        id: string,
        name: string,
        targetPhase: Phase
    ) {
        super(
            id,
            name,
            `${PhaseJoker.BASE_BONUS} points if it's the ${targetPhase.toLowerCase()} phase`,
            JokerRarity.LEGENDARY,
            JokerType.PLAYER
        )
        this.targetPhase = targetPhase
    }

    protected readonly targetPhase: Phase

    public calculateBonus({ phase }: {
        holeCards: readonly Card[]
        playedHand?: readonly Card[]
        phase: Phase
    }): number {
        if (phase !== this.targetPhase) return 0

        const bonus = PhaseJoker.BASE_BONUS + 
            (PhaseJoker.LEVEL_BONUS * (this.level - 1))

        return bonus
    }

    getEffectDescription(): string {
        const bonus = PhaseJoker.BASE_BONUS + 
            (PhaseJoker.LEVEL_BONUS * (this.level - 1))
        return `${bonus} points if it's the ${this.targetPhase.toLowerCase()} phase`
    }
}

/**
 * A legendary joker that gives bonus points during the river phase
 */
export class RiverGod extends PhaseJoker {
    constructor() {
        super('river-god', 'River God', Phase.RIVER)
    }
}

/**
 * A legendary joker that gives bonus points during the turn phase
 */
export class TurnItUp extends PhaseJoker {
    constructor() {
        super('turn-it-up', 'Turn it Up', Phase.TURN)
    }
}

/**
 * A legendary joker that gives bonus points during the flop phase
 */
export class FlipityFlop extends PhaseJoker {
    constructor() {
        super('flipity-flop', 'Flipity Flop', Phase.FLOP)
    }
} 