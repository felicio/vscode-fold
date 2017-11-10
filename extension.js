'use strict';

const vscode = require('vscode');

const MAX_FOLD_LEVEL = 9;

/**
 * Activates extension on an emitted event. Invoked only once.
 */
exports.activate = context => {
  const subscription = vscode.workspace.onDidOpenTextDocument(listener);

  context.subscriptions.push(subscription);
};

/**
 * Listens for text document `didOpen` event.
 */
function listener(textDocument) {
  const rootPath = vscode.workspace.rootPath;

  /* The same event this funciton listens to gets also triggered on go to
  definition of a symbol which should be ignored. */
  if (textDocument.fileName.startsWith(rootPath)) {
    const configuration = vscode.workspace.getConfiguration('fold');
    const level = configuration.get('level', 1);

    fold(level);
  }
}

/**
 * Recursively folds source code regions, except the region at the current cursor position.
 */
function fold(level) {
  vscode.commands.executeCommand('editor.unfoldAll');
  vscode.commands.executeCommand(`editor.foldLevel${level}`);

  for (let index = level + 1; index <= MAX_FOLD_LEVEL; index++) {
    vscode.commands.executeCommand(`editor.foldLevel${index}`);
  }
}
