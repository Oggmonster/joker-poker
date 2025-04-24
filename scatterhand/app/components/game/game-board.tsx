import { Card } from '#app/domain/cards'
import { BaseJoker } from '#app/domain/joker'
import { Player } from '#app/domain/player'
import { RoundPhase } from '#app/domain/round-state'
import { cn } from '#app/utils/cn'
import { CommunityArea } from './community-area'
import { PlayerArea } from './player-area'

interface GameBoardProps {
    players: Player[]
    activePlayerId: string | null
    playerCards: Record<string, Card[]>
    communityCards: Card[]
    communityJokers: BaseJoker[]
    currentPhase: RoundPhase
    playerScores: Record<string, number>
    className?: string
}

interface PlayerPosition {
    x: number
    y: number
    rotation: number
}

/**
 * Calculates player positions around an elliptical table
 */
function calculatePlayerPositions(numPlayers: number): PlayerPosition[] {
    const positions: PlayerPosition[] = []
    const centerX = 50 // Center X percentage
    const centerY = 50 // Center Y percentage
    const radiusX = 40 // Horizontal radius percentage
    const radiusY = 30 // Vertical radius percentage

    for (let i = 0; i < numPlayers; i++) {
        // Calculate angle for this player (0 to 2π)
        const angle = (i * 2 * Math.PI) / numPlayers
        // Start at -π/2 (top) and go clockwise
        const adjustedAngle = angle - Math.PI / 2

        // Calculate position on ellipse
        const x = centerX + radiusX * Math.cos(adjustedAngle)
        const y = centerY + radiusY * Math.sin(adjustedAngle)
        
        // Calculate rotation to face center
        const rotation = (angle * 180) / Math.PI

        positions.push({ x, y, rotation })
    }

    return positions
}

/**
 * Main game board component that shows players around a table with community cards
 */
export function GameBoard({
    players,
    activePlayerId,
    playerCards,
    communityCards,
    communityJokers,
    currentPhase,
    playerScores,
    className
}: GameBoardProps) {
    const positions = calculatePlayerPositions(players.length)

    return (
        <div className={cn('relative w-full h-full', className)}>
            {/* Players */}
            {players.map((player, index) => {
                const position = positions[index]
                if (!position) return null // Skip if no position calculated
                const isActive = player.getId() === activePlayerId
                const playerId = player.getId()

                return (
                    <div
                        key={playerId}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            transform: `translate(-50%, -50%) rotate(${position.rotation}deg)`
                        }}
                    >
                        <PlayerArea
                            player={player}
                            isActive={isActive}
                            cards={playerCards[playerId] || []}
                            roundScore={playerScores[playerId] || 0}
                        />
                    </div>
                )
            })}

            {/* Community Area */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <CommunityArea
                    phase={currentPhase}
                    cards={communityCards}
                    jokers={communityJokers}
                />
            </div>
        </div>
    )
} 