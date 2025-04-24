import { Card } from './cards'
import { Joker } from './joker'
import { Player } from './player'

/**
 * Represents the different phases of a round
 */
export enum RoundPhase {
    DISCARD = 'DISCARD',
    SCORING = 'SCORING'
}

export class CommunityCards {
    private cards: Card[] = []
    private jokers: Joker[] = []

    addCard(card: Card): void {
        this.cards.push(card)
    }

    addJoker(joker: Joker): void {
        this.jokers.push(joker)
    }

    getCards(): readonly Card[] {
        return this.cards
    }

    getJokers(): readonly Joker[] {
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
    private phase: RoundPhase
    private community: CommunityCards
    private deck: Card[]
    private jokerPool: Joker[]
    private playerActions: Map<string, PlayerAction[]>

    constructor(
        private readonly players: ReadonlyMap<string, Player>,
        deck: Card[],
        jokerPool: Joker[]
    ) {
        this.phase = RoundPhase.DISCARD
        this.community = new CommunityCards()
        this.deck = [...deck]
        this.jokerPool = [...jokerPool]
        this.playerActions = new Map()

        // Initialize player actions array for each player
        for (const playerId of players.keys()) {
            this.playerActions.set(playerId, [])
        }
    }

    /**
     * Start the pre-flop phase
     */
    startPreFlop(): void {
        if (this.phase !== RoundPhase.DISCARD) {
            throw new Error('Invalid phase transition')
        }

        // Deal 2 cards and 1 joker to each player
        for (const player of this.players.values()) {
            // Deal cards
            for (let i = 0; i < 2; i++) {
                const card = this.drawCard()
                player.addToHand(card)
            }

            // Deal joker
            const joker = this.drawJoker()
            if (joker) {
                player.addJoker(joker)
            }
        }
    }

    /**
     * Start the flop phase
     */
    startFlop(): void {
        if (this.phase !== RoundPhase.DISCARD) {
            throw new Error('Invalid phase transition')
        }

        // Deal 3 community cards
        for (let i = 0; i < 3; i++) {
            this.community.addCard(this.drawCard())
        }

        // Add 1 community joker
        const joker = this.drawJoker()
        if (joker) {
            this.community.addJoker(joker)
        }

        // Deal jokers to players until they have 2
        for (const player of this.players.values()) {
            while (player.getJokers().length < 2) {
                const joker = this.drawJoker()
                if (joker) {
                    player.addJoker(joker)
                }
            }
        }

        this.phase = RoundPhase.SCORING
    }

    /**
     * Start the turn phase
     */
    startTurn(): void {
        if (this.phase !== RoundPhase.SCORING) {
            throw new Error('Invalid phase transition')
        }

        // Deal 1 community card
        this.community.addCard(this.drawCard())

        // Add 1 community joker
        const joker = this.drawJoker()
        if (joker) {
            this.community.addJoker(joker)
        }

        // Deal jokers to players until they have 3
        for (const player of this.players.values()) {
            while (player.getJokers().length < 3) {
                const joker = this.drawJoker()
                if (joker) {
                    player.addJoker(joker)
                }
            }
        }

        this.phase = RoundPhase.SCORING
    }

    /**
     * Start the river phase
     */
    startRiver(): void {
        if (this.phase !== RoundPhase.SCORING) {
            throw new Error('Invalid phase transition')
        }

        // Deal 1 community card
        this.community.addCard(this.drawCard())

        // Add 1 community joker
        const joker = this.drawJoker()
        if (joker) {
            this.community.addJoker(joker)
        }

        this.phase = RoundPhase.SCORING
    }

    /**
     * Start the scoring phase
     */
    startScoring(): void {
        if (this.phase !== RoundPhase.SCORING) {
            throw new Error('Invalid phase transition')
        }
        this.phase = RoundPhase.SCORING
    }

    /**
     * Process a player's action
     */
    processPlayerAction(playerId: string, action: PlayerAction): boolean {
        const player = this.players.get(playerId)
        if (!player) return false

        switch (action.type) {
            case 'DISCARD_CARD': {
                if (!action.cardIndices || this.phase !== RoundPhase.DISCARD) {
                    return false
                }
                
                // Sort indices in descending order to avoid shifting issues
                const sortedIndices = [...action.cardIndices].sort((a, b) => b - a)
                const playerCards = player.getCards()
                
                // Validate indices
                if (sortedIndices.some(i => i < 0 || i >= playerCards.length)) {
                    return false
                }

                // Remove cards from player's hand
                for (const index of sortedIndices) {
                    const discardedCard = playerCards[index]
                    player.removeFromHand(index)
                    // Deal a new card to replace the discarded one
                    const newCard = this.drawCard()
                    player.addToHand(newCard)
                }
                break
            }
            case 'DISCARD_JOKER': {
                if (!action.jokerIds || this.phase !== RoundPhase.DISCARD) {
                    return false
                }

                const playerJokers = player.getJokers()
                const jokerSet = new Set(action.jokerIds)

                // Validate joker IDs
                if (action.jokerIds.some(id => !playerJokers.some(j => j.id === id))) {
                    return false
                }

                // Remove jokers from player's hand
                for (const jokerId of action.jokerIds) {
                    player.removeJoker(jokerId)
                    // Deal a new joker to replace the discarded one
                    const newJoker = this.drawJoker()
                    if (newJoker) {
                        player.addJoker(newJoker)
                    }
                }
                break
            }
            case 'SELECT_CARDS': {
                if (!action.cardIndices || this.phase !== RoundPhase.SCORING) {
                    return false
                }
                if (action.cardIndices.length !== 5) {
                    return false
                }

                const availableCards = [
                    ...player.getCards(),
                    ...this.community.getCards()
                ]

                // Validate indices and ensure no duplicates
                const uniqueIndices = new Set(action.cardIndices)
                if (uniqueIndices.size !== 5 || 
                    action.cardIndices.some(i => i < 0 || i >= availableCards.length)) {
                    return false
                }

                // Store selected cards in player state
                const selectedCards = action.cardIndices.map(i => availableCards[i])
                if (selectedCards.some(card => !card)) {
                    return false
                }
                player.setSelectedCards(selectedCards as Card[])
                break
            }
            case 'SELECT_JOKERS': {
                if (!action.jokerIds || this.phase !== RoundPhase.SCORING) {
                    return false
                }
                if (action.jokerIds.length > 3) {
                    return false
                }

                const availableJokers = [
                    ...player.getJokers(),
                    ...this.community.getJokers()
                ]

                // Validate joker IDs and ensure no duplicates
                const uniqueJokerIds = new Set(action.jokerIds)
                if (uniqueJokerIds.size !== action.jokerIds.length ||
                    action.jokerIds.some(id => !availableJokers.some(j => j.id === id))) {
                    return false
                }

                // Store selected jokers in player state
                const selectedJokers = action.jokerIds.map(id => 
                    availableJokers.find(j => j.id === id)!
                )
                player.setSelectedJokers(selectedJokers)
                break
            }
        }

        this.playerActions.get(playerId)?.push(action)
        return true
    }

    /**
     * Draw a card from the deck
     */
    private drawCard(): Card {
        if (this.deck.length === 0) {
            throw new Error('No cards left in deck')
        }
        return this.deck.pop()!
    }

    /**
     * Draw a joker from the pool
     */
    private drawJoker(): Joker | undefined {
        if (this.jokerPool.length === 0) {
            return undefined
        }
        return this.jokerPool.pop()
    }

    /**
     * Get the current phase
     */
    getPhase(): RoundPhase {
        return this.phase
    }

    /**
     * Get the community cards and jokers
     */
    getCommunityCards(): CommunityCards {
        return this.community
    }

    /**
     * Get all actions taken by a player
     */
    getPlayerActions(playerId: string): readonly PlayerAction[] {
        return this.playerActions.get(playerId) || []
    }
} 