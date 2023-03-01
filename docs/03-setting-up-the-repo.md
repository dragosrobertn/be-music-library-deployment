We're going to start by setting up a basic project repository.

1.  Create a new directory of the project. You can call it whatever you like, something along the lines of `music-library` would work.

1.  Initialize a git repo with `git init`.

1.  Add a `README.md` file in the root of your `music-library` folder. Use this file to document your project. you can find a guide on what should go in a `README` [here](https://meakaakka.medium.com/a-beginners-guide-to-writing-a-kickass-readme-7ac01da88ab3).

1.  Create a remote repository for the project on Github.

1.  Connect your remote and local repositories. There will be instructions on how to do this on Github.

1.  Initialize a node project in your folder with `npm init -y`. This will create a default `package.json`.

1.  Create a `.gitignore` file. You can do this automatically with `npx gitignore node`, `npx` is similar to `npm`, but is used to run scripts without having to store them on your computer. This will create a new file filled with common `.gitignore` entries.

1.  Set up `eslint` in this project with `npx eslint --init`. Answer the question to configure it for common js that runs in node. You should end up with a `.eslintrc.json` file which looks like this:

    ```json
    {
      "env": {
        "commonjs": true,
        "es6": true,
        "node": true,
        "mocha": true
      },
      "extends": "eslint:recommended",
      "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
      },
      "parserOptions": {
        "ecmaVersion": 2018
      },
      "rules": {}
    }
    ```

1. We are also going to use `Prettier` to format our code. Install the `Prettier` VS Code extension for javascript, and create a new file called `.prettierrc.json`. This should contain:

    ```json
    {
      "trailingComma": "es5",
      "tabWidth": 2,
      "semi": true,
      "singleQuote": true
    }
    ```

  You can format all the files in your project with the command `npx prettier --write .`. Its best to do this just before committing code to github.

1.  Commit and push your work so far. A commit message of "initial commit" will do.
