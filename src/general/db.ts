import {createClient} from '@libsql/client'


const db = createClient({
  url:'libsql://miduguard-elpsycoro.aws-us-east-1.turso.io',
  authToken: process.env.DB_TOKEN
})

export async function insertMessage(content: string) {
  console.log(process.env.CLERK_SECRET_KEY)
  const result = await db.execute({
    sql: content,
  });
  return result.rows;
}



