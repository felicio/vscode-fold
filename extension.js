'use strict';

const vscode = require('vscode');

const MAX_FOLD_LEVEL = 9;

/**
 * Activates extension on an emitted event. Invoked only once.
 */
exports.activate = context => {
  let textDocuments = vscode.workspace.textDocuments;

  const subscription = vscode.workspace.onDidOpenTextDocument(document => {
    const previousTextDocuments = textDocuments;
    textDocuments = listener(document, previousTextDocuments);
  });

  context.subscriptions.push(subscription);
};

/**
 * Listens for text document `didOpen` event.
 */
function listener(document, previousTextDocuments) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const textDocuments = vscode.workspace.textDocuments;
    const activeFilePath = editor.document.fileName;

    // FIXME: Do not call fold when and editor still holds a reference to the file (e.g. tab switching)
    if (previousTextDocuments) {
      const isOpen = previousTextDocuments.find(
        previousDocument =>
          previousDocument.fileName === document.fileName.replace(/\.git$/, '')
      );

      if (isOpen) {
        return textDocuments;
      }
    }

    /* The same event this funciton listens to gets also triggered on go to
    definition of a symbol which should be ignored. */
    if (
      document.fileName === activeFilePath ||
      document.fileName === `${activeFilePath}.git`
    ) {
      const configuration = vscode.workspace.getConfiguration('fold');
      const level = configuration.get('level', 1);

      fold(level);

      return textDocuments;
    }

    return previousTextDocuments;
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
