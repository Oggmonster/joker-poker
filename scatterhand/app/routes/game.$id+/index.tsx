import { useCallback, useEffect, useState } from 'react'
import { Card } from '#app/domain/cards'
import { BaseJoker} from '#app/domain/joker'
import { Player} from '#app/domain/player'
import { type Route } from './+types/index.ts'
import { CountdownPhase } from '#app/components/game/countdown-phase'
import { PlayPhase } from '#app/components/game/play-phase.tsx'
import { Phase } from '#app/components/game/play-phase.tsx'
import { PlayerScore, ScoringDisplay } from '#app/components/game/scoring-display.tsx'
import { Deck } from '#app/domain/deck.ts'
import { JokerDeck } from '#app/domain/joker-deck.ts'
import { Game } from '#app/domain/game.ts'
import { Round } from '#app/domain/rounds.ts'


export async function loader({ params, request }: Route.LoaderArgs) {
	return { gameId: params.id }
}

export const meta: Route.MetaFunction = ({ data }) => [{ title: `Scatterhand - Game ${data.gameId}` }]

const COUNTDOWN_TIME = 300 // 5 minutes
const PHASE_TIME = 30 // seconds
const SCORING_TIME = 10 // seconds

// Create mock players with proper Player class instances
const mockPlayers: Player[] = [
	new Player('1', 'Player 1', false),
	new Player('2', 'Bot 1', true),
	new Player('3', 'Bot 2', true),
	new Player('4', 'Bot 3', true),
]

interface ScoredPlay extends PlayerScore {
	phase: Phase
}

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
    const [timeRemaining, setTimeRemaining] = useState(COUNTDOWN_TIME)
    const [cardDeck, setCardDeck] = useState<Deck | null>(null)
    const [jokerDeck, setJokerDeck] = useState<JokerDeck | null>(null)
    const [game, setGame] = useState<Game | null>(null)
    const [round, setRound] = useState<Round | null>(null)
    const [playerJokers, setPlayerJokers] = useState<BaseJoker[]>([])
    const [gameState, setGameState] = useState<GameState | null>(null)

    // Initialize game state
    useEffect(() => {
        const newGame = new Game({
            minPlayers: 2,
            maxPlayers: 6,
            startingAnte: 100,
            anteIncrease: 100,
            rewardThresholdMultiplier: 1.5
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
        //player start with 5 jokers
        const playerJokers = newJokerDeck.drawPlayerJokers(5)
        setPlayerJokers(playerJokers)
        setCardDeck(newDeck)
        setJokerDeck(newJokerDeck)
        setGame(newGame)
        setGameState({
            phase: Phase.COUNTDOWN,
            playerCards: [],
            playerJokers: [],
            communityCards:[],
            communityJokers: []
        })
    }, [])

    // Handle phase timer
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

    const handleRoundStart = useCallback(() => {
        if (!game) return
        const newRound = game.startNextRound()
        setRound(newRound)
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

    const handleNextPhase = useCallback(() => {
        if (!round) return

       
    }, [game, round])
    

    // Handle play hand
    const handlePlayHand = (totalScore: number) => {
        if (!cardDeck || !jokerDeck) return


        setGameState(prev => {
            if (!prev) return null

            // If we're in FLOP phase, move to TURN
            if (prev.phase === 'FLOP') {
                const newPlayerCards: Record<string, Card[]> = { ...prev.playerCards }
                const newPlayerJokers: Record<string, BaseJoker[]> = { ...prev.playerJokers }
                
                // Add one card to each player's hand
                for (const player of prev.players) {
                    const playerHand = newPlayerCards[player.id] || []
                    const drawnCard = cardDeck.tryDrawCard()
                    if (drawnCard) {
                        newPlayerCards[player.id] = [...playerHand, drawnCard]
                    }

                    // Add one joker to each player
                    const playerJokers = newPlayerJokers[player.id] || []
                    const drawnJokers = jokerDeck.drawPlayerJokers(1)
                    if (drawnJokers.length === 1 && drawnJokers[0]) {
                        newPlayerJokers[player.id] = [...playerJokers, drawnJokers[0]]
                    }
                }

                // Add one community card and one community joker
                const drawnCard = cardDeck.tryDrawCard()
                const drawnJokers = jokerDeck.drawCommunityJokers(1)

                // Only update if we successfully drew all cards
                if (!drawnCard || drawnJokers.length !== 1 || !drawnJokers[0]) {
                    return prev // Keep the previous state if we couldn't draw new cards
                }

                const newState: GameState = {
                    ...prev,
                    phase: 'TURN',
                    playerCards: newPlayerCards,
                    playerJokers: newPlayerJokers,
                    communityCards: [...prev.communityCards, drawnCard],
                    communityJokers: [...prev.communityJokers, drawnJokers[0]],
                    timeRemaining: PHASE_TIME
                }

                return newState
            }
            // If we're in TURN phase, move to RIVER
            else if (prev.phase === 'TURN') {
                const newPlayerCards: Record<string, Card[]> = { ...prev.playerCards }
                const newPlayerJokers: Record<string, BaseJoker[]> = { ...prev.playerJokers }
                
                // Add one card and one joker to each player for River phase
                for (const player of prev.players) {

                    const playerHand = newPlayerCards[player.id] || []
                    const drawnCard = cardDeck.tryDrawCard()
                    if (drawnCard) {
                        newPlayerCards[player.id] = [...playerHand, drawnCard]
                    }

                    const playerJokers = newPlayerJokers[player.id] || []
                    const drawnJokers = jokerDeck.drawPlayerJokers(1)
                    if (drawnJokers.length === 1 && drawnJokers[0]) {
                        newPlayerJokers[player.id] = [...playerJokers, drawnJokers[0]]
                    }
                }

                // Add one community card for River
                const drawnCard = cardDeck.tryDrawCard()
                if (!drawnCard) {
                    return prev // Keep previous state if we couldn't draw a card
                }

                const newState: GameState = {
                    ...prev,
                    phase: 'RIVER',
                    playerJokers: newPlayerJokers,
                    communityCards: [...prev.communityCards, drawnCard],
                    timeRemaining: PHASE_TIME
                }

                return newState
            }
            // If we're in RIVER phase, move to SHOWDOWN
            else if (prev.phase === 'RIVER') {

                const newState: GameState = {
                    ...prev,
                    phase: 'SHOWDOWN',
                    isComplete: true,
                    timeRemaining: SCORING_TIME
                }

                return newState
            }
            return prev
        })
    }

    type GamePlayPhase =  'COUNTDOWN' | 'FLOP' | 'TURN' | 'RIVER' | 'SHOWDOWN'
    
    // Group scores by phase
    const scoresByPhase = phaseScores.reduce((acc, score) => {
        if (!acc[score.phase]) {
            acc[score.phase] = []
        }
        acc[score.phase].push(score)
        return acc
    }, { COUNTDOWN: [], FLOP: [], TURN: [], RIVER: [], SHOWDOWN: [] } as Record<GamePlayPhase, ScoredPlay[]>)

    if (!gameState) return <div>Loading...</div>
   
    if (gameState.phase === 'COUNTDOWN') {
        return (
            <CountdownPhase
                players={game?.getPlayers()}
                timeRemaining={timeRemaining}
                className="flex-1"
            />
        )
    }

    const currentPlayer = gameState.players[gameState.currentPlayerId]
    if (!currentPlayer) return <div>Error: No current player</div>
    const playerCards = gameState.playerCards[currentPlayer.id]
    if (!playerCards) return <div>Error: No cards for current player</div>

    const playerJokers = gameState.playerJokers[currentPlayer.id]
    if (!playerJokers) return <div>Error: No jokers for current player</div>

    return (
        <div className="flex flex-col h-full gap-4 p-4">
            {showScoring && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                    <div className="bg-gray-800/90 rounded-lg p-6 w-full max-w-2xl">
                        {/* Show current phase scores at the top */}
                        {gameState.phase !== 'SHOWDOWN' && scoresByPhase[gameState.phase as GamePlayPhase].length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white text-center mb-4">
                                    Current {gameState.phase} Phase Scores
                                </h2>
                                <ScoringDisplay
                                    scores={scoresByPhase[gameState.phase as GamePlayPhase]}
                                    className="mb-4"
                                />
                            </div>
                        )}

                        {/* Show all phase scores in sequence */}
                        {(['FLOP', 'TURN', 'RIVER'] as GamePlayPhase[]).map(phase => {
                            const phaseScores = scoresByPhase[phase]
                            return phaseScores.length > 0 ? (
                                <div key={phase} className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-300 mb-2">
                                        {phase} Phase
                                    </h3>
                                    <ScoringDisplay
                                        scores={phaseScores}
                                        className="mb-4"
                                    />
                                </div>
                            ) : null
                        })}

                        {/* Show total scores in showdown */}
                        {gameState.phase === 'SHOWDOWN' && (
                            <div className="mt-6">
                                <h2 className="text-2xl font-bold text-yellow-400 text-center mb-4">
                                    Final Scores
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {Object.entries(totalScores)
                                        .sort(([, a], [, b]) => b.totalScore - a.totalScore)
                                        .map(([playerId, { playerName, totalScore }]) => (
                                            <div 
                                                key={playerId}
                                                className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg"
                                            >
                                                <span className="text-lg font-bold text-white">
                                                    {playerName}
                                                </span>
                                                <span className="text-2xl font-bold text-yellow-400">
                                                    {totalScore}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(gameState.phase === 'FLOP' || gameState.phase === 'TURN' || gameState.phase === 'RIVER') && (
                <PlayPhase
                    player={currentPlayer}
                    playerCards={playerCards}
                    playerJokers={playerJokers}
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
                </div>
            )}
        </div>
    )
} 