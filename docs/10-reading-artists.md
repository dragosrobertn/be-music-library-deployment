We have implemented a `POST` endpoint for creating `Artist` records, but without the ability to handle `GET` requests, our app has no way to retrieve those records.

Lets make a new test file called `src/tests/artist-read.test.js`:

```js
// tests/artist-read.test.js
const { expect } = require('chai')
const request = require('supertest')
const db = require('../src/db')
const app = require('../src/app')

describe('Read Artists', () => {
  let artists
  beforeEach(async () => {
    const responses = await Promise.all([
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Tame Impala',
        'rock',
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Kylie Minogue',
        'pop',
      ]),
      db.query('INSERT INTO Artists (name, genre) VALUES( $1, $2) RETURNING *', [
        'Tame Antelope',
        'jazz',
      ]),
    ])

    artists = responses.map(({ rows }) => rows[0])
  })

  describe('GET /artists', () => {
    it('returns all artist records in the database', async () => {
      const { status, body } = await request(app).get('/artists').send()

      expect(status).to.equal(200)
      expect(body.length).to.equal(3)

      body.forEach((artistRecord) => {
        const expected = artists.find((a) => a.id === artistRecord.id)

        expect(artistRecord).to.deep.equal(expected)
      })
    })
  })
})
```

### beforeEach

Like our last test file, we are using the `beforeEach` hook to establish a connection to the database before each test.

Unlike the other tests, for these tests we also need to have some data in the `Artist` table before the tests run. This is done by the `Promise.all()` method, which will resolve an array of `promises`. In this case an array of `db.query()` functions.

After these promises have resolved, we are querying the database again to get all the artists, and storing them in a variable called `artists`.

The `artists` variable is declared as a `let` outside of the `beforeEach` so that it is in the same `scope` as the tests.

### The Test

The test itself is fairly straightforward. It sends a `GET` request to `/artists` and expects a `200` response.

It then expects the `response body` to be an array containing 3 elements.

Finally, it checks if each item in the response body matches an item in the artists array.

## Challenge

To get started passing this test, you will need to:

1. Run the test and confirm that it fails. It will complain that it received a `404` status when it expected a `201`.

1. Start by writing a `read` function in your `src/controllers/artist.js` file. For now just have it return a `200` status code in the response.

1. Add a `router.get('/', artistController.read)` route to your `src/routes/artist.js`. If you run your test again, it will still fail, but this time it will be because we aren't returning anything in the `response body`. Progress!

1. Now that we know the controller function is receiving requests, get a connection to the database the same way you did for the `create` controller.

1. Use `db.query()` to `SELECT` all the artists from the `Artist` table. It will return a `response` object with a `rows` property. The `beforeEach` hook in the tests provides an example on how to use destructuring syntax to extract the data we want from the return values.

1. Change your controller to return the artists to the user. Run your tests again to see if they pass.

You can find a solution to this challenge [here](https://hackmd.io/VNS_utbuSvCTIvdCpZHvDg)
