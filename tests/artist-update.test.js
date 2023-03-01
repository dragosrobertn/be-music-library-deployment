const { expect } = require('chai')
const request = require('supertest')
const db = require('../src/db')
const app = require('../src/app')

describe('Update Artist', () => {
  let artist
  beforeEach(async () => {
    const { rows } = await db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
      'Tame Impala',
      'rock',
    ])

    artist = rows[0]
  })

  describe('PATCH /artists/{id}', () => {
    it('updates the artist and returns the updated record', async () => {
      const { status, body } = await request(app).patch(`/artists/${artist.id}`).send({ name: 'something different', genre: 'rock' })

      expect(status).to.equal(200)

      expect(body).to.deep.equal({ id: artist.id, name: 'something different', genre: 'rock' })
    })

    it('returns a 404 if the artist does not exist', async () => {
      const { status, body } = await request(app).patch('/artists/999999999').send({ name: 'something different', genre: 'rock' })

      expect(status).to.equal(404)
      expect(body.message).to.equal('artist 999999999 does not exist')
    })
  })

  describe('PUT /artists/{id}', () => {
    it('replaces the artist and returns the updated record', async () => {
      const { status, body } = await request(app).put(`/artists/${artist.id}`).send({ name: 'something different', genre: 'different genre' })

      expect(status).to.equal(200)

      expect(body).to.deep.equal({ id: artist.id, name: 'something different', genre: 'different genre' })
    })

    it('returns an error if name is null', async () => {
      const { status, body } = await request(app).put(`/artists/${artist.id}`).send({
        genre: 'rock'
      })    

      expect(status).to.equal(400)
      expect(body.errors).to.contain('"name" is required')
    })

    it('returns an error if genre is null', async () => {
      const { status, body } = await request(app).put(`/artists/${artist.id}`).send({
        name: 'Tame Impala'
      })    

      expect(status).to.equal(400)
      expect(body.errors).to.contain('"genre" is required')
    })

    it('returns an error if name is empty', async () => {
      const { status, body } = await request(app).put(`/artists/${artist.id}`).send({
        name: '',
        genre: 'rock'
      })

      expect(status).to.equal(400)
      expect(body.errors).to.contain('"name" is not allowed to be empty')
    })

    it('returns an error if genre is empty', async () => {
      const { status, body } = await request(app).put(`/artists/${artist.id}`).send({
        name: 'Tame Impala',
        genre: ''
      })    

      expect(status).to.equal(400)
      expect(body.errors).to.contain('"genre" is not allowed to be empty')
    })

    it('returns a 404 if the artist does not exist', async () => {
      const { status, body } = await request(app).put('/artists/999999999').send({ name: 'something different', genre: 'rock' })

      expect(status).to.equal(404)
      expect(body.message).to.equal('artist 999999999 does not exist')
    })
  })
})