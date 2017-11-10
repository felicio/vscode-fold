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
function listener(document) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const activeFilePath = editor.document.fileName;

    /* The same event this funciton listens to gets also triggered on go to
    definition of a symbol which should be ignored. */
    if (
      document.fileName === activeFilePath ||
      document.fileName === `${activeFilePath}.git`
    ) {
      const configuration = vscode.workspace.getConfiguration('fold');
      const level = configuration.get('level', 1);

      // FIXME: Do not call when file is still open in an editor (e.g. tab switching)
      fold(level);
    }
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
