// RFC 10008 §2.7: the key MUST include the content. Run: node cache-key.mjs
import { createHash } from 'node:crypto'

const key = (...parts) =>
  createHash('sha256').update(parts.join('\n')).digest('hex').slice(0, 8)

// allowed: ignore what does not change the meaning (key order)
const canonical = q => JSON.stringify(q, Object.keys(q).sort())
// wrong: keep only the fields this cache knows, so `role` is lost
const lossy = ({ q, limit }) => JSON.stringify({ q, limit })

const admins = { q: 'a', limit: 10, role: 'admin' }
const users = { role: 'user', limit: 10, q: 'a' }

for (const norm of [canonical, lossy]) {
  const k1 = key('QUERY', '/users/search', 'application/json', norm(admins))
  const k2 = key('QUERY', '/users/search', 'application/json', norm(users))
  const verdict = k1 === k2 ? 'SAME KEY' : 'distinct'
  console.log(norm.name.padEnd(10), k1, k2, verdict)
}
