import { faker } from '@faker-js/faker'
import { prisma } from '#app/utils/db.server.ts'
import { MOCK_CODE_GITHUB } from '#app/utils/providers/constants'
import {
	createPassword,
	createUser,
	getNoteImages,
	getUserImages,
} from '#tests/db-utils.ts'
import { insertGitHubUser } from '#tests/mocks/github.ts'

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	console.time('👑 Creating roles...')
	await prisma.role.upsert({
		where: { name: 'admin' },
		update: {
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'any' },
				}),
			},
		},
		create: {
			name: 'admin',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'any' },
				}),
			},
		},
	})
	await prisma.role.upsert({
		where: { name: 'user' },
		update: {
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'own' },
				}),
			},
		},
		create: {
			name: 'user',
			permissions: {
				connect: await prisma.permission.findMany({
					select: { id: true },
					where: { access: 'own' },
				}),
			},
		},
	})
	console.timeEnd('👑 Creating roles...')

	console.time('🐨 Creating admin user "martin"')
	const admin = await prisma.user.create({
		select: { id: true },
		data: {
			email: 'martin@wonderlab.se',
			username: 'martin',
			name: 'Admin',
			password: { create: createPassword('ScatterDreams') },
			roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
		},
	})
	console.timeEnd('🐨 Creating admin user "martin"')

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})