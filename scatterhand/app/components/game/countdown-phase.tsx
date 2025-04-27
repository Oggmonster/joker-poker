import { Player } from '#app/domain/player'
import { cn } from '#app/utils/cn'

interface CountdownPhaseProps {
    timeRemaining: number
    className?: string
}

export function CountdownPhase({ timeRemaining, className }: CountdownPhaseProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-8", className)}>
            <div className="text-2xl font-bold">Game Starting In</div>
            <div className="text-8xl font-bold text-blue-500">{timeRemaining}</div>
        </div>
    )
} 