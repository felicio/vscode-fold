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
 * Folds regions of default level and all their inner regions up to level 7.
 * @param resourceUri
 */
function foldLevelDefault(resourceUri) {
  const configuration = vscode.workspace.getConfiguration('fold', resourceUri);
  let level = configuration.get('level');

  if (level <= 0 || level > 7) {
    level = 2 // Extension default set in package.json
  }

  vscode.commands.executeCommand('editor.unfoldAll');
  for (let i = level; i <= 7; i++) {
    vscode.commands.executeCommand(`editor.foldLevel${i}`);
  }
}
