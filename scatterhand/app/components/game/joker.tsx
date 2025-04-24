import { BaseJoker, JokerRarity } from '#app/domain/joker'
import { BaseSelectable, BaseSelectableProps } from './base-selectable'
import { cn } from '#app/utils/cn'

interface JokerProps extends Omit<BaseSelectableProps, 'children'> {
    joker: BaseJoker
}

const RARITY_COLORS = {
    [JokerRarity.COMMON]: 'bg-gray-100 border-gray-300',
    [JokerRarity.UNCOMMON]: 'bg-green-100 border-green-300',
    [JokerRarity.RARE]: 'bg-blue-100 border-blue-300',
    [JokerRarity.LEGENDARY]: 'bg-purple-100 border-purple-300',
    [JokerRarity.UNIQUE]: 'bg-yellow-100 border-yellow-300',
}

const RARITY_TEXT_COLORS = {
    [JokerRarity.COMMON]: 'text-gray-700',
    [JokerRarity.UNCOMMON]: 'text-green-700',
    [JokerRarity.RARE]: 'text-blue-700',
    [JokerRarity.LEGENDARY]: 'text-purple-700',
    [JokerRarity.UNIQUE]: 'text-yellow-700',
}

/**
 * Joker component that displays a joker card
 * Uses BaseSelectable for selection and hover states
 */
export function Joker({ joker, className, ...props }: JokerProps) {
    const rarityColor = RARITY_COLORS[joker.rarity]
    const rarityTextColor = RARITY_TEXT_COLORS[joker.rarity]

    return (
        <BaseSelectable
            className={cn(
                'w-24 h-36 p-2 border-2',
                'flex flex-col items-center',
                rarityColor,
                className
            )}
            {...props}
        >
            {/* Joker name */}
            <div className={cn('text-sm font-bold text-center mb-2', rarityTextColor)}>
                {joker.name}
            </div>

            {/* Level indicator */}
            <div className={cn('text-xs mb-2', rarityTextColor)}>
                Level {joker.level}
            </div>

            {/* Effect description */}
            <div className="text-xs text-center flex-1">
                {joker.effect}
            </div>
        </BaseSelectable>
    )
} 