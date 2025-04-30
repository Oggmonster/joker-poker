import { useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '#app/domain/cards'
import { BaseJoker} from '#app/domain/joker'
import { Player} from '#app/domain/player'
import { type Route } from './+types/index.ts'
import { CountdownPhase } from '#app/components/game/countdown-phase'
import { PlayPhase } from '#app/components/game/play-phase.tsx'
import { Phase, Reward } from '#app/domain/rounds.ts'
import { Deck } from '#app/domain/deck.ts'
import { JokerDeck } from '#app/domain/joker-deck.ts'
import { Game } from '#app/domain/game.ts'
import { Round } from '#app/domain/rounds.ts'


export async function loader({ params, request }: Route.LoaderArgs) {
	return { gameId: params.id }
}

export const meta: Route.MetaFunction = ({ data }) => [{ title: `Scatterhand - Game ${data.gameId}` }]

const ROUND_TIME = 300 // 5 minutes
const COUNTDOWN_TIME = 3 // 3 seconds

interface GameState {
    phase: Phase,
    playerCards: Card[],
    playerJokers: BaseJoker[],
    communityCards: Card[],
    communityJokers: BaseJoker[]
}
/**
 * Main game route component
 */
export default function GameRoute({ loaderData }: Route.ComponentProps) { 
    const [timeRemaining, setTimeRemaining] = useState(ROUND_TIME)
    const [countdownTimeRemaining, setCountdownTimeRemaining] = useState(COUNTDOWN_TIME)

    const [game, setGame] = useState<Game | null>(null)
    const [round, setRound] = useState<Round | null>(null)
    const [gameState, setGameState] = useState<GameState | null>(null)
    const [playerTotalScore, setPlayerTotalScore] = useState<number>(0)
    const [roundRewards, setRoundRewards] = useState<Reward[]>([])

    //useRef to store the playerJokers
    const playerJokersRef = useRef<BaseJoker[]>([])
    const cardDeckRef = useRef<Deck | null>(null)
    const jokerDeckRef = useRef<JokerDeck | null>(null)

    // Initialize game state
    useEffect(() => {
        const newGame = new Game({
            minPlayers: 2,
            maxPlayers: 6,
            startingAnte: 100,
            anteIncrease: 10,
            rewardThresholdMultiplier: 1.1
        })
        newGame.addPlayer(new Player('1', 'Player 1', false))
        newGame.addPlayer(new Player('2', 'Bot 1', true))
        newGame.addPlayer(new Player('3', 'Bot 2', true))
        newGame.addPlayer(new Player('4', 'Bot 3', true))
        newGame.start()
        const newDeck = Deck.createStandard()
        newDeck.shuffle()
        const newJokerDeck = JokerDeck.create()
        newJokerDeck.shuffle()
        //player start with 1 jokers
        const newPlayerJokers = newJokerDeck.drawPlayerJokers(1)
        playerJokersRef.current = newPlayerJokers
        cardDeckRef.current = newDeck
        jokerDeckRef.current = newJokerDeck
        setGame(newGame)
        setGameState({
            phase: Phase.COUNTDOWN,
            playerCards: [],
            playerJokers: [],
            communityCards:[],
            communityJokers: []
        })
    }, [])

    useEffect(() => {
        if (round === null) return

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 0) {
                    handleRoundEnd()
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [round])
    
    useEffect(() => {
        if (!gameState) return  
        if (gameState.phase !== Phase.COUNTDOWN) return

        const timer = setInterval(() => {
            setCountdownTimeRemaining(prev => {
                if (prev <= 0) {
                    handleRoundStart()                   
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameState?.phase])   

    const handleRoundStart = useCallback(() => {
        if (!game) return
        const newRound = game.startNextRound()
        setRound(newRound)
        handlePhaseEnd()
    }, [game])

    // Handle round end
    const handleRoundEnd = useCallback(() => {
        if (!game) return
        if (!round) return

        //mocke player scores
        const playerScores = new Map<string, number>()
        playerScores.set('1', 100)
        playerScores.set('2', 200)
        playerScores.set('3', 300)
        playerScores.set('4', 400)

        const result = round.processResults(playerScores)        
        console.log(result)
        handleRoundStart()
    }, [game, round])

    const drawRoundPlayerJokers = (currentJokers: BaseJoker[]): BaseJoker[] => {
        const pickedJokers = currentJokers ? currentJokers : []
        console.log('pickedJokers', pickedJokers)        
        //draw from allJokers but filter out playerJokers
        const drawnJokers = playerJokersRef.current.filter(joker => !pickedJokers.includes(joker))
        if (drawnJokers.length === 0) return []
        //shuffle drawnJokers
        console.log('drawnJokers before shuffle', JSON.stringify(drawnJokers))
        drawnJokers.sort(() => Math.random() - 0.5);
        console.log('drawnJokers after shuffle', JSON.stringify(drawnJokers))
        const pickedJoker = drawnJokers.slice(0, 1)
        console.log('pickedJoker', JSON.stringify(pickedJoker))
        return pickedJoker
    }

      // Handle phase end
      const handlePhaseEnd = useCallback(() => {
        if (!gameState) return
        
        setGameState(prev => {
            if (!prev) return null

            if (prev.phase === Phase.COUNTDOWN) {
                const flopCards = cardDeckRef.current?.drawCards(3) ?? []
                const flopJokers = jokerDeckRef.current?.drawCommunityJokers(3) ?? []
                const playerFlopCards = cardDeckRef.current?.drawCards(2) ?? []
                const playerFlopJokers = drawRoundPlayerJokers([])
                
                return {
                    ...prev,
                    phase: Phase.FLOP,
                    playerCards: playerFlopCards,
                    playerJokers: playerFlopJokers,
                    communityCards: flopCards,
                    communityJokers: flopJokers
                }
            }
            else if (prev.phase === Phase.FLOP) {
                const turnCard = cardDeckRef.current?.drawCards(1)[0]
                const turnJoker = jokerDeckRef.current?.drawCommunityJokers(1)[0]
                const playerTurnCard = cardDeckRef.current?.drawCards(1)[0]
                const playerTurnJoker = drawRoundPlayerJokers(prev.playerJokers)

                return {
                    ...prev,
                    phase: Phase.TURN,
                    playerCards: [...prev.playerCards, playerTurnCard].filter((c): c is Card => c !== undefined),
                    playerJokers: [...prev.playerJokers, ...playerTurnJoker].filter((j): j is BaseJoker => j !== undefined),
                    communityCards: [...prev.communityCards, turnCard].filter((c): c is Card => c !== undefined),
                    communityJokers: [...prev.communityJokers, turnJoker].filter((j): j is BaseJoker => j !== undefined)
                }
            }
            else if (prev.phase === Phase.TURN) {
                const riverCard = cardDeckRef.current?.drawCards(1)[0]
                const riverJoker = jokerDeckRef.current?.drawCommunityJokers(1)[0]
                const playerRiverCard = cardDeckRef.current?.drawCards(1)[0]
                const playerRiverJoker = drawRoundPlayerJokers(prev.playerJokers)

                return {
                    ...prev,
                    phase: Phase.RIVER,
                    playerCards: [...prev.playerCards, playerRiverCard].filter((c): c is Card => c !== undefined),
                    playerJokers: [...prev.playerJokers, ...playerRiverJoker].filter((j): j is BaseJoker => j !== undefined),
                    communityCards: [...prev.communityCards, riverCard].filter((c): c is Card => c !== undefined),
                    communityJokers: [...prev.communityJokers, riverJoker].filter((j): j is BaseJoker => j !== undefined)
                }
            }
            else if (prev.phase === Phase.RIVER) {
                const newState: GameState = {
                    ...prev,
                    phase: Phase.SHOWDOWN,
                }
                return newState
            }
            return prev
        })
    }, [gameState])

    const handleRewards = (playerScore: number) => {
        if (!gameState) return
        const playerScores = new Map<string, number>()
        playerScores.set('1', playerScore)
        const rewards = round?.processResults(playerScores)
        console.log('rewards', rewards, playerScores)
        const playerRewards = rewards?.rewards.get('1') ?? []
        //if rewards cotains a joker add joker to playerJokers
        const hasJokerInReward = playerRewards.filter(reward => reward.type === 'JOKER').length > 0;
        if (hasJokerInReward) {
            const newPlayerJokers = jokerDeckRef.current?.drawPlayerJokers(1) ?? []
            playerJokersRef.current = [
                ...playerJokersRef.current,
                ...newPlayerJokers
            ]
        }
        setRoundRewards(playerRewards)
    }

    const resetAndStartNewRound = () => {
        const newDeck = Deck.createStandard()
        newDeck.shuffle()
        cardDeckRef.current = newDeck
        setPlayerTotalScore(0)
        setCountdownTimeRemaining(COUNTDOWN_TIME)
        setTimeRemaining(ROUND_TIME)       
        setGameState({
            phase: Phase.COUNTDOWN,
            playerCards: [],
            playerJokers: [],
            communityCards:[],
            communityJokers: []
        })
    }


    // Handle play hand
    const handlePlayHand = (totalScore: number) => {
        if (!cardDeckRef.current || !jokerDeckRef.current) return
        const newPlayerTotalScore = playerTotalScore + totalScore
        setPlayerTotalScore(prev => prev + totalScore)
        if (gameState?.phase === Phase.RIVER) {
            handleRewards(newPlayerTotalScore)
        }
        handlePhaseEnd()        
    }

    if (!gameState) return <div>Loading...</div>
   
    if (gameState.phase === 'COUNTDOWN') {
        return (
            <CountdownPhase
                timeRemaining={countdownTimeRemaining}
                className="flex-1"
            />
        )
    }
    
    if (!gameState.playerCards) return <div>Error: No cards for current player</div>
    
    if (!gameState.playerJokers) return <div>Error: No jokers for current player</div>

    return (
        <div className="flex flex-col h-full gap-4 p-4">
            {(gameState.phase === 'FLOP' || gameState.phase === 'TURN' || gameState.phase === 'RIVER') && (
                <PlayPhase
                    phase={gameState.phase}
                    scoreThreshold={round?.getRewardThreshold() ?? 0}
                    playerCards={gameState.playerCards}
                    playerJokers={gameState.playerJokers}
                    communityCards={gameState.communityCards}
                    communityJokers={gameState.communityJokers}
                    onPlayHand={handlePlayHand}
                    timeRemaining={timeRemaining}
                    className="flex-1"
                />
            )}

            {gameState.phase === 'SHOWDOWN' && (
                <div className="text-center text-2xl font-bold text-white">
                    Game Complete!
                    <div className="text-sm text-white">
                        {playerTotalScore}
                    </div>
                    <div className="text-sm text-white">
                        {roundRewards.map(reward => reward.type).join(', ')}
                    </div>
                    <button onClick={resetAndStartNewRound}>
                        Start New Round
                    </button>
                </div>
            )}
        </div>
    )
} 