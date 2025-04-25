import { BaseJoker } from './base-joker';
import { Card } from '../card';
import { Player } from '../player';

export abstract class CommunityJoker extends BaseJoker {
    protected _communityCards: Card[] = [];
    protected _affectedPlayers: Player[] = [];

    constructor(name: string, description: string) {
        super(name, description);
    }

    /**
     * Updates the community cards that this joker should consider
     */
    public setCommunityCards(cards: Card[]): void {
        this._communityCards = [...cards];
    }

    /**
     * Updates the list of players that this joker affects
     */
    public setAffectedPlayers(players: Player[]): void {
        this._affectedPlayers = [...players];
    }

    /**
     * Applies the joker's effect to all affected players based on community cards
     */
    public abstract applyEffect(): void;

    /**
     * Returns true if the joker's condition is met based on community cards
     */
    protected abstract checkCondition(): boolean;
} 