/**
 * Represents a player's status in the game
 */
export enum PlayerStatus {
    WAITING = 'WAITING',     // Waiting for next round
    PLAYING = 'PLAYING',     // Currently playing a round
    ELIMINATED = 'ELIMINATED' // Out of the tournament (failed to beat boss blind)
}

/**
 * Represents a player in the game
 */
export class Player {
    private _status: PlayerStatus
    private _isBot: boolean

    constructor(
        private readonly _id: string,
        private readonly _name: string,
        isBot: boolean = false,
    ) {
        this._status = PlayerStatus.WAITING
        this._isBot = isBot
    }

    /**
     * Get the player's ID
     */
    get id(): string {
        return this._id
    }

    /**
     * Get the player's name
     */
    get name(): string {
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
     * Check if the player is a bot
     */
    isBot(): boolean {
        return this._isBot
    }
   
    /**
     * Check if the player can act in the current round
     */
    canAct(): boolean {
        return this._status === PlayerStatus.PLAYING
    }


    /**
     * Check if the player is still in the tournament
     */
    isInTournament(): boolean {
        return this._status !== PlayerStatus.ELIMINATED
    }

    /**
     * Eliminate player from the tournament (failed to beat boss blind)
     */
    eliminate(): void {
        this._status = PlayerStatus.ELIMINATED
    }

    /**
     * Get string representation of the player
     */
    toString(): string {
        return `${this._name}`
    }
   
} 