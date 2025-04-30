import { BaseJoker, JokerType } from './joker'
import { PairUp } from './jokers/hand-rank-jokers'
import { ClubCrawl, DiamondDazzle, Heartwarming, SpadeSurge } from './jokers/suit-jokers'
import { OneEyedJack } from './jokers/one-eyed-jack'
import { RiverGod } from './jokers/phase-jokers'
import { PokerFace } from './jokers/poker-face'
import { TheBrunson } from './jokers/the-brunson'
import { Rank10Power, Rank2Power, Rank3Power, Rank4Power, Rank5Power, Rank6Power, Rank7Power, Rank8Power, Rank9Power, RankAPower, RankJPower, RankKPower, RankQPower } from './jokers/rank-power-jokers'
import { Lollipops } from './jokers/lollipops'
import { Eagles } from './jokers/eagles'
import { Blaze } from './jokers/blaze'
import { OneGapGlory } from './jokers/one-gap-glory'
import { Cowboys } from './jokers/cowboys'
import { Snowmen } from './jokers/snowmen'
import { BigSlick } from './jokers/big-slick'
import { StoneCold } from './jokers/stone-cold'
import { WalkingSticks } from './jokers/walking-sticks'
import { TheRocket } from './jokers/the-rocket'
import { TheWheel } from './jokers/the-wheel'
import { TheRipper } from './jokers/the-ripper'
import { TheHammer } from './jokers/the-hammer'
import { ThePistol } from './jokers/the-pistol'
import { TheDealer } from './jokers/the-dealer'
import { SteelWheel } from './jokers/steel-wheel'
import { Slickback } from './jokers/slickback'
import { SneakyStraight } from './jokers/sneaky-straight'
import { SetMine } from './jokers/set-mine'
import { RoyalFavor } from './jokers/royal-favor'
import { Sailboats } from './jokers/sailboats'
import { QuackQuack } from './jokers/quack-quack'
import { PocketMonster } from './jokers/pocket-monster'
import { JackDaniels } from './jokers/jack-daniels'
import { HowLucky } from './jokers/how-lucky'
import { HeartMultiplier } from './jokers/heart-multiplier'
import { FlushRush } from './jokers/flush-rush'
import { FourHorsemen } from './jokers/four-horsemen'
import { Fishhooks } from './jokers/fishhooks'
import { Ducks } from './jokers/ducks'
import { FaceCollector } from './jokers/face-collector'
import { DoubleTrouble } from './jokers/double-trouble'
import { DeadMansHand } from './jokers/dead-mans-hand'
import { ColorWeaver } from './jokers/color-weaver'
import { Broadway } from './jokers/broadway'
import { BlackMariah } from './jokers/black-mariah'
import { BigChick } from './jokers/big-chick'
import { AceInTheHole } from './jokers/ace-in-the-hole'
import { DualThreat, FlushLane, MiddleMadness, PairedUp } from './jokers/uncommon-community-jokers'

/**
 * Manages a collection of jokers and handles their distribution
 */
export class JokerDeck {
    private playerJokers: BaseJoker[] = []
    private communityJokers: BaseJoker[] = []

    /**
     * Create a new joker deck with all available jokers
     */
    public static create(): JokerDeck {
        const deck = new JokerDeck()
        
        // Add player jokers
        deck.addPlayerJoker(new OneEyedJack())
        deck.addPlayerJoker(new PokerFace())
        deck.addPlayerJoker(new TheBrunson())
        deck.addPlayerJoker(new Lollipops())
        deck.addPlayerJoker(new Eagles())
        deck.addPlayerJoker(new Blaze())
        deck.addPlayerJoker(new OneGapGlory())
        deck.addPlayerJoker(new RiverGod())
        deck.addPlayerJoker(new Cowboys())
        deck.addPlayerJoker(new Snowmen())
        deck.addPlayerJoker(new BigSlick())
        deck.addPlayerJoker(new StoneCold())
        deck.addPlayerJoker(new WalkingSticks())
        deck.addPlayerJoker(new TheRocket())
        deck.addPlayerJoker(new TheWheel())
        deck.addPlayerJoker(new TheRipper())
        deck.addPlayerJoker(new TheHammer())
        deck.addPlayerJoker(new ThePistol())
        deck.addPlayerJoker(new TheDealer())
        deck.addPlayerJoker(new SteelWheel())
        deck.addPlayerJoker(new Slickback())
        deck.addPlayerJoker(new SneakyStraight())
        deck.addPlayerJoker(new SetMine())
        deck.addPlayerJoker(new RoyalFavor())
        deck.addPlayerJoker(new Sailboats())
        deck.addPlayerJoker(new QuackQuack())
        deck.addPlayerJoker(new PocketMonster())
        deck.addPlayerJoker(new JackDaniels())
        deck.addPlayerJoker(new HowLucky())
        deck.addPlayerJoker(new Fishhooks())
        deck.addPlayerJoker(new Ducks())
        deck.addPlayerJoker(new FaceCollector())
        deck.addPlayerJoker(new DoubleTrouble())
        deck.addPlayerJoker(new DeadMansHand())
        deck.addPlayerJoker(new BigChick())
        deck.addPlayerJoker(new AceInTheHole())
        deck.addPlayerJoker(new ColorWeaver())
        deck.addPlayerJoker(new Broadway())
        deck.addPlayerJoker(new BlackMariah())
        deck.addPlayerJoker(new FourHorsemen())
        deck.addPlayerJoker(new FlushRush())


        // Add community jokers
        deck.addCommunityJoker(new PairUp())
        deck.addCommunityJoker(new DiamondDazzle())
        deck.addCommunityJoker(new Heartwarming())
        deck.addCommunityJoker(new ClubCrawl())
        deck.addCommunityJoker(new SpadeSurge())
        deck.addCommunityJoker(new Rank2Power())
        deck.addCommunityJoker(new Rank3Power())
        deck.addCommunityJoker(new Rank4Power())
        deck.addCommunityJoker(new Rank5Power())
        deck.addCommunityJoker(new Rank6Power())
        deck.addCommunityJoker(new Rank7Power())
        deck.addCommunityJoker(new Rank8Power())
        deck.addCommunityJoker(new Rank9Power())
        deck.addCommunityJoker(new Rank10Power())
        deck.addCommunityJoker(new RankJPower())
        deck.addCommunityJoker(new RankQPower())
        deck.addCommunityJoker(new RankKPower())
        deck.addCommunityJoker(new RankAPower())
        deck.addCommunityJoker(new HeartMultiplier())
        deck.addCommunityJoker(new FlushLane())
        deck.addCommunityJoker(new DualThreat())
        deck.addCommunityJoker(new PairedUp())
        deck.addCommunityJoker(new MiddleMadness())
        
        return deck
    }

    /**
     * Add a player joker to the deck
     */
    public addPlayerJoker(joker: BaseJoker): void {
        if (joker.type !== JokerType.PLAYER) {
            throw new Error('Can only add player jokers to player deck')
        }
        this.playerJokers.push(joker)
    }

    /**
     * Add a community joker to the deck
     */
    public addCommunityJoker(joker: BaseJoker): void {
        if (joker.type !== JokerType.COMMUNITY) {
            throw new Error('Can only add community jokers to community deck ' + joker.name)
        }
        this.communityJokers.push(joker)
    }

    /**
     * Draw a random player joker from the deck
     * @returns A random player joker, or undefined if none are available
     */
    public drawPlayerJoker(): BaseJoker | undefined {
        if (this.playerJokers.length === 0) return undefined
        const index = Math.floor(Math.random() * this.playerJokers.length)
        return this.playerJokers.splice(index, 1)[0]
    }

    /**
     * Draw a random community joker from the deck
     * @returns A random community joker, or undefined if none are available
     */
    public drawCommunityJoker(): BaseJoker | undefined {
        if (this.communityJokers.length === 0) return undefined
        const index = Math.floor(Math.random() * this.communityJokers.length)
        return this.communityJokers.slice(index, 1)[0]
    }

    public drawPlayerJokers(count: number): BaseJoker[] {
        const jokers: BaseJoker[] = []
        for (let i = 0; i < count; i++) {
            const joker = this.drawPlayerJoker()
            if (joker) {
                jokers.push(joker)
            }
        }
        return jokers
    }

    /**
     * Draw multiple community jokers at once
     * @param count Number of jokers to draw
     * @returns Array of drawn jokers
     */
    public drawCommunityJokers(count: number): BaseJoker[] {
        const howMany = Math.min(count, this.communityJokers.length)
        const randomJokers = [...this.communityJokers].sort(() => Math.random() - 0.5)
        return randomJokers.slice(0, howMany)
    }

    /**
     * Get the number of remaining player jokers
     */
    public get remainingPlayerJokers(): number {
        return this.playerJokers.length
    }

    /**
     * Get the number of remaining community jokers
     */
    public get remainingCommunityJokers(): number {
        return this.communityJokers.length
    }

    /**
     * Shuffle both player and community joker decks
     */
    public shuffle(): void {
        this.shuffleArray(this.playerJokers)
        this.shuffleArray(this.communityJokers)
    }

    /**
     * Fisher-Yates shuffle implementation
     */
    private shuffleArray<T>(array: T[]): void {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i]!;
            array[i] = array[j]!;
            array[j] = temp;
        }
    }
} 