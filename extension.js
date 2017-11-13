'use strict';

const vscode = require('vscode');

const MAX_FOLD_LEVEL = 9;

/**
 * Activates extension on an emitted event. Invoked only once.
 */
exports.activate = context => {
  const foldCommand = vscode.commands.registerCommand(
    'fold.foldLevelDefault',
    () => {
      const foldLevel = getFoldLevel();

      fold(foldLevel);
    }
  );

  let documents = vscode.workspace.textDocuments;
  const textDocumentListener = vscode.workspace.onDidOpenTextDocument(
    document => {
      const previousDocuments = documents;
      documents = listener(document, previousDocuments);
    }
  );

  context.subscriptions.push(foldCommand, textDocumentListener);
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
      const foldLevel = getFoldLevel();

      setCursorPosition(editor);
      fold(foldLevel);

      return documents;
    }

    return previousDocuments;
  }
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

/**
 * Sets cursor position to the top of text document.
 */
function setCursorPosition(editor) {
  const position = new vscode.Position(0, 0);
  const selection = new vscode.Selection(position, position);
  editor.selection = selection;
}

/**
 * Gets default fold level.
 */
function getFoldLevel() {
  const configuration = vscode.workspace.getConfiguration('fold');
  const foldLevel = configuration.get('level', 2);

  return foldLevel;
}
