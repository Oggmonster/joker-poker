import { Form } from 'react-router'
import { z } from 'zod'
import { Icon } from '#app/components/ui/icon.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { useIsPending } from './misc.tsx'

export const providerNames = [] as const

export type ProviderName = (typeof providerNames)[number]

export function ProviderConnectionForm({
	type,
	providerName,
	redirectTo,
}: {
	type: 'Connect' | 'Login' | 'Signup'
	providerName: ProviderName
	redirectTo?: string | null
}) {
	const isPending = useIsPending()

	return (
		<Form
			className="flex items-center justify-center gap-2"
			action={`/auth/${providerName}`}
			method="POST"
		>
			{redirectTo ? (
				<input type="hidden" name="redirectTo" value={redirectTo} />
			) : null}
			<StatusButton
				type="submit"
				className="w-full"
				status={isPending ? 'pending' : 'idle'}
			>
				<Icon name={providerName}>
					{type} with {providerName}
				</Icon>
			</StatusButton>
		</Form>
	)
}
