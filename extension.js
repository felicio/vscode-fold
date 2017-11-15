'use strict';

const vscode = require('vscode');

const MAX_FOLD_LEVEL = 9;

/**
 * Activates extension on an emitted event. Invoked only once.
 */
exports.activate = context => {
  const registeredFoldCommand = vscode.commands.registerTextEditorCommand(
    'fold.foldLevelDefault',
    editor => {
      const foldLevel = getFoldLevel(editor.document.uri);

      fold(foldLevel);
    }
  );

  let documents = vscode.workspace.textDocuments;

  const changedVisibleTextEditorsListener = vscode.window.onDidChangeVisibleTextEditors(
    editors => {
      const activeTextEditor = vscode.window.activeTextEditor;

      if (editors.length !== 0 && activeTextEditor) {
        const activeTextDocument = activeTextEditor.document;

        if (!documents.includes(activeTextDocument)) {
          const foldLevel = getFoldLevel(activeTextDocument.uri);
          activeTextEditor.selection = setCursorPosition();

          fold(foldLevel);
        }

        documents = vscode.workspace.textDocuments;
      }
    }
  );

  context.subscriptions.push(
    registeredFoldCommand,
    changedVisibleTextEditorsListener
  );
};

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

/**
 * Returns empty selection positioned to beginning of text document.
 */
function setCursorPosition() {
  const position = new vscode.Position(0, 0);

  return new vscode.Selection(position, position);
}
