'use strict';

const vscode = require('vscode');

const MAX_FOLD_LEVEL = 9;

/**
 * Activates extension on an emitted event. Invoked only once.
 */
exports.activate = context => {
  let documents = vscode.workspace.textDocuments;

  const subscription = vscode.workspace.onDidOpenTextDocument(document => {
    const previousDocuments = documents;
    documents = listener(document, previousDocuments);
  });

  context.subscriptions.push(subscription);
};

/**
 * Listens for text document `didOpen` event.
 */
function listener(activeDocument, previousDocuments) {
  const editor = vscode.window.activeTextEditor;

  if (editor) {
    const documents = vscode.workspace.textDocuments;
    const activeFilePath = editor.document.fileName;

    /* Don't fold when editor still holds a reference to the document,
    but return state of currently opened text documents. */
    if (isOpened(activeDocument, previousDocuments)) {
      return documents;
    }

    // Ignore events emitted by go to symbol definition feature.
    if (activeDocument.fileName.replace(/\.git$/, '') === activeFilePath) {
      const configuration = vscode.workspace.getConfiguration('fold');
      const level = configuration.get('level', 1);

      fold(level);

      return documents;
    }

    return previousDocuments;
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

/**
 * Checks if text document is open.
 */
function isOpened(activeDocument, documents) {
  if (documents) {
    const document = documents.find(
      document =>
        document.fileName === activeDocument.fileName.replace(/\.git$/, '')
    );

    return document;
  }
}
