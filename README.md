# Topcoder Forms UI

## Requirements

- Node.js 8+
- Npm 5+

## Run locally for development

- `$ npm install` - Installs all dependencies.
- `$ npm start` - Run application in development mode

Open browser with URL http://localhost:3000.

## NPM commands

- `$ npm start` - Run application in development mode against Topcoder development environment. In this case the frontend is build in memory by webpack server and uses dev tools like redux-logger.
- `$ npm build` - Create build for production in `/dest` folder.  Files are being minimized and `gzipped`.
- `$ npm run lint` - Check js code linting.
- `$ npm run lint:fix` - Check js code linting and trying to fix errors automatically.
- `$ npm run test` - Performs tests running. **Note** we don't really have tests, so we only keep this command run successfully.
- `$ npm run test:watch` - Performs tests on files changes.
