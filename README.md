
# Reproduction of Renderer crash

This repo contains a minimal reproducible code for the Firefly crash for Electron versions > 14.
The main reason this occurs, is the deprecation of `allowRendererProcessReuse` property of Electron (which is set to `true` in this version).
It relates how native modules are compiled and reused across renderer sessions

See more information about the issue [here](https://github.com/electron/electron/issues/18397)

# Instructions
Only tested on linux.

1. Clone this repo
2. Run `yarn` followed by `yarn start`
3. Click the "Reload" button
4. Electron will crash

To update the bindings go to `node_modules/@iota/wallet/build/Release` and replace the index.node file with the native module