const { expect } = require('chai')
const request = require('supertest')
const db = require('../src/db')
const app = require('../src/app')

describe('Create Album', () => {
  let artist
  beforeEach(async () => {
    const { rows: [ artistData ] } = await db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
      'Tame Impala',
      'rock',
    ])

    artist = artistData
  })

  it('creates a new album under the artist', async () => {
    const { status, body } = await request(app).post(`/artists/${artist.id}/albums`).send({
      name: 'Inner Speaker',
      year: 2010,
    })    

    expect(status).to.equal(201)
    expect(body.name).to.equal('Inner Speaker')

    const { rows: [ artistData ] } = await db.query(
      `SELECT * FROM Albums WHERE id = ${body.id}`
    )
    expect(artistData.name).to.equal('Inner Speaker')
    expect(artistData.year).to.equal(2010)
    expect(artistData.artist_id).to.equal(artist.id)
  })


  it('returns a 404 if the album does not exist', async () => {
    const { status, body } = await request(app).post('/artists/999999999/albums').send({
      name: 'Inner Speaker',
      year: 2010,
    }) 

    expect(status).to.equal(404)
    expect(body.message).to.equal('artist 999999999 does not exist')
  })
})