Now it's time to get our app talking to our development database. To do this, we will need to put usernames/passwords in our app. To prevent these falling into the wrong hands, we want to avoid committing them to Github.

We also want to make sure that our app connects to the development database when we run it on our computer, the test database when we run the tests, and the live database when we deploy it to the internet.

To do this, we will store our credentials and secrets in our `environment`. To help with this, we will use a package called `dotenv`.

## Dotenv

dotenv is a package which lets us load `environment variables` from a file. Environment variables are simply variables that are stored in the terminal of your computer. You can set one with `export VARIABLE_NAME=value`.

Try it, in your terminal `export` a variable called `NAME`, and set the value to your name. You can then print that variable with `echo $NAME`. After you close the terminal the variable will be forgotten.

We can access these variables in `node` with the `process.env` object. For example, you could print that `NAME` variable in JavaScript with `console.log(process.env.NAME)`.

1. Install `dotenv` as a `dev dependency` with `npm i -D dotenv`

1. We need to configure our `start` script to use `dotenv` to load our `environment variables`. Change your `start` script in `package.json` to `nodemon -r dotenv/config index.js`

1. You will now need a file to store your environment variables. Make a new file called `.env`. Store the following inside it:

    ```
    PGUSER=postgres
    PGHOST=localhost
    PGPASSWORD=password
    PGDATABASE=music_library_dev
    PGPORT=5432
    PORT=3000
    ```

1. We will also need a second database for when we start running tests. Make another file called `.env.test` and store the same environment variables in it. Change the `PGDATABASE` to `music_library_test`.

1. To test the app is loading the environment variables, we are going to run the app on the port that we have stored in the `.env` file. To do this, change the `APP_PORT` declaration to:

    ```js
    // index.js
    ...
    const APP_PORT = process.env.PORT || 4000;
    ...
    ```

1. Run your app again (you will need to restart it for the environment variables to be loaded). Your app should now be running on port 3000. If you delete that line from your `.env` and rerun your app, you will see that it goes back to running on 4000.

1. Finally, make sure `.env` and `.env.test` are in your`.gitignore`, so your credentials don't get commited to Github.

## Making The Database Scripts

When starting the application or running the tests, we want to ensure that there is a database available to connect to. Let's add two utility scripts:

- First script - `create-database.js` will run *before* our app or tests start, to make sure the database exists and contains the correct tables.
- The second one - `drop-database.js` will run *after* our tests to tear down the test database. This will ensure our tests have a fresh database each time they run.

Ready? 🚀 Let's start: 

1. We will use the `pg` module to connect to our databases. Install it with `npm i -S pg`

1. Make a new directory in your project folder called `scripts`.

1. Make two new files in this directory, `create-database.js` and `drop-database.js`.

### create-database.js

Put the following in your `create-database` script:

```js
// scripts/create-database.js

// require the pg package
const { Client } = require('pg')
const path = require('path')

// capture first command line argument passed to this script
const envName = process.argv.slice(2)[0]

// this function decides whether to load .env or .env.test.

const loadEnv = (envName) => {
  const { NODE_ENV } = process.env
  if (NODE_ENV != 'production') {
  
    const envFile = envName === 'test' ? '../.env.test' : '../.env'
    
    require('dotenv').config({
      path: path.join(__dirname, envFile),
    })
  
    // capture the name of the database so we can create it
    const databaseName = process.env.PGDATABASE
  
    // remove the name of the database from the environment, so pg doesn't try to connect to a db which doesn't exist yet
    delete process.env.PGDATABASE

    return databaseName
  }
}

const createDatabase = async (databaseName) => {
  // create a new client, it will automatically load the connection details from process.env
  const client = new Client()
  try {
    await client.connect()
  
    console.log(`Creating ${databaseName} database...`)
  
    await client.query(`CREATE DATABASE ${databaseName}`)
  
    console.log('Database created!')
  } catch (err) {

    switch (err.code) {
    // this is the postgres error code for when a database already exists. You could store this in a constant to make the code more readable
    case "42P04":
      console.log('Database already exists!')
      break
    default:
      console.log(err)
    }
  } finally {
    client.end()
  }
}

const databaseName = loadEnv(envName)
createDatabase(databaseName)
```

Comments have been added to help you understand what the code is doing. You can remove them from your version if you prefer. Feel free to try out some refactors to make the code a bit more modular.

### drop-database.js

The drop database script is a lot less complex. In this script, we simply want to connect to the database and run a `DROP DATABASE` statement. Can you use the content of `create-database.js` to write this script?

This script will only run after our tests, so there is no need to load anything other than `.env.test`.

You can find a solution to this challenge [here](https://hackmd.io/lz-IQtL9RaKUrzOUkabwBg).

## Running the Scripts

Now that the scripts are in place, we want to configure `package.json` to run them before the app runs and after the tests finish.

We can use the `prestart`, `pretest` and `posttest` hooks to do this. `Node` will run these commands automatically whenever we run `npm start` or `npm test`.

Change the scripts in your `package.json` to look like this:

```json
...
  "scripts": {
    "prestart": "node scripts/create-database.js",
    "start": "nodemon -r dotenv/config index.js",
  },
...
```

We will add the `test` and `posttest` commands in the next step.

When you are done, run `npm start` again. Check your console for errors. If none appear, then check `pgAdmin` to see if your database was created.

Commit your work to git and move on to the next step.

- **Read** [:books: Documentation - pg](https://node-postgres.com/)
- **Read** [:books: Documentation - Dotenv](https://github.com/motdotla/dotenv)
- **Read** [:books: Documentation - Nodemon](https://www.npmjs.com/package/nodemon)
