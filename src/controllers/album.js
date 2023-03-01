const db = require('../db')
const { foreignKeyViolation } = require('../utils/postgres-errors')

exports.createAlbum = async (req, res) => {
  const { id } = req.params
  const { name, year } = req.body

  try {
    const { rows: [ album ] } = await db.query('INSERT INTO Albums (name, year, artist_id) VALUES ($1, $2, $3) RETURNING *', [name, year, id])
    res.status(201).json(album)
  } catch (err) {
    switch (err.code) {
    case foreignKeyViolation:
      res.status(404).json({ message: `artist ${id} does not exist` })
      break
    default:
      res.status(500).json(err.message)
      break
    }
  }
}