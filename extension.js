'use strict';

const vscode = require('vscode');

exports.activate = context => {
  const registeredFoldingCommand = vscode.commands.registerTextEditorCommand(
    'fold.foldLevelDefault',
    editor => foldLevelDefault(editor.document.uri)
  );

  let documents = vscode.workspace.textDocuments;

  const changedVisibleTextEditorsListener = vscode.window.onDidChangeVisibleTextEditors(
    editors => {
      const activeTextEditor = vscode.window.activeTextEditor;

      if (editors.length !== 0 && activeTextEditor) {
        const activeTextDocument = activeTextEditor.document;

        if (!documents.includes(activeTextDocument)) {
          activeTextEditor.selection = setCursorPosition();

          foldLevelDefault(activeTextDocument.uri);
        }

        documents = vscode.workspace.textDocuments;
      }
    }
  );

  context.subscriptions.push(
    registeredFoldingCommand,
    changedVisibleTextEditorsListener
  );
};

/**
 * Folds regions of default level and all their inner regions.
 * @param resourceUri
 */
function foldLevelDefault(resourceUri) {
  const configuration = vscode.workspace.getConfiguration('fold', resourceUri);
  const level = configuration.get('level');

  vscode.commands.executeCommand('editor.unfoldAll');
  vscode.commands.executeCommand(`editor.foldLevel${level}`);
  for (let i = level + 1; i <= 7; i++) {
    vscode.commands.executeCommand(`editor.foldLevel${i}`);
  }
}

/**
 * Returns empty selection positioned to beginning of text document.
 */
function setCursorPosition() {
  const position = new vscode.Position(0, 0);

  return new vscode.Selection(position, position);
}
