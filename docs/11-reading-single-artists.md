We can now serve a list of all artists to the client. What if the client wants to find out the details of a single artist? They could retrieve the entire list and search through it themselves - but we can make the process much more efficient by adding a new endpoint to get the desired records directly from the database.

Start by adding new tests to `tests/artist-read.test.js`:

```js
// artist-read.test.js
...
  describe('GET /artists/{id}', () => {
    it('returns the artist with the correct id', async () => {
      const { status, body } = await request(app).get(`/artists/${artists[0].id}`).send()

      expect(status).to.equal(200)
      expect(body).to.deep.equal(artists[0])
    })

    it('returns a 404 if the artist does not exist', async () => {
      const { status, body } = await request(app).get('/artists/999999999').send()

      expect(status).to.equal(404)
      expect(body.message).to.equal('artist 999999999 does not exist')
    })
  })
...
```

The first test is just looking to see if the returned artist details match artist `0` from the `artists` array.

The second test is asking for an artist that doesn't exist, and expects to get a `404` status code back.

## Getting an artist by Id

Passing this test shouldn't be too difficult. You will need to start by defining a new `GET` route which matches path `/artists/:id`. You'll then need to write a controller which uses `db.query()` to `SELECT` everything from the artist table `WHERE` the `id` matches `req.params.id`.

There is a `gotcha` in this challenge, `db.query()` will still return single results in an array. To pass the test you will need to remove it from the array before you send the data in the response.

## Returning a 404

To pass this test, you will need to check the `truthyness` of the artist after you get it from the database. If it is `truthy` then send it back to the user as normal. If the artist is `falsy`, you will need to send a `404` status code instead.

You can see a solution to these two challenges [here](https://hackmd.io/WU9oZzkfT0KdZUE9GAK3sA).

