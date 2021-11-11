## to check for outdated deps

    npm install package@latest;

### update version in package-lock.json

    npm run preflight;

## to publish a new version

    npm --no-git-tag-version version patch;

### good to commit here, so published code is same as NPM code.

    npm publish --access public;

## to publish documentation

    docs on how to make docs here:
    <https://jsdoc.app/>
