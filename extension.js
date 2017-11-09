'use strict';

const vscode = require('vscode');

exports.activate = context => {
  const subscription = vscode.workspace.onDidOpenTextDocument(() => {
    const maximumFoldLevel = 9;
    const level = 1;

    // FIXME: First unfold
    vscode.commands.executeCommand(`editor.foldLevel${level}`);
    for(let index = level + 1; index <= maximumFoldLevel; index++) { // fold recursively
        vscode.commands.executeCommand(`editor.foldLevel${index}`);
    }
  });

  context.subscriptions.push(subscription);
};
