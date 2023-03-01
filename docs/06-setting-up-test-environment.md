:exclamation: For this project we have swapped out usual test-runner `Jest` for another common module, `Mocha`. This is because `Jest` was designed to try and run all the tests at the same time, which makes things difficult when your tests depend on whether or not certain data is in your database. This sort of interference is often referred to as a [race condition](https://www.youtube.com/watch?v=KF8dF1QS8Go).

As you will see, `Mocha` is very similar to `Jest`, and is a great addition to your `CV`.

1. Install `mocha`, `chai`, and `supertest` as `dev dependencies` using `npm i -D mocha chai supertest`.

1. In a previous step you have setup the `.env.test` with the same environment variables as your `.env`. :exclamation: Make sure to give your test database a different name. Something like `music_library_api_test` will do. Having this file will allow us to run our tests in a different database than our development one. This is handy, as our test database will be destroyed after our tests run.

1. Make a folder called `tests` in the root of your project. Add a file called `test-setup.js`
In this file we will require the `dotenv` module, and load the variables stored in our `.env.test` file.

    ```js
    const dotenv = require('dotenv');

    dotenv.config({ path: './.env.test' });
    ```

1. Make sure `.env.test` is in your`.gitignore`.

1. Add a `test` script to your `package.json` file: `mocha tests/**/*.js --exit --recursive --timeout 60000 --file ./tests/test-setup.js`.

1. Add a `pretest` script to your `package.json`. Set the command to: `node scripts/create-database.js test`. Note that this time we pass the `test` option at the end of the command. This tells the script to load the variables from `.env.test` instead of `.env`.

1. Add a `posttest` script, set the command to: `node scripts/drop-database.js`. This will delete your test database after your tests have finished running.

1. Run `npm test`. If all goes well, then mocha will just let you know that there aren't any tests yet.
