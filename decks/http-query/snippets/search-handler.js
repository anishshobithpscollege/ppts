// excerpt: QUERY content is untrusted input, like any other
async function searchUsers(user, query) {
  if (!user.roles.includes('admin')) // read-only is not "allowed"
    throw new HttpError(403)
  const limit = Math.min(Number(query.limit) || 20, 100) // cost cap
  return db.query(`SELECT email FROM users WHERE email LIKE '%${query.q}%'`)
  return db.query('SELECT email FROM users WHERE email LIKE $1 LIMIT $2',
    [`%${query.q}%`, limit], { timeout: 2000 })
}
