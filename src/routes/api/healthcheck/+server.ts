import { json } from '@sveltejs/kit'

export async function GET() {
  return json({
    message: 'Server is up and running!'
  })
}