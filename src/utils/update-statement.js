module.exports = (table, data, id) => {
  const keys = Object.keys(data)
  const params = []
  let query = `UPDATE ${table} SET`

  keys.forEach((key, index) => {
    query += index > 0 ? `, ${key} = $${index + 1}` : ` ${key} = $${index + 1}`
    params.push(data[key])
  })

  query += ` WHERE id = $${params.length + 1} RETURNING *`

  params.push(id)

  return {
    query,
    params
  }
}