It's great that we can create and list Artist records using our API now. What if we wanted to update a record? Maybe there is a typo in the Artist name, or you want to change the genre of an artist record. That sounds like a job for the HTTP `PUT` or `PATCH` verbs.

Both of these methods are typically used to edit or update a resource in slightly different ways:

- The `PUT` HTTP request method is typically used to signify a **total** replacement of a resource
  - The data in the database would be totally replaced with the data sent in the request body
- The `PATCH` HTTP request method is typically used to signify a **partial** replacement of a resource
  - The data in the database would be merged with the data sent in the request body.

So given an artist record:

```json
{
  "_id": "123",
  "name": "Frank Sinatra",
  "genre": "Easy Listening"
}
```

If we sent the following request payload with a `PUT` request

```json
{
  "genre": "Jazz"
}
```

then you would expect the artist record after the update to look like this:

```json
{
  "_id": "123",
  "name": null,
  "genre": "Jazz"
}
```

Note that the `name` field has been removed, because it was not in the request body, and we have totally overwritten the stored data.

If the same request body was sent in a `PATCH` request however, you would expect the artist record after the update to look like this:

```json
{
  "_id": "123",
  "name": "Frank Sinatra",
  "genre": "Jazz"
}
```

Here, only part of the data has been updated - the part that was sent in the request.

---

:question:

**What pros and cons can you think of for using partial updates (PATCH) versus complete overwrites (PUT)?**

---

For our api we need to decide if we want to handle updates with a `PUT` or a `Patch` request. The `PUT` is easier to implement, but requires the user to send the entire Artist back to the api. Meanwhile, the `PATCH` request is easier for clients to use, but is more difficult to implement.

Start by adding a new test file: `artist-update.test.js`. Then choose which method you want to use for your api.

## PUT /artists

```js
// test/artist-update.test.js
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

  describe('PUT /artists/{id}', () => {
    it('replaces the artist and returns the updated record', async () => {
      const { status, body } = await request(app).put(`/artists/${artist.id}`).send({ name: 'something different', genre: 'different genre' })

      expect(status).to.equal(200)

      expect(body).to.deep.equal({ id: artist.id, name: 'something different', genre: 'different genre' })
    })
  })
})
```

To solve this test you will need to create a new controller and route for your application.

Your new controller will need to `UPDATE` the artist with the new `name` and `genre` that the user has sent in the request `body`, make sure to add a `WHERE` clause so that only the artist with the `id` which matches the one sent in `req.params`.

Once this tests passes, add another test which attempts to update an artist which does not exist. It should expect to receive a `404` status code in the response.

There is a solution to this challenge [here](https://hackmd.io/QgVK_T4pQSKsKxDnwQ1wrg).

##  PATCH /artists

```js
// test/artist-update.test.js
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
})
```

Handling this type of request is a bit more complex. We essentially need to check which properties are present in the `request body` and select the correct `postgresql` string before passing it into the `db.query` function. You may find it useful to use an if statement to check if either `name` or `genre` is `falsy`

Once this tests passes, add another test which attempts to update an artist which does not exist. It should expect to receive a `404` status code in the response.

There is a solution to this test [here](https://hackmd.io/R9YDkNPyQpi8Pn40cP53zA)
