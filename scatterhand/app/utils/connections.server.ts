// import { createCookieSessionStorage } from 'react-router'
import { type ProviderName } from './connections.tsx'
import { type AuthProvider } from './providers/provider.ts'
import { type Timings } from './timing.server.ts'

export const providers: Record<ProviderName, AuthProvider> = {}

export function handleMockAction(providerName: ProviderName, request: Request) {
	return providers[providerName].handleMockAction(request)
}

export function resolveConnectionData(
	providerName: ProviderName,
	providerId: string,
	options?: { timings?: Timings },
) {
	return providers[providerName].resolveConnectionData(providerId, options)
}
