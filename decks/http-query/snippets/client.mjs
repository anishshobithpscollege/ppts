const url = 'http://localhost:8787/contacts'
const res = await fetch(url, {
  method: 'QUERY', // upper case: not normalised
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ q: 'example', limit: 10 }),
})
console.log(res.status, res.headers.get('Location'))
