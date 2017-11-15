'use strict';

const vscode = require('vscode');

const MAX_FOLD_LEVEL = 9;

/**
 * Activates extension on an emitted event. Invoked only once.
 */
exports.activate = context => {
  const foldCommand = vscode.commands.registerTextEditorCommand(
    'fold.foldLevelDefault',
    editor => {
      const foldLevel = getFoldLevel(editor.document.uri);

      fold(foldLevel);
    }
  );

  let documents = vscode.workspace.textDocuments;

  const openedTextDocumentListener = vscode.workspace.onDidOpenTextDocument(
    document => {
      const previousDocuments = documents;
      documents = foldTextDocument(document, previousDocuments);
    }
  );

  const closedTextDocumentListener = vscode.workspace.onDidCloseTextDocument(
    document => {
      if (document.uri.scheme === 'file') {
        documents = vscode.workspace.textDocuments;
      }
    }
  );

  context.subscriptions.push(
    foldCommand,
    openedTextDocumentListener,
    closedTextDocumentListener
  );
};

/**
 * Listens for text document `didOpen` event.
 */
function foldTextDocument(activeDocument, previousDocuments) {
  if (activeDocument.uri.scheme === 'file') {
    const documents = vscode.workspace.textDocuments;
    const editors = vscode.window.visibleTextEditors;

    // Ignore events emitted by Go to Symbol Definition feature.
    /* TODO: Distinquish between document being opened by user or Go to Symbol.
    Return if later applies. */

    // Don't fold when editor still holds a reference to the document
    // TODO: Fold document

    return documents;
  }

  return previousDocuments;
}

/**
 * Recursively folds source code regions, except the region at the current cursor position.
 */
function fold(foldLevel) {
  vscode.commands.executeCommand('editor.unfoldAll');
  vscode.commands.executeCommand(`editor.foldLevel${foldLevel}`);

  for (let index = foldLevel + 1; index <= MAX_FOLD_LEVEL; index++) {
    vscode.commands.executeCommand(`editor.foldLevel${index}`);
  }
}

/**
 * Gets default fold level.
 */
function getFoldLevel(resourceUri) {
  const configuration = vscode.workspace.getConfiguration('fold', resourceUri);
  const foldLevel = configuration.get('level');

  return foldLevel;
}
