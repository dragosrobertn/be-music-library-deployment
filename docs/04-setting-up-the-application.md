Now that we have a blank repo, it's time to start setting up a basic Express application.

## Express

1. Install `express` as a dependency:

    ```
    npm i -S express
    ```

1. Make a `src` directory inside your project folder. Put an `app.js` file in there.

    1. Require express at the top of the file: `const express = require('express');`

    1. Call express as a function, and assign it to a `const` called `app`: `const app = express();`

    1. We know that we will need to be able to access the `request.body` in this project, so we should also configure the app to use `express.json`: `app.use(express.json());`

    1. Finally, export your app at the bottom of the file with `module.exports = app;`

1. Make a file in the root of project called `index.js`.

    1. Require your app at the top of this file.

    1. Declare a const called `APP_PORT` and set it to a value of 4000. This is the port that we will configure our app to listen on.

    1. Call `app.listen` as a function. The first argument it takes will be `APP_PORT`.

    1. The second argument `app.listen` will take is an arrow function. In this arrow function you should ``console.log(`App is listening on port ${APP_PORT}`)``



Your `src/app.js` should now look like this:

```js
const express = require('express');

const app = express();

app.use(express.json());

module.exports = app;
```

And your `index.js` should look like this:

```js
const app = require('./src/app.js');

const APP_PORT = 4000;

app.listen(APP_PORT, () => {
  console.log(`App is listening on port ${APP_PORT}`)
})
```

If you run the command `node index.js` in the terminal, you should see that your app is running. It won't do anything yet though, we haven't given it any routes or controllers.

Right now, we will need to restart our app every time we make any changes to the code. This can get tedious fast. To help make the development cycle a bit smoother, we will use `nodemon`.

## Nodemon

Nodemon (short for `node demon`), is a package which will watch our project files and wait for them to be updated. When it detects this, it will restart our application. This means that any changes to the code will be reflected in our app right away.

1. Install `nodemon` as a `dev dependency` using the `-D` flag by running `npm i -D nodemon`

1. Add a `start` script to your `package.json`. It should run the command `nodemon index.js`

1. Test your `start` script by running `npm start` in your terminal.

## Finally

Add a get route to `/` in your `app.js`. It should return a `200` status code and a `Hello World` string. Run your app and send a `GET` request to `localhost:4000` in postman. If you get a `Hello World` then you know that your app is working.
