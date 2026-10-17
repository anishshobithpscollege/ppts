import { createServer } from 'node:http'

const server = createServer(async (req, res) => {
  const chunks = []
  for await (const c of req) chunks.push(c)
  const body = Buffer.concat(chunks).toString()
  console.log(`server saw: ${req.method} ${req.url} ct=${req.headers['content-type']} body=${body}`)
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { Allow: 'GET, QUERY, OPTIONS, HEAD', 'Accept-Query': 'application/json' })
    return res.end()
  }
  if (req.method !== 'QUERY') {
    res.writeHead(405, { Allow: 'GET, QUERY, OPTIONS, HEAD' })
    return res.end()
  }
  if (!req.headers['content-type']) { res.writeHead(400); return res.end('missing Content-Type\n') }
  if (!req.headers['content-type'].startsWith('application/json')) {
    res.writeHead(415, { 'Accept-Query': 'application/json' }); return res.end()
  }
  res.writeHead(200, { 'Content-Type': 'application/json', Location: '/feed/queries/42' })
  res.end(JSON.stringify({ method: req.method, got: JSON.parse(body) }) + '\n')
})
server.listen(8787, () => console.log('listening'))
