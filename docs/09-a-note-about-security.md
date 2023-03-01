So far we have be manually building `SQL` strings and passing them to `db.query()`.

This is fine if we are the ones setting the data we are sending to the database, but in publicly accessible web app, it leaves us open to a type of attack called `SQL injection`.

## SQL Injection

![](https://imgs.xkcd.com/comics/exploits_of_a_mom.png)

`SQL injection` is an attack where a `malicious actor` will attempt to manipulate our database by getting it to evaluate a text input as a `SQL statement`.

It is also one of the most common types of attack on the internet.

- **Read** [:books: Preventing SQL Injection in Node.js](https://www.veracode.com/blog/secure-development/how-prevent-sql-injection-nodejs)

To guard against this, `pg` has a means of auto-escaping any data we add into our sql statements like so:

```js
// src/controllers/artist.js
...
exports.createArtist = async (req, res) => {
  const { name, genre } = req.body

  try {
    const { rows: [ artist ] } = await db.query('INSERT INTO Artists (name, genre) VALUES ($1, $2) RETURNING *', [name, genre])
    res.status(201).json(artist)
  } catch (err) {
    res.status(500).json(err.message)
  }
}
...
```

We put a `$1` at the first point where we want to add a variable to our statement, and `$2` for the second, `$3` for the third etc. Then we provide those variables in an array as the second argument to `db.query()`. `pg` then automatically `escapes` any strings that are being passed into the statement, thereby preventing any `malicious SQL` being executed by the database.

Take some time to alter your controller function now, and commit the changes to Github.

Or see if you can hack your own database through your app...