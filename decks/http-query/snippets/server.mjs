// A QUERY endpoint that follows RFC 10008 (sections in the comments).
// Run: node server.mjs   then try client.sh, client.mjs or client.py
import { createServer } from 'node:http'

const JSON_TYPE = 'application/json'
const Allow = 'GET, QUERY, OPTIONS'
const CONTACTS = [
  { surname: 'Smith', givenname: 'John', email: 'smith@example.org' },
  { surname: 'Jones', givenname: 'Sally', email: 'sally.jones@example.com' },
  { surname: 'Dubois', givenname: 'Camille', email: 'camille.dubois@example.net' },
]
const stored = new Map() // URI -> query: the "equivalent resource" (§2.2)

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') // discovery, Appendix A.2 and A.3
    return send(res, 204, null, { Allow, 'Accept-Query': JSON_TYPE })
  if (req.method === 'GET' && stored.has(req.url)) // GET the Location, §2.4
    return send(res, 200, search(stored.get(req.url)))
  if (req.method !== 'QUERY')
    return send(res, 405, null, { Allow })
  const type = req.headers['content-type']?.split(';')[0].trim()
  if (!type) // §2: MUST fail
    return send(res, 400, { error: 'Content-Type is required' })
  if (type !== JSON_TYPE) // §2.1 and §3
    return send(res, 415, null, { 'Accept-Query': JSON_TYPE })
  let query
  try { query = JSON.parse(await readBody(req, 16 * 1024)) }
  catch { return send(res, 400, { error: 'not valid JSON' }) } // no sniffing
  if (typeof query.q !== 'string') // §2.1: understood, cannot run
    return send(res, 422, { error: '"q" must be a string' })
  const location = `/contacts/stored-queries/${stored.size + 1}`
  stored.set(location, query)
  send(res, 200, search(query), { Location: location })
}).listen(8787, () => console.log('listening on :8787'))

function search({ q, limit = 10 }) {
  const n = Math.min(Number(limit) || 10, 100) // cost cap: safe is not cheap
  return CONTACTS.filter(c => c.email.includes(q)).slice(0, n)
}

function send(res, status, body, headers = {}) {
  if (body !== null)
    headers['Content-Type'] = JSON_TYPE
  res.writeHead(status, headers)
  res.end(body === null ? undefined : `${JSON.stringify(body)}\n`)
}

async function readBody(req, max) {
  let text = ''
  for await (const chunk of req) {
    text += chunk
    if (text.length > max)
      throw new Error('too large')
  }
  return text
}
