## to check for outdated deps

    npm install package@latest;

### update version in package-lock.json

## and publish a new version (and put right version number in /dist/)

    npm run preflight;

    npm run prenpmpublish;
    git commit -a -m 'bumping deps';
    git pull;git push;

### good to commit here, so published code is same as NPM code.

    npm publish --access public;

## to publish documentation

    docs on how to make docs here:
    <https://jsdoc.app/>
