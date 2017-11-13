# Contributing to Visual Studio Code Fold Extension

## ECMAScript Edition Compatibility

The extension runs inside separate Node.js process termed **Extension Host**. Together with compatibility [table](http://node.green) and `node` version (under which the extension will run) one is able to determine language features that can be used in the source without transpiling.

Determine Node.js version:

- See what version of `vscode` engine is this extension locked down to in its [manifest](./package.json).
- Use the number to get tagged revision of VS Code's `package.json` found [here](https://github.com/Microsoft/vscode/blob/master/package.json).
- See `electronVersion` field in the file.
- Use that to get tagged revision of Electron's Node.js dependency found [here](https://github.com/electron/electron/blob/master/.node-version)
