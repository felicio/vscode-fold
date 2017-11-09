'use strict';

const vscode = require('vscode');

const MAX_FOLD_LEVEL = 9;

/** Activates extension on an emitted event. Invoked only once. */
exports.activate = context => {
  const subscription = vscode.workspace.onDidOpenTextDocument(listener);

  context.subscriptions.push(subscription);
};

/** Listens for text document `didOpen` event. */
function listener() {
  const configuration = vscode.workspace.getConfiguration('fold');
  const level = configuration.get('level', 1);

  fold(level);
}

/** Recursively folds source code regions, except the region at the current cursor position. */
function fold(level) {
  vscode.commands.executeCommand('editor.unfoldAll');
  vscode.commands.executeCommand(`editor.foldLevel${level}`);

  for (let index = level + 1; index <= MAX_FOLD_LEVEL; index++) {
    vscode.commands.executeCommand(`editor.foldLevel${index}`);
  }
}
