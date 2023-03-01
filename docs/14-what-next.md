Well done! That's all the `CRUD` operations working :tada:

## Still have some time?

Can you add a new table and `CRUD` operations to the app?

- Start by adding an `Album` table to the database. You can do this by adding another migration file to your repository.

- Your `Album` table will need `id`, `name` and `year` columns. To keep things simple, year can be an `int`.

- Albums will also need to be able to reference the artist that released them. Add another column to your table called `artistId`. It should be a `foreign key` which references the `Artist` table.

- Write a test file called `album-create.test.js`. It will be very similar to the `artist-create.test.js` file.

- The test should `POST` to `/artists/:id/albums` to create a new album associated to that artist. You will need to make sure there is an artist in your database before you try and create an album.

- The rest of the `CRUD` tests should send their requests to either `/albums` or `/albums/:id`. Plan your routers accordingly.

## Finished?

Let us know on Slack and ask for a code review.
