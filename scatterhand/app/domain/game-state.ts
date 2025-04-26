import { Card } from './cards'
import { Deck } from './deck'
import { BaseJoker } from './joker'
import { Player } from './player'


export type PlayerActionType = 'SELECT_CARDS' | 'SELECT_JOKERS'

export interface PlayerAction {
    type: PlayerActionType
    cardIndices?: number[]
    selectedCards?: Card[]
    selectedJokers?: BaseJoker[]
}

export type GamePhase = 'COUNTDOWN' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN';

export interface GameState {
    id: string
    players: Player[]
    sectionActions: PlayerAction[]
    communityCards: Card[]
    communityJokers: BaseJoker[]
    playerCards: Record<string, Card[]>
    playerJokers: Record<string, BaseJoker[]>
    isComplete: boolean
    activeJokers: BaseJoker[]
    currentPlayerId: number
    lastAction: PlayerAction | null
    phase: GamePhase
    selectedJokers: Record<string, BaseJoker[]>
    timeRemaining: number
}

/**
 * Manages game state and handles game logic
 */
export class GameStateManager {
    private state: GameState;
    private deck: Deck;

    constructor(id: string, players: Player[]) {
        this.deck = new Deck();
        this.state = {
            id,
            players,
            sectionActions: [],
            communityCards: [],
            communityJokers: [],
            playerCards: {},
            playerJokers: {},
            isComplete: false,
            activeJokers: [],
            currentPlayerId: 0,
            lastAction: null,
            phase: 'COUNTDOWN',
            selectedJokers: {},
            timeRemaining: 0
        };
    }

    public getState(): GameState {
        return { ...this.state };
    }

    public processAction(action: PlayerAction): void {
        const player = this.state.players[this.state.currentPlayerId];
        if (!player) {
            throw new Error('Invalid player ID');
        }

        switch (action.type) {
            case 'SELECT_CARDS':
                if (!action.selectedCards) {
                    throw new Error('Cards must be specified for selection');
                }
                player.setSelectedCards(action.selectedCards);
                break;
            case 'SELECT_JOKERS':
                if (!action.selectedJokers) {
                    throw new Error('Jokers must be specified for selection');
                }
                player.setSelectedJokers(action.selectedJokers);
                break;
        }

        this.state.lastAction = action;
        this.moveToNextPlayer();
    }


    private moveToNextPlayer(): void {
        this.state.currentPlayerId = (this.state.currentPlayerId + 1) % this.state.players.length;
    }

    /**
     * Save the current game state
     */
    async save(): Promise<void> {
        // For now, save to localStorage
        localStorage.setItem(`game-${this.state.id}`, JSON.stringify(this.state))
    }

    /**
     * Load a game state by ID
     */
    static async load(id: string): Promise<GameStateManager | null> {
        // For now, load from localStorage
        const savedState = localStorage.getItem(`game-${id}`)
        if (!savedState) return null

        try {
            const state = JSON.parse(savedState) as GameState
            const manager = new GameStateManager(state.id, state.players)
            manager.state = state
            return manager
        } catch (error) {
            console.error('Failed to load game state:', error)
            return null
        }
    }
} 