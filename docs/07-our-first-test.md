It's time to start writing some tests! The type of tests that we will be writing are called `integration tests`. This is where our tests are checking that our application is communicating with external services (in this case a database) in the way we expect. 

Integration tests sit above `unit tests` in the `testing pyramid`. We don't need to write as many, but they are slower and more complex. We are opting to use them here to help build a solid understanding of the relationship between web app and database.

You can read more about the testing pyramid [here](https://www.codecademy.com/articles/tdd-testing-pyramid).

## Our First Test

We will keep our first test simple for now. We will `POST` an object containing a `name` and a `genre` to `/artists` and expect a `201` status in return.

To keep our test files easier to maintain, we will split them up according to the `CRUD` operation they are testing.

As we are testing `create` operations on the `Artist` table first, we should make a file called `tests/artist-create.test.js`:

```js
// tests/artist-create.js
const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');

describe('create artist', () => {
  describe('/artists', () => {
    describe('POST', () => {
      it('creates a new artist in the database', async () => {
        const res = await request(app).post('/artists').send({
          name: 'Tame Impala',
          genre: 'rock',
        });

        expect(res.status).to.equal(201);
      });
    });
  });
});
```

It should be fairly trivial to pass this test with a controller function in your `app.js`, however, we expect this app to grow in size and complexity as we add features. If we put all our code in `app.js`, it will quickly become unmaintainable.

Good practice says we should separate our app into routers and controllers.

You will need to:

1. Create a `src/controllers/artist.js` file and write a controller function which returns a `201` status code.

1. Import your controller into a `src/routes/artist.js` router and define a `POST /` route to connect to your controller.

1. Import your `artistRouter` into `app.js` and direct all `/artists` to your `artistController`.

Refer to your `express basics` project if you need a quick refresh on creating `routers` and `controllers`.

Once this test is passing, commit and push your code to Github.

There is a solution to this challenge [here](https://hackmd.io/@manchester-codes/rJyWmTQr_)

