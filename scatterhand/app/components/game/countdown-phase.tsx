import { Player } from '#app/domain/player'
import { cn } from '#app/utils/cn'

interface CountdownPhaseProps {
    players: Player[]
    timeRemaining: number
    className?: string
}

export function CountdownPhase({ players, timeRemaining, className }: CountdownPhaseProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-8", className)}>
            <div className="text-2xl font-bold">Game Starting In</div>
            <div className="text-8xl font-bold text-blue-500">{timeRemaining}</div>
            
            <div className="flex flex-col items-center gap-4">
                <div className="text-xl font-bold">Players</div>
                <div className="grid grid-cols-2 gap-4">
                    {players.map((player) => (
                        <div 
                            key={player.id} 
                            className={cn(
                                "px-6 py-4 rounded-lg text-lg font-medium",
                                "bg-white/10 backdrop-blur-sm",
                                player.isBot() ? "text-gray-400" : "text-white"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span>{player.name}</span>
                                {player.isBot() && (
                                    <span className="text-sm opacity-75">(Bot)</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 