const { expect } = require('chai')
const request = require('supertest')
const db = require('../src/db')
const app = require('../src/app')

describe('Create Artist', () => {
  describe('POST /artists', () => {
    it('creates a new artist in the database', async () => {
      const { status, body } = await request(app).post('/artists').send({
        name: 'Tame Impala',
        genre: 'rock',
      })    

      expect(status).to.equal(201)
      expect(body.name).to.equal('Tame Impala')
      expect(body.genre).to.equal('rock')

      const { rows: [ artistData ] } = await db.query(
        `SELECT * FROM Artists WHERE id = ${body.id}`
      )
      expect(artistData.name).to.equal('Tame Impala')
      expect(artistData.genre).to.equal('rock')
    })

    it('returns an error if name is null', async () => {
      const { status, body } = await request(app).post('/artists').send({
        genre: 'rock'
      })    

      expect(status).to.equal(400)
      expect(body.errors).to.contain('"name" is required')
    })

    it('returns an error if genre is null', async () => {
      const { status, body } = await request(app).post('/artists').send({
        name: 'Tame Impala'
      })    

      expect(status).to.equal(400)
      expect(body.errors).to.contain('"genre" is required')
    })

    it('returns an error if name is empty', async () => {
      const { status, body } = await request(app).post('/artists').send({
        name: '',
        genre: 'rock'
      })

      expect(status).to.equal(400)
      expect(body.errors).to.contain('"name" is not allowed to be empty')
    })

    it('returns an error if genre is empty', async () => {
      const { status, body } = await request(app).post('/artists').send({
        name: 'Tame Impala',
        genre: ''
      })    

      expect(status).to.equal(400)
      expect(body.errors).to.contain('"genre" is not allowed to be empty')
    })
  })
})