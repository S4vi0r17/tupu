import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from './config.ts'

const client = postgres(config.DATABASE_URL, { max: 10 })

export const db = drizzle(client)

export const closeDb = () => client.end()
