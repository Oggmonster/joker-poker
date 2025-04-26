import { BaseJoker, JokerRarity } from '#app/domain/joker'
import { cn } from '#app/utils/cn'

export interface JokerProps {
    joker: BaseJoker
    isSelected?: boolean
    onClick?: () => void
    className?: string
}

const RARITY_STYLES = {
    [JokerRarity.COMMON]: {
        bg: 'bg-gray-500',
        hover: 'hover:bg-gray-600',
        text: 'text-white'
    },
    [JokerRarity.UNCOMMON]: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        text: 'text-white'
    },
    [JokerRarity.RARE]: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        text: 'text-white'
    },
    [JokerRarity.LEGENDARY]: {
        bg: 'bg-purple-500',
        hover: 'hover:bg-purple-600',
        text: 'text-white'
    },
    [JokerRarity.UNIQUE]: {
        bg: 'bg-yellow-500',
        hover: 'hover:bg-yellow-600',
        text: 'text-black'
    }
}

/**
 * Displays a joker card with its name, rarity, and level
 */
export function JokerDisplay({ joker, isSelected, onClick, className }: JokerProps) {
    const styles = RARITY_STYLES[joker.rarity]

    return (
        <div 
            className={cn(
                "w-full h-full rounded-lg p-3 cursor-pointer transition-all",
                styles.bg,
                styles.hover,
                isSelected && "ring-4 ring-yellow-400",
                className
            )}
            onClick={onClick}
        >
            <div className={cn(
                "flex flex-col h-full gap-2",
                styles.text
            )}>
                {/* Name */}
                <div className="text-lg font-bold leading-tight">
                    {joker.name}
                </div>

                {/* Effect */}
                <div className="text-sm opacity-90 flex-1">
                    {joker.effect}
                </div>

                {/* Level */}
                <div className="flex items-center justify-between text-sm">
                    <div className="opacity-75">{joker.rarity}</div>
                    <div className="font-bold">Level {joker.level}</div>
                </div>
            </div>
        </div>
    )
} 