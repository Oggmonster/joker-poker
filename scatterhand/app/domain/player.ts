import { Card } from './cards'
import { Joker } from './joker'
/**
 * Represents a player's status in the game
 */
export enum PlayerStatus {
    WAITING = 'WAITING',     // Waiting for next round
    PLAYING = 'PLAYING',     // Currently playing a round
    FOLDED = 'FOLDED',        // Folded current hand
    ELIMINATED = 'ELIMINATED' // Out of the tournament (failed to beat boss blind)
}

/**
 * Represents a player in the game
 */
export class Player {
    private hand: Card[] = []
    private _status: PlayerStatus
    private _position: number
    private _jokers: Joker[] = []
    private _activeJokers: Joker[] = [] // Jokers used in current hand
    private _roundScore: number = 0
    private _isBot: boolean
    private _selectedCards: Card[] = []
    private _selectedJokers: Joker[] = []

    constructor(
        private readonly _id: string,
        private readonly _name: string,
        position: number = -1,
        isBot: boolean = false
    ) {
        this._status = PlayerStatus.WAITING
        this._position = position
        this._isBot = isBot
    }

    /**
     * Get the player's ID
     */
    getId(): string {
        return this._id
    }

    /**
     * Get the player's name
     */
    getName(): string {
        return this._name
    }

    /**
     * Get the player's current status
     */
    getStatus(): PlayerStatus {
        return this._status
    }

    /**
     * Set the player's status
     */
    setStatus(status: PlayerStatus): void {
        this._status = status
    }

    /**
     * Get the player's position at the table
     */
    getPosition(): number {
        return this._position
    }

    /**
     * Set the player's position at the table
     */
    setPosition(position: number): void {
        this._position = position
    }

    /**
     * Check if the player is a bot
     */
    isBot(): boolean {
        return this._isBot
    }

    /**
     * Get all jokers owned by the player
     */
    getJokers(): readonly Joker[] {
        return this._jokers
    }

    /**
     * Add a joker to the player's collection
     */
    addJoker(joker: Joker): void {
        this._jokers.push(joker)
    }

    /**
     * Remove a joker from the player's collection
     */
    removeJoker(jokerId: string): Joker | undefined {
        const index = this._jokers.findIndex(j => j.id === jokerId)
        if (index === -1) return undefined
        return this._jokers.splice(index, 1)[0]
    }

    /**
     * Get jokers active in the current hand
     */
    getActiveJokers(): readonly Joker[] {
        return this._activeJokers
    }

    /**
     * Activate a joker for the current hand
     */
    activateJoker(jokerId: string): boolean {
        const joker = this._jokers.find(j => j.id === jokerId)
        if (!joker) return false
        this._activeJokers.push(joker)
        return true
    }

    /**
     * Clear active jokers at the end of a hand
     */
    clearActiveJokers(): void {
        this._activeJokers = []
    }

    /**
     * Get the player's current hand
     */
    getCards(): readonly Card[] {
        return this.hand
    }

    /**
     * Add a card to the player's hand
     */
    receiveCard(card: Card): void {
        this.hand.push(card)
    }

    /**
     * Clear the player's hand
     */
    clearHand(): void {
        this.hand = []
        this.clearActiveJokers()
        this._roundScore = 0
    }

    /**
     * Get the player's score for the current round
     */
    getRoundScore(): number {
        return this._roundScore
    }

    /**
     * Set the player's score for the current round
     */
    setRoundScore(score: number): void {
        this._roundScore = score
    }

    /**
     * Fold the player's hand
     */
    fold(): void {
        if (this._status === PlayerStatus.PLAYING) {
            this._status = PlayerStatus.FOLDED
        }
    }

    /**
     * Clear selected cards
     */
    clearSelectedCards(): void {
        this._selectedCards = []
    }

    /**
     * Clear selected jokers
     */
    clearSelectedJokers(): void {
        this._selectedJokers = []
    }

    /**
     * Reset the player's state for a new round
     */
    resetForNewRound(): void {
        this.clearHand()
        this.clearSelectedCards()
        this.clearSelectedJokers()
        this.clearActiveJokers()
        this._roundScore = 0
        if (this._status !== PlayerStatus.ELIMINATED) {
            this._status = PlayerStatus.PLAYING
        }
    }

    /**
     * Eliminate player from the tournament (failed to beat boss blind)
     */
    eliminate(): void {
        this._status = PlayerStatus.ELIMINATED
        this.clearHand()
    }

    /**
     * Remove a card from the player's hand at the specified index
     */
    removeCard(index: number): Card {
        if (index < 0 || index >= this.hand.length) {
            throw new Error('Invalid card index')
        }
        const removed = this.hand.splice(index, 1)[0]
        if (!removed) {
            throw new Error('Failed to remove card')
        }
        return removed
    }

    /**
     * Set the player's selected cards for scoring
     */
    setSelectedCards(cards: Card[]): void {
        if (cards.length !== 5) {
            throw new Error('Must select exactly 5 cards')
        }
        this._selectedCards = [...cards]
    }

    /**
     * Set the player's selected jokers for scoring
     */
    setSelectedJokers(jokers: Joker[]): void {
        if (jokers.length > 3) {
            throw new Error('Cannot select more than 3 jokers')
        }
        this._selectedJokers = [...jokers]
    }

    /**
     * Get the player's selected cards
     */
    getSelectedCards(): readonly Card[] {
        return this._selectedCards
    }

    /**
     * Get the player's selected jokers
     */
    getSelectedJokers(): readonly Joker[] {
        return this._selectedJokers
    }

    // Getters
    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get position(): number {
        return this._position
    }

    get roundScore(): number {
        return this._roundScore
    }

    /**
     * Check if the player can still act in the current round
     */
    canAct(): boolean {
        return this._status === PlayerStatus.PLAYING
    }

    /**
     * Check if the player is still in the current hand
     */
    isInHand(): boolean {
        return this._status === PlayerStatus.PLAYING
    }

    /**
     * Check if the player is still in the tournament
     */
    isInTournament(): boolean {
        return this._status !== PlayerStatus.ELIMINATED
    }

    /**
     * Return string representation of the player
     */
    toString(): string {
        return `${this._name} (${this._jokers.length} jokers)`
    }
} 