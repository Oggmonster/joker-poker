import { Card } from './cards'
import { Deck } from './deck'
import { BaseJoker } from './joker'
import { Player, PlayerStatus } from './player'
import { RoundPhase } from './round-state'

export type GameSection = 'DISCARD' | 'SCORING'

export type PlayerActionType = 'DISCARD' | 'SELECT_CARDS' | 'SELECT_JOKERS'

export interface PlayerAction {
    type: PlayerActionType
    cardIndices?: number[]
    selectedCards?: Card[]
    selectedJokers?: BaseJoker[]
}

export interface GameState {
    id: string
    players: Player[]
    currentSection: GameSection
    sectionActions: PlayerAction[]
    communityCards: Card[]
    communityJokers: BaseJoker[]
    playerCards: Record<string, Card[]>
    isComplete: boolean
    activeJokers: BaseJoker[]
    currentPlayerId: number
    lastAction: PlayerAction | null
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
            currentSection: 'DISCARD',
            sectionActions: [],
            communityCards: [],
            communityJokers: [],
            playerCards: {},
            isComplete: false,
            activeJokers: [],
            currentPlayerId: 0,
            lastAction: null
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
            case 'DISCARD':
                if (!action.cardIndices) {
                    throw new Error('Card indices must be specified for discard');
                }
                this.handleDiscard(player, action.cardIndices);
                break;
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

    private handleDiscard(player: Player, cardIndices: number[]): void {
        if (this.state.currentSection !== 'DISCARD') {
            throw new Error('Can only discard during discard phase');
        }
        // Remove cards at specified indices from player's hand
        cardIndices.sort((a, b) => b - a); // Sort in descending order to remove from end first
        cardIndices.forEach(index => {
            player.removeFromHand(index);
        });
        // Draw new cards to replace discarded ones
        for (let i = 0; i < cardIndices.length; i++) {
            const newCard = this.deck.drawCard();
            player.addToHand(newCard);
        }
    }

    private moveToNextPlayer(): void {
        this.state.currentPlayerId = (this.state.currentPlayerId + 1) % this.state.players.length;
    }

    public moveToNextSection(): void {
        if (this.state.currentSection === 'DISCARD') {
            this.state.currentSection = 'SCORING';
        } else {
            this.state.isComplete = true;
        }
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