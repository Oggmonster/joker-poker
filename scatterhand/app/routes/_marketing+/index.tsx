
import { type Route } from './+types/index.ts'
import { useSocket } from '#app/utils/useSocket.ts'
import { Button } from '#app/components/ui/button.tsx'
import { useEffect, useRef, useState } from 'react'
import { Spacer } from '#app/components/spacer.tsx'
import { Input } from '#app/components/ui/input.tsx'
import { useOptionalUser } from '#app/utils/user.ts'

export const meta: Route.MetaFunction = () => [{ title: 'Scatterhand' }]

export default function Index() {
	const user = useOptionalUser()
	const { emit, on, off, socket } = useSocket()
	const [message, setMessage] = useState('')
	const [welcomeMessages, setWelcomeMessages] = useState<Array<{ id: number; message: string }>>([])
	
	const handleHello = () => {
		console.log('Sending hello')
		emit('hello', { message: `${user?.username ?? 'Someone'} said: ${message}` })		
		setWelcomeMessages(prev => [...prev, { 
			id: Date.now(), 
			message: `${user?.username ?? 'You'} said: ${message}` 
		}])	
		setMessage('') // Clear input after sending
	}

	useEffect(() => {
		if (!socket) return;

		const handleWelcome = (data: { message: string; username?: string }) => {
			console.log('Received welcome:', data)
			const newMessage = {
				id: Date.now(),
				message: data.message,
			}
			setWelcomeMessages(prev => [...prev, newMessage])
		}

		console.log('Setting up welcome listener')
		socket.on('welcome', handleWelcome)

		return () => {
			console.log('Cleaning up welcome listener')
			socket.off('welcome', handleWelcome)
		}
	}, [socket]) // Only depend on the socket instance

	const sortedMessages = welcomeMessages.sort((a, b) => b.id - a.id)

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
			
			<div className="w-full max-w-md mx-auto flex flex-col items-center">
				<div className="flex flex-col gap-2 w-full">
					<label htmlFor="message-input" className="text-sm font-medium">Say hello</label>
					<div className="flex gap-2">
						<Input 
							id="message-input" 
							aria-label='Message' 
							type="text" 
							value={message} 
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter' && message.trim()) {
									handleHello()
								}
							}}
						/>
						<Button 
							onClick={handleHello} 
							variant="default"
							disabled={!message.trim()}
						>
							Send
						</Button>
					</div>
				</div>
				<Spacer size="xs" />
				<div className="w-full">
					<h3 className="text-lg font-semibold mb-3 text-center">Start page banter</h3>
					{welcomeMessages.length > 0 ? (
						<ul className="space-y-2">
							{sortedMessages.map(msg => (
								<li 
									key={msg.id}
									className="p-3 bg-muted rounded-lg animate-slide-left"
								>
									{msg.message}
								</li>
							))}
						</ul>
					) : (
						<p className="text-center text-muted-foreground">No greetings yet. Be the first to say hello!</p>
					)}
				</div>
			</div>
		</main>
	)
}
