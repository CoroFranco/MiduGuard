import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

const db = createClient({
  url: 'libsql://miduguard-elpsycoro.aws-us-east-1.turso.io',
  authToken: process.env.DB_TOKEN,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { content } = body

    const result = await db.execute({ sql: content })
    return NextResponse.json({ rows: result.rows })
  } catch (error) {
    console.error('DB error:', error)
    return NextResponse.json({ error: 'Error ejecutando query' }, { status: 500 })
  }
}
