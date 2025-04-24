import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip.tsx'
import { LoginNotifications } from '#app/components/login-notifications.tsx'
import { cn } from '#app/utils/misc.tsx'
import { type Route } from './+types/index.ts'

export const meta: Route.MetaFunction = () => [{ title: 'Scatterhand' }]

export default function Index() {
	return (
		<main className="font-poppins grid h-full place-items-center">
			<div className="grid place-items-center px-4 py-16 xl:grid-cols-1 xl:gap-24">
				<div className="flex max-w-md flex-col items-center text-center">
					<h1
						data-heading
						className="animate-slide-top text-foreground xl:animate-slide-left mt-8 text-4xl font-medium [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-5xl xl:mt-4 xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]"
					>
						Scatterhand
					</h1>
					<p
						data-paragraph
						className="animate-slide-top text-muted-foreground xl:animate-slide-left mt-6 text-xl/7 [animation-delay:0.8s] [animation-fill-mode:backwards] xl:mt-8 xl:text-xl/6 xl:leading-10 xl:[animation-delay:1s] xl:[animation-fill-mode:backwards]"
					>
						Welcome to Scatterhand - Get ready to play!
					</p>
				</div>
			</div>
			<LoginNotifications />
		</main>
	)
}
