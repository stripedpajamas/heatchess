import ndjsonStream from 'can-ndjson-stream'

const TOKEN = process.env.LICHESS_API_TOKEN

export function onGamePage (loc) {
  const { pathname } = loc
  return /\/\w{8}/.test(pathname)
}

export function getGameId (loc) {
  return loc.pathname.slice(1)
}

export async function getGameStream (gameId) {
  const response = await fetch(`https://lichess.org/api/board/game/stream/${gameId}`, {
    headers: {
      authorization: `Bearer ${TOKEN}`
    }
  })
  const jsonStream = ndjsonStream(response.body)
  return jsonStream.getReader()
}