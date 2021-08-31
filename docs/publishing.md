## to check for outdated deps

    npm update;
    npm outdated;
    npm install package@latest;

## to publish a new version

    npm --no-git-tag-version version patch;

### update version in package-lock.json

    npm run publish-preflight;

    npm run commit patch "bumping deps";

    npm publish --access public;

## to publish documentation

    docs on how to make docs here:
    <https://github.com/documentationjs/documentation#readme>
