import { Card } from './cards'
import { BaseJoker } from './joker'
import { Player } from './player'

/**
 * Represents the different phases of a round
 */
export enum Phase {
    FLOP = 'FLOP',
    TURN = 'TURN',
    RIVER = 'RIVER',
    COMPLETE = 'COMPLETE'
}

export interface HandSelection {
    cards: Card[];
    jokers: BaseJoker[];
    score: number;
}

export interface PhaseState {
    boardCards: Card[];
    boardJokers: BaseJoker[];
    playerCards: Map<string, Card[]>;
    playerJokers: Map<string, BaseJoker[]>;
    selections: Map<string, HandSelection>;
    phase: Phase;
    accumulatedScores: Map<string, number>;
}

export class CommunityCards {
    private cards: Card[] = []
    private jokers: BaseJoker[] = []

    addCard(card: Card): void {
        this.cards.push(card)
    }

    addJoker(joker: BaseJoker): void {
        this.jokers.push(joker)
    }

    getCards(): readonly Card[] {
        return this.cards
    }

    getJokers(): readonly BaseJoker[] {
        return this.jokers
    }

    clear(): void {
        this.cards = []
        this.jokers = []
    }
}

export interface PlayerAction {
    type: 'DISCARD_CARD' | 'DISCARD_JOKER' | 'SELECT_CARDS' | 'SELECT_JOKERS'
    cardIndices?: number[]  // Indices of cards to discard/select
    jokerIds?: string[]    // IDs of jokers to discard/select
}

/**
 * Manages the state of a poker-style round
 */
export class RoundState {
    private state: PhaseState;

    constructor(
        private readonly players: ReadonlyMap<string, Player>,
        deck: Card[],
        jokerPool: BaseJoker[]
    ) {
        this.state = {
            boardCards: [],
            boardJokers: [],
            playerCards: new Map(),
            playerJokers: new Map(),
            selections: new Map(),
            phase: Phase.FLOP,
            accumulatedScores: new Map()
        };

        // Initialize player cards and jokers
        for (const [playerId, player] of players.entries()) {
            // Initialize empty arrays
            const playerCards: Card[] = [];
            const playerJokers: BaseJoker[] = [];

            // Deal 2 initial cards
            for (let i = 0; i < 2; i++) {
                const card = this.drawCard(deck);
                playerCards.push(card);
            }

            // Deal 1 initial joker
            const joker = this.drawJoker(jokerPool);
            if (joker) {
                playerJokers.push(joker);
            }

            // Store in state
            this.state.playerCards.set(playerId, playerCards);
            this.state.playerJokers.set(playerId, playerJokers);
        }
    }

    public getCurrentPhase(): Phase {
        return this.state.phase;
    }

    public addBoardCards(cards: Card[]): void {
        this.state.boardCards.push(...cards);
    }

    public addBoardJokers(jokers: BaseJoker[]): void {
        this.state.boardJokers.push(...jokers);
    }

    public addPlayerCards(playerId: string, cards: Card[]): void {
        const currentCards = this.state.playerCards.get(playerId) || [];
        this.state.playerCards.set(playerId, [...currentCards, ...cards]);
    }

    public addPlayerJokers(playerId: string, jokers: BaseJoker[]): void {
        const currentJokers = this.state.playerJokers.get(playerId) || [];
        this.state.playerJokers.set(playerId, [...currentJokers, ...jokers]);
    }

    public submitSelection(playerId: string, selection: HandSelection): void {
        if (!this.isValidSelection(selection)) {
            throw new Error('Invalid selection: Must have exactly 5 cards and 3 jokers');
        }

        this.state.selections.set(playerId, selection);
        
        // Add score to accumulated total
        const currentScore = this.state.accumulatedScores.get(playerId) || 0;
        this.state.accumulatedScores.set(playerId, currentScore + selection.score);
    }

    public getPlayerCards(playerId: string): Card[] {
        return [...(this.state.playerCards.get(playerId) || [])];
    }

    public getPlayerJokers(playerId: string): BaseJoker[] {
        return [...(this.state.playerJokers.get(playerId) || [])];
    }

    public getAvailableCards(playerId: string): Card[] {
        const playerCards = this.state.playerCards.get(playerId) || [];
        return [...this.state.boardCards, ...playerCards];
    }

    public getAvailableJokers(playerId: string): BaseJoker[] {
        const playerJokers = this.state.playerJokers.get(playerId) || [];
        return [...this.state.boardJokers, ...playerJokers];
    }

    public getAccumulatedScore(playerId: string): number {
        return this.state.accumulatedScores.get(playerId) || 0;
    }

    public getCurrentSelection(playerId: string): HandSelection | undefined {
        return this.state.selections.get(playerId);
    }

    public advancePhase(): void {
        switch (this.state.phase) {
            case Phase.FLOP:
                this.state.phase = Phase.TURN;
                break;
            case Phase.TURN:
                this.state.phase = Phase.RIVER;
                break;
            case Phase.RIVER:
                this.state.phase = Phase.COMPLETE;
                break;
            default:
                throw new Error('Round is already complete');
        }
        // Clear selections for new phase
        this.state.selections.clear();
    }

    public isComplete(): boolean {
        return this.state.phase === Phase.COMPLETE;
    }

    private isValidSelection(selection: HandSelection): boolean {
        return selection.cards.length === 5 && selection.jokers.length === 3;
    }

    // Helper method to get the expected counts for the current phase
    public getPhaseRequirements(): { boardCards: number; boardJokers: number; playerCards: number; playerJokers: number } {
        switch (this.state.phase) {
            case Phase.FLOP:
                return { boardCards: 3, boardJokers: 3, playerCards: 2, playerJokers: 2 };
            case Phase.TURN:
                return { boardCards: 4, boardJokers: 4, playerCards: 3, playerJokers: 3 };
            case Phase.RIVER:
                return { boardCards: 5, boardJokers: 5, playerCards: 4, playerJokers: 4 };
            default:
                throw new Error('Round is complete');
        }
    }

    /**
     * Draw a card from the deck
     */
    private drawCard(deck: Card[]): Card {
        if (deck.length === 0) {
            throw new Error('No cards left in deck')
        }
        return deck.pop()!
    }

    /**
     * Draw a joker from the pool
     */
    private drawJoker(jokerPool: BaseJoker[]): BaseJoker | undefined {
        if (jokerPool.length === 0) {
            return undefined
        }
        return jokerPool.pop()
    }
} 