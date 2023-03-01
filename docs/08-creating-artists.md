You have probably realized that our test doesn't actually assert that we are doing what we say we are doing. To do that we will need to check the `response body`, and also check the expected data is in the database.

Our utility scripts connects to the `database server` before and after the tests have run. Our app however only needs to connect to one specific `database` within the `server`.

For our app to connect to the database, we will define a `db service`.

1. Create a new file `src/db/index.js`

    ```js
    const { Pool } = require('pg')

    const pool = new Pool()

    module.exports = {
      query: (text, params) => pool.query(text, params)
    }
    ```

    This exports an `async function` that we can use to connect to the database in other parts of our app.

    Now that we have a way to connect to the database within the app, we can modify our tests:

    ```js
    const { expect } = require('chai');
    const request = require('supertest');
    const db = require('../src/db');
    const app = require('../src/app');

    describe('create artist', () => {
      describe('/artists', () => {
        describe('POST', () => {
          it('creates a new artist in the database', async () => {
            const { status, body } = await request(app).post('/artists').send({
              name: 'Tame Impala',
              genre: 'rock',
            });

            expect(status).to.equal(201);
            expect(body.name).to.equal('Tame Impala');
            expect(body.genre).to.equal('rock');

            const {
              rows: [artistData],
            } = await db.query(`SELECT * FROM Artists WHERE id = ${body.id}`);
            expect(artistData.name).to.equal('Tame Impala');
            expect(artistData.genre).to.equal('rock');
          });
        });
      });
    });
    ```

We are also going to want to delete all of the artists in our database after each test. To do this we can use a `global afterEach hook`. To do this, create a new file in your `tests` folder called `helper.js`. Mocha will automatically detect this file and run the code before all of our other tests.

  ```js
    const db = require('../src/db')

    afterEach(async () => {
      await db.query('TRUNCATE Artists CASCADE')
    })
  ```

Our test suite has had a big jump in complexity, let's go over it to understand the role of the lines we added.

1. The `afterEach` hook will delete all the records in the `Artists` table after each test has run, and close the database connection.

1. The test will now query the database to see if there is an artist in the `Artists` table, and check it contains the data we expect.

Now if you run the tests, they will fail because we still need to...

## Create the Artist Table

In order to write and read data from a table, that table needs to exist. Luckily we already have a script that connects to our `database server` before our app runs.

We could alter the `create-database.js` script to also create our tables, but in industry we use [migrations](https://www.cloudbees.com/blog/database-migration) to manage changes to the structure of our database.

Migrations are best thought of as a series of scripts which are run in a database exactly once. We run them when we want to set up a new database, or when we add a new feature to an existing database.

To make your first migration script, create a `migrations` folder with a `01-create-artist-table.sql` file inside it. We will start each file with a number so we know which order to run them in.

  ```sql
  -- migrations/01-create-artist-table.sql
  CREATE TABLE Artists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  genre VARCHAR(255) NOT NULL
  );
  ```

Next we need code to actually run our migration scripts. For this project we will be using the [postgres-migrations](https://www.npmjs.com/package/postgres-migrations) module. As we will require this in our production environment it should be saved as a dependency:

  ```
  npm i -S postgres-migrations
  ```

  We will use this module in a script that we will run before our app starts, and before we run our tests. Create a new file in your `scripts` folder called `migrate.js`

  ```js
  // scripts/migrate.js
  const { migrate } = require('postgres-migrations')
  const path = require('path')

  const { NODE_ENV } = process.env

  // This code is repeated a few times in our scripts. Can you factor it out into a shared helper function?
  if (NODE_ENV != 'production') {
    const args = process.argv.slice(2)[0]

    const envFile = args === 'test' ? '../.env.test' : '../.env'
    
    require('dotenv').config({
      path: path.join(__dirname, envFile),
    })
  }

  const { PGUSER, PGHOST, PGPASSWORD, PGDATABASE, PGPORT } = process.env

  const config = {
    database: PGDATABASE,
    user: PGUSER,
    password: PGPASSWORD,
    host: PGHOST,
    port: parseInt(PGPORT),
    ensureDatabaseExists: true,
    defaultDatabase: PGDATABASE
  }

  const migrateDB = async (config) => {

    console.log('Migrating Database...')

    const output = await migrate(config, './migrations')

    if (!output.length) {
      console.log('Database already up to date!')
    } else {
      console.log(output)
    }
  }

  try {
    migrateDB(config)
  } catch (err) {
    console.log(err)
  }
  ```

  Next add a `migrate` script to your `package.json`, and then alter your `prestart` and `pretest` scripts so that they also run the migrate script like so:

  ```json
  ...
    "scripts": {
    "migrate": "node scripts/migrate.js",
    "prestart": "node scripts/create-database.js && npm run migrate",
    "start": "nodemon -r dotenv/config index.js",
    "pretest": "node scripts/create-database.js test && npm run migrate test",
    "test": "mocha tests/**/*.js --exit --recursive --timeout 60000 --file ./tests/test-setup.js",
    "posttest": "node scripts/drop-database.js test"
  },
  ...
  ```

  If you run your application now you should seen an output like this:

  ```
  Migrating Database...
  [
    {
      id: 0,
      name: 'create-migrations-table',
      contents: 'CREATE TABLE IF NOT EXISTS migrations (\n' +
        '  id integer PRIMARY KEY,\n' +
        '  name varchar(100) UNIQUE NOT NULL,\n' +
        "  hash varchar(40) NOT NULL, -- sha1 hex encoded hash of the file name and contents, to ensure it hasn't been altered since applying the migration\n" +
        '  executed_at timestamp DEFAULT current_timestamp\n' +
        ');\n',
      fileName: '0_create-migrations-table.sql',
      hash: 'e18db593bcde2aca2a408c4d1100f6abba2195df',
      sql: 'CREATE TABLE IF NOT EXISTS migrations (\n' +
        '  id integer PRIMARY KEY,\n' +
        '  name varchar(100) UNIQUE NOT NULL,\n' +
        "  hash varchar(40) NOT NULL, -- sha1 hex encoded hash of the file name and contents, to ensure it hasn't been altered since applying the migration\n" +
        '  executed_at timestamp DEFAULT current_timestamp\n' +
        ');\n'
    },
    {
      id: 1,
      name: 'create-artist-table',
      contents: 'CREATE TABLE Artists (\n' +
        '  id SERIAL PRIMARY KEY,\n' +
        '  name VARCHAR(255) NOT NULL,\n' +
        '  genre VARCHAR(255) NOT NULL\n' +
        ');',
      fileName: '01-create-artist-table.sql',
      hash: 'e88bbdfec3325eabda8ae8a5a1025b90c53b9077',
      sql: 'CREATE TABLE Artists (\n' +
        '  id SERIAL PRIMARY KEY,\n' +
        '  name VARCHAR(255) NOT NULL,\n' +
        '  genre VARCHAR(255) NOT NULL\n' +
        ');'
    }
  ]
  ```

The `postgres-migrations` module has created a `migrations` table to keep track of which scripts it has run, followed by our `create-artist-table` script. If you use `ctrl + c` to exit your app and run it again you will see that the migration script knows that all of our migrations have already run (it is `idempotent`). You can also use pgAdmin4 to inspect your database and see that there is now a `migrations` table.

Run your tests again and confirm that they fail for the correct reason.

## Passing the Test

Now if we re-run the tests, they should fail because the data is not in the table. Can you use `db.query()` to `INSERT` a new artist into the `Artist` table and return a `201` to the user?

To do this you will need to:

1. Require `db` from `src/db/index.js` at the top of your controller file: `const db = require('../src/db/index.js');`

1. Change your controller function declaration to use the `async` keyword.

1. Use `db.query()` to send the correct `SQL` to the database.

1. Send a `201` status back to the user. Use a `try/catch` block to send a `500` if there is an error.

You can see the solution to this challenge [here](https://hackmd.io/upzCjEJmTeW4d7rySTGybg)

Believe it or not, now that we have an app and test suite with a working database, we've done the most difficult part of this project.

From this point on we will just be adding additional routes, controllers and tests.

Commit and push ↗️ your progress to Github.  

Run your app with `npm start` and try adding some artists to your database using Postman. Use `pgAdmin4` to confirm that they are being inserted into the `Artist` table.
