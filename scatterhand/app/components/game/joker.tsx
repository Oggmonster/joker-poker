import { BaseJoker } from '#app/domain/joker'
import { cn } from '#app/utils/cn'

interface JokerProps {
    joker: BaseJoker
    className?: string
}

/**
 * Displays a joker card with its name, rarity, and level
 */
export function Joker({ joker, className }: JokerProps) {
    return (
        <div 
            className={cn(
                'w-12 h-16 bg-purple-800 rounded-lg p-1',
                'text-white text-xs flex flex-col items-center justify-between',
                className
            )}
        >
            <div className="font-bold text-center">{joker.name}</div>
            <div className="text-center">
                <div>{joker.rarity}</div>
                <div>Lvl {joker.level}</div>
            </div>
        </div>
    )
} 